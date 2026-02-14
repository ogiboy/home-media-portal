'use client';

import type { ChatMessage } from '@/lib/store/slices/chatSlice';
import type { PortalStrings } from '@/lib/i18n';
import { Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

type MessageListProps = Readonly<{
  messages: readonly ChatMessage[];
  isLoading: boolean;
  strings: PortalStrings;
}>;

type MessageBubbleProps = Readonly<{
  message: ChatMessage;
  strings: PortalStrings;
}>;

function MessageBubble({ message, strings }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-4 px-6 py-4',
        isUser ? 'bg-muted/30' : 'bg-background'
      )}
    >
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary/10 text-primary'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {isUser ? 'You' : strings.chat.title}
          </span>
          {message.model && (
            <span className="text-xs text-muted-foreground">({message.model})</span>
          )}
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          {isAssistant ? (
            <ReactMarkdown>
              {message.content || (message.isStreaming ? strings.chat.thinking : '')}
            </ReactMarkdown>
          ) : (
            <p className="text-foreground">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessageList({ messages, isLoading, strings }: MessageListProps) {
  const hasMessages = messages.length > 0;

  if (hasMessages) {
    return (
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} strings={strings} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 px-6 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{strings.chat.thinking}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">{strings.chat.title}</h3>
        <p className="text-muted-foreground max-w-md">{strings.chat.welcome}</p>
      </div>
    </div>
  );
}
