import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  selectedModel: string;
  error: string | null;
}

type ChatRootState = { chat: ChatState };
type SendMessagePayload = { message: string; conversationId?: string };

const DONE_TOKEN = '[DONE]';
const DATA_PREFIX = 'data: ';
const FALLBACK_ERROR_MESSAGE = 'Sorry, an error occurred. Please try again.';

let fallbackCounter = 0;

const generateId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  fallbackCounter += 1;
  return `${Date.now()}-${fallbackCounter.toString(36)}`;
};

const createUserMessage = (message: string): ChatMessage => ({
  id: generateId(),
  role: 'user',
  content: message,
  timestamp: Date.now(),
});

const createAssistantMessage = (model: string): ChatMessage => ({
  id: generateId(),
  role: 'assistant',
  content: '',
  timestamp: Date.now(),
  isStreaming: true,
  model,
});

const parseStreamContent = (line: string): string | null => {
  if (!line.startsWith(DATA_PREFIX)) {
    return null;
  }

  const payload = line.slice(DATA_PREFIX.length);
  if (payload === DONE_TOKEN) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as { content?: string };
    return typeof parsed.content === 'string' ? parsed.content : null;
  } catch {
    return null;
  }
};

const requestChatStream = async (payload: {
  message: string;
  model: string;
  conversationId?: string;
}): Promise<Response> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response;
};

const readAssistantStream = async (
  response: Response,
  onChunk: (content: string) => void,
): Promise<void> => {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return;
    }

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      const parsedContent = parseStreamContent(line);
      if (parsedContent) {
        fullContent += parsedContent;
        onChunk(fullContent);
      }
    }
  }
};

const initialState: ChatState = {
  isOpen: false,
  messages: [],
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  selectedModel: 'qwen2.5:3b-instruct-q4_K_M',
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { message, conversationId }: SendMessagePayload,
    { dispatch, getState },
  ) => {
    const state = getState() as ChatRootState;
    const model = state.chat.selectedModel;
    const shouldGenerateTitle =
      state.chat.messages.length === 2 && !conversationId;

    const userMessage = createUserMessage(message);
    const assistantMessage = createAssistantMessage(model);

    dispatch(addMessage(userMessage));
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(addMessage(assistantMessage));

    try {
      const response = await requestChatStream({
        message,
        model,
        conversationId,
      });

      await readAssistantStream(response, (content) => {
        dispatch(
          updateMessageContent({
            id: assistantMessage.id,
            content,
          }),
        );
      });

      dispatch(finishStreaming(assistantMessage.id));

      if (shouldGenerateTitle) {
        dispatch(
          generateTitle({ message, conversationId: assistantMessage.id }),
        );
      }
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : 'Unknown error'),
      );
      dispatch(
        updateMessageContent({
          id: assistantMessage.id,
          content: FALLBACK_ERROR_MESSAGE,
        }),
      );
      dispatch(finishStreaming(assistantMessage.id));
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const generateTitle = createAsyncThunk(
  'chat/generateTitle',
  async ({
    message,
    conversationId,
  }: {
    message: string;
    conversationId: string;
  }) => {
    try {
      const response = await fetch('/api/chat/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const { title } = await response.json();
        return { conversationId, title };
      }
    } catch {
      // Fallback to default title
    }
    return { conversationId, title: 'New Chat' };
  },
);

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    const response = await fetch('/api/chat/conversations');
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return response.json();
  },
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (conversationId: string) => {
    const response = await fetch(`/api/chat/conversations/${conversationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }
    return response.json();
  },
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async () => {
    const response = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Chat' }),
    });
    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }
    return response.json();
  },
);

export const deleteConversation = createAsyncThunk(
  'chat/deleteConversation',
  async (conversationId: string) => {
    const response = await fetch(
      `/api/chat/conversations?id=${conversationId}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete conversation');
    }
    return conversationId;
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    updateMessageContent: (
      state,
      action: PayloadAction<{ id: string; content: string }>,
    ) => {
      const message = state.messages.find((m) => m.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
      }
    },
    finishStreaming: (state, action: PayloadAction<string>) => {
      const message = state.messages.find((m) => m.id === action.payload);
      if (message) {
        message.isStreaming = false;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentConversationId = null;
    },
    setCurrentConversation: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.currentConversationId = action.payload.id;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.currentConversationId = action.payload.id;
        state.messages = [];
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (c) => c.id !== action.payload,
        );
        if (state.currentConversationId === action.payload) {
          state.currentConversationId = null;
          state.messages = [];
        }
      })
      .addCase(generateTitle.fulfilled, (state, action) => {
        const conversation = state.conversations.find(
          (c) => c.id === action.payload.conversationId,
        );
        if (conversation) {
          conversation.title = action.payload.title;
        }
      });
  },
});

export const {
  openChat,
  closeChat,
  toggleChat,
  addMessage,
  updateMessageContent,
  finishStreaming,
  setLoading,
  setError,
  setSelectedModel,
  clearMessages,
  setCurrentConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
