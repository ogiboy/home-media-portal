// Lightweight chat store for client-side chat state management.
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isThinking?: boolean;
};

export type ChatState = {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
};

const listeners = new Set<(state: ChatState) => void>();
let state: ChatState = {
  isOpen: false,
  messages: [],
  isLoading: false,
};

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

const createId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(8);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return `${Date.now()}-${globalThis.performance?.now() ?? 0}`;
};

const serverSnapshot: ChatState = Object.freeze({
  isOpen: false,
  messages: [],
  isLoading: false,
});

export const chatStore = {
  subscribe: (listener: (state: ChatState) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => state,
  getServerSnapshot: () => serverSnapshot,
};

export const openChat = (welcomeMessage?: string) => {
  state = {
    ...state,
    isOpen: true,
    messages: welcomeMessage
      ? [
          {
            id: createId(),
            role: 'assistant' as const,
            content: welcomeMessage,
            timestamp: Date.now(),
          },
        ]
      : state.messages,
  };
  notify();
};

export const closeChat = () => {
  state = { ...state, isOpen: false };
  notify();
};

export const toggleChat = (welcomeMessage?: string) => {
  if (state.isOpen) {
    closeChat();
  } else {
    openChat(welcomeMessage);
  }
};

export const addUserMessage = (content: string) => {
  const message: ChatMessage = {
    id: createId(),
    role: 'user',
    content,
    timestamp: Date.now(),
  };
  state = {
    ...state,
    messages: [...state.messages, message],
    isLoading: true,
  };
  notify();
  return message.id;
};

export const addAssistantMessage = (content: string, isThinking = false) => {
  const message: ChatMessage = {
    id: createId(),
    role: 'assistant',
    content,
    timestamp: Date.now(),
    isThinking,
  };
  state = {
    ...state,
    messages: [...state.messages, message],
    isLoading: isThinking,
  };
  notify();
  return message.id;
};

export const updateLastAssistantMessage = (content: string) => {
  const messages = [...state.messages];
  const lastIndex = messages.findLastIndex((m) => m.role === 'assistant');
  if (lastIndex !== -1) {
    messages[lastIndex] = {
      ...messages[lastIndex],
      content,
      isThinking: false,
    };
    state = {
      ...state,
      messages,
      isLoading: false,
    };
    notify();
  }
};

export const setLoading = (isLoading: boolean) => {
  state = { ...state, isLoading };
  notify();
};

export const clearChat = () => {
  state = { ...state, messages: [], isLoading: false };
  notify();
};
