'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setSelectedModel } from '@/lib/store/slices/chatSlice';
import type { PortalStrings } from '@/lib/i18n';
import { Bot, Settings2 } from 'lucide-react';

type ChatHeaderProps = Readonly<{
  strings: PortalStrings;
  conversationId: string | null;
}>;

const models = [
  { id: 'qwen2.5:3b-instruct-q4_K_M', name: 'Qwen 2.5 3B' },
  { id: 'llama3.2:1b', name: 'Llama 3.2 1B' },
  { id: 'llama3.2:3b', name: 'Llama 3.2 3B' },
];

export default function ChatHeader({ strings, conversationId }: ChatHeaderProps) {
  const dispatch = useAppDispatch();
  const { selectedModel } = useAppSelector((state) => state.chat);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{strings.chat.title}</h2>
          <p className="text-sm text-muted-foreground">
            {conversationId ? 'Active conversation' : 'New conversation'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Settings2 className="h-4 w-4" />
          <span>Model:</span>
        </div>
        <select
          value={selectedModel}
          onChange={(e) => dispatch(setSelectedModel(e.target.value))}
          className="px-3 py-1.5 rounded-lg bg-background border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
