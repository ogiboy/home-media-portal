import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import {
  createConversation,
  getConversations,
  deleteConversation,
  getConversation,
} from '@/lib/chat-db';
import { getUserByTailnetId, upsertUser } from '@/lib/access-db';

export const dynamic = 'force-dynamic';

async function getUserId(request: NextRequest): Promise<number | null> {
  const cookieStore = await cookies();
  const tailnetId = cookieStore.get('tailnet_id')?.value;
  
  if (!tailnetId) {
    // Fallback to IP-based identification
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Create or get user based on IP
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

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const conversations = getConversations(userId);
    // Convert IDs to strings for frontend
    const formattedConversations = conversations.map(conv => ({
      id: String(conv.id),
      title: conv.title,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
      messageCount: conv.message_count,
    }));
    return Response.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title = 'New Chat' } = body;
    
    const conversation = createConversation(userId, title);
    // Convert IDs to strings for frontend
    const formattedConversation = {
      id: String(conversation.id),
      title: conversation.title,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
      messageCount: conversation.message_count,
    };
    return Response.json(formattedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');
    
    if (!conversationId) {
      return Response.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }
    
    // Verify the conversation belongs to the user
    const conversation = getConversation(Number(conversationId), userId);
    if (!conversation) {
      return Response.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    deleteConversation(Number(conversationId), userId);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
