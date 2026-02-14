import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { addMessage, getConversation, getMessages } from '@/lib/chat-db';
import { getUserByTailnetId, upsertUser } from '@/lib/access-db';

export const dynamic = 'force-dynamic';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DONE_EVENT = 'data: [DONE]\n\n';

type StreamChunk = {
  message?: {
    content?: string;
  };
  done?: boolean;
};

type ChatRequestBody = {
  message?: string;
  model?: string;
  conversationId?: string | number;
};

async function getUserId(request: NextRequest): Promise<number | null> {
  const cookieStore = await cookies();
  const tailnetId = cookieStore.get('tailnet_id')?.value;

  if (!tailnetId) {
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    upsertUser({
      login: `ip_${ip.replaceAll('.', '_')}`,
      displayName: `User ${ip}`,
      tailnetId: ip,
    });

    const user = getUserByTailnetId(ip);
    return user?.id ?? null;
  }

  const user = getUserByTailnetId(tailnetId);
  return user?.id ?? null;
}

const parseChunk = (line: string): StreamChunk | null => {
  try {
    return JSON.parse(line) as StreamChunk;
  } catch {
    return null;
  }
};

const toHistory = (conversationId: number | null, userId: number) => {
  if (conversationId === null) {
    return [];
  }

  return getMessages(conversationId, userId).map((m) => ({
    role: m.role,
    content: m.content,
  }));
};

const buildSseStream = (
  ollamaResponse: Response,
  conversationId: number | null,
  message: string,
  model: string
) => {
  const encoder = new TextEncoder();
  let fullResponse = '';

  return new ReadableStream({
    async start(controller) {
      const reader = ollamaResponse.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            const data = parseChunk(line);
            if (!data) {
              continue;
            }

            const token = data.message?.content;
            if (typeof token === 'string' && token.length > 0) {
              fullResponse += token;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: token })}\n\n`)
              );
            }

            if (data.done) {
              controller.enqueue(encoder.encode(DONE_EVENT));
            }
          }
        }

        if (conversationId !== null) {
          addMessage(conversationId, 'user', message);
          addMessage(conversationId, 'assistant', fullResponse, model);
        }
      } catch (error) {
        console.error('Stream error:', error);
      } finally {
        controller.close();
      }
    },
  });
};

const toConversationId = (rawConversationId?: string | number): number | null => {
  if (rawConversationId === undefined || rawConversationId === null) {
    return null;
  }

  const parsed = Number(rawConversationId);
  return Number.isFinite(parsed) ? parsed : null;
};

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as ChatRequestBody;
    const message = body.message?.trim();
    const model = body.model ?? 'qwen2.5:3b-instruct-q4_K_M';

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const conversationId = toConversationId(body.conversationId);
    if (body.conversationId !== undefined && conversationId === null) {
      return Response.json({ error: 'Conversation ID is invalid' }, { status: 400 });
    }

    if (conversationId !== null) {
      const conversation = getConversation(conversationId, userId);
      if (!conversation) {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
      }
    }

    const history = toHistory(conversationId, userId);
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [...history, { role: 'user', content: message }],
        stream: true,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      return Response.json(
        { error: `Ollama error: ${errorText}` },
        { status: ollamaResponse.status }
      );
    }

    const stream = buildSseStream(ollamaResponse, conversationId, message, model);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (response.ok) {
      const models = await response.json();
      return Response.json({ status: 'ok', models: models.models || [] });
    }
    return Response.json({ status: 'error', message: 'Ollama not reachable' });
  } catch {
    return Response.json({ status: 'error', message: 'Ollama not reachable' });
  }
}
