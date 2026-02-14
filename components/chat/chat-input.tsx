'use client';

import { useState, useRef } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { sendMessage, createConversation } from '@/lib/store/slices/chatSlice';
import type { PortalStrings } from '@/lib/i18n';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatInputProps = Readonly<{
  strings: PortalStrings;
  isLoading: boolean;
  conversationId: string | null;
}>;

const suggestions: readonly string[] = [
  'Sunucu durumu nedir?',
  'Hava durumu nasıl?',
  'Yeni filmler neler?',
  'İndirmeleri göster',
];

export default function ChatInput({
  strings,
  isLoading,
  conversationId,
}: ChatInputProps) {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');

    // Create conversation if needed
    let currentId = conversationId;
    if (!currentId) {
      const result = await dispatch(createConversation());
      if (createConversation.fulfilled.match(result)) {
        currentId = result.payload.id.toString();
      }
    }

    if (currentId) {
      dispatch(sendMessage({ message, conversationId: currentId }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-border/60 p-4 bg-muted/30">
      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-background border border-border/60 rounded-full hover:bg-muted hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={strings.chat.placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-background border border-border/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-xl transition-all',
            input.trim() && !isLoading
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
