'use client';

// Chat popup with messages, input, and suggestions.
import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Server,
  CloudRain,
  Film,
  Search,
  Zap,
  Loader2,
} from 'lucide-react';

import {
  chatStore,
  addUserMessage,
  addAssistantMessage,
  updateLastAssistantMessage,
} from '@/lib/chat-store';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type ChatPopupProps = {
  strings: PortalStrings;
  className?: string;
};

type Suggestion = {
  id: string;
  label: string;
  icon: typeof Server;
  action: string;
};

export default function ChatPopup({
  strings,
  className,
}: Readonly<ChatPopupProps>) {
  const { isOpen, messages, isLoading } = useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getSnapshot,
    chatStore.getServerSnapshot,
  );
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions: Suggestion[] = [
    {
      id: 'server-status',
      label: strings.chat.suggestions.serverStatus,
      icon: Server,
      action: 'Sunucu durumu ne?',
    },
    {
      id: 'downloads',
      label: strings.chat.suggestions.downloads,
      icon: CloudRain,
      action: 'Şu anda ne indiriliyor?',
    },
    {
      id: 'new-movies',
      label: strings.chat.suggestions.newMovies,
      icon: Film,
      action: 'Son eklenen filmler neler?',
    },
    {
      id: 'weather',
      label: strings.chat.suggestions.weather,
      icon: CloudRain,
      action: 'Hava durumu nasıl?',
    },
    {
      id: 'search',
      label: strings.chat.suggestions.searchMedia,
      icon: Search,
      action: 'Film ara: ',
    },
    {
      id: 'quick',
      label: strings.chat.suggestions.quickActions,
      icon: Zap,
      action: 'Hızlı aksiyonları göster',
    },
  ];

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    addUserMessage(messageText);

    // Simulate AI response (placeholder - will be replaced with Ollama integration)
    addAssistantMessage('', true);

    // Simulate response delay
    setTimeout(() => {
      const responses: Record<string, string> = {
        'Sunucu durumu ne?':
          'Sunucu durumu sorgulanıyor... CPU: %45, RAM: 6.2GB/8GB, Disk: %72 kullanımda. Uptime: 12 gün.',
        'Şu anda ne indiriliyor?':
          'Aktif indirmeler: 1. "The Matrix" (2.3GB/4.2GB) - %55, ETA: 45 dk.',
        'Son eklenen filmler neler?':
          'Son eklenen 3 film: 1. Dune: Part Two (2024), 2. Oppenheimer (2023), 3. The Batman (2022)',
        'Hava durumu nasıl?':
          'İstanbul için: Bugün 18°C, parçalı bulutlu. Nem: %65, rüzgar: 12km/s KB',
        'Hızlı aksiyonları göster':
          'Kullanılabilir hızlı aksiyonlar:\n• Tüm servisleri yeniden başlat\n• Disk temizliği yap\n• Yedekleme başlat\n• Sunucuyu yeniden başlat',
      };

      const exactMatch = responses[messageText];

      // Check for partial matches
      let response =
        exactMatch ||
        'Mesajını aldım. Bu özellik yakında Ollama entegrasyonuyla daha akıllı hale gelecek. Şimdilik şu komutları deneyebilirsin: "sunucu durumu", "indirmeler", "hava durumu"';

      // Check if message starts with any known command
      for (const [key, value] of Object.entries(responses)) {
        if (messageText.toLowerCase().includes(key.toLowerCase())) {
          response = value;
          break;
        }
      }

      updateLastAssistantMessage(response);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.id === 'search') {
      setInput(suggestion.action);
      inputRef.current?.focus();
    } else {
      handleSend(suggestion.action);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            'fixed bottom-24 right-6 z-40 flex w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_24px_64px_rgba(0,0,0,0.25)]',
            className,
          )}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/60 bg-muted/50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{strings.chat.title}</h3>
              <p className="text-xs text-muted-foreground">
                {strings.chat.description}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex max-h-100 min-h-50 flex-col overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {strings.chat.welcome}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start',
                  )}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground',
                    )}
                  >
                    {message.isThinking ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{strings.chat.thinking}</span>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 border-t border-border/60 bg-muted/30 px-4 py-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <suggestion.icon className="h-3 w-3" />
                {suggestion.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-end gap-2 border-t border-border/60 p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={strings.chat.placeholder}
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
