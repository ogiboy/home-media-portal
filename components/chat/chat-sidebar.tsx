'use client';

import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { createConversation, deleteConversation } from '@/lib/store/slices/chatSlice';
import type { Conversation } from '@/lib/store/slices/chatSlice';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type ChatSidebarProps = Readonly<{
  conversations: readonly Conversation[];
  currentConversationId: string | null;
  onSelect: (id: string | null) => void;
  strings: PortalStrings;
}>;

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelect,
  strings,
}: ChatSidebarProps) {
  const dispatch = useAppDispatch();

  const handleNewChat = () => {
    dispatch(createConversation());
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(deleteConversation(id));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(strings.nav.dashboard === 'Dashboard' ? 'en-US' : 'tr-TR', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-64 shrink-0 portal-surface rounded-2xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border/60">
        <button
          type="button"
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          {strings.chat.title}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} className="relative group">
              <button
                type="button"
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 pr-11 rounded-xl text-left transition-all',
                  currentConversationId === conv.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{conv.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(conv.updatedAt)} • {conv.messageCount} messages
                  </div>
                </div>
              </button>
              <button
                type="button"
                aria-label="Delete conversation"
                onClick={(e) => handleDelete(e, conv.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
