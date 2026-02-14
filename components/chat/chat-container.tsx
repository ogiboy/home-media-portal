'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { fetchConversations, setCurrentConversation } from '@/lib/store/slices/chatSlice';
import type { PortalStrings } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import ChatSidebar from './chat-sidebar';
import ChatHeader from './chat-header';
import MessageList from './message-list';
import ChatInput from './chat-input';

type ChatContainerProps = Readonly<{
  strings: PortalStrings;
}>;

export default function ChatContainer({ strings }: ChatContainerProps) {
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { messages, isLoading, currentConversationId, conversations } = useAppSelector(
    (state) => state.chat
  );

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (id: string | null) => {
    dispatch(setCurrentConversation(id));
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="h-[calc(100vh-280px)] min-h-100 md:h-[calc(100vh-240px)] lg:h-[calc(100vh-200px)]">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 px-4 py-2 portal-surface rounded-xl text-sm font-medium"
        >
          <Menu className="h-4 w-4" />
          {sidebarOpen ? 'Hide Conversations' : 'Show Conversations'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-full gap-4">
        {/* Sidebar - Hidden on mobile by default, shown when toggled */}
        <div
          className={cn(
            'lg:block lg:w-64 shrink-0',
            sidebarOpen ? 'block' : 'hidden'
          )}
        >
          <ChatSidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelect={handleSelectConversation}
            strings={strings}
          />
        </div>

        {/* Main chat area - Full width on mobile when sidebar hidden */}
        <div
          className={cn(
            'flex-1 flex flex-col portal-surface rounded-2xl overflow-hidden min-h-0',
            sidebarOpen ? 'hidden lg:flex' : 'flex'
          )}
        >
          <ChatHeader 
            strings={strings} 
            conversationId={currentConversationId}
          />
          
          <div className="flex-1 overflow-hidden min-h-0">
            <MessageList 
              messages={messages}
              isLoading={isLoading}
              strings={strings}
            />
          </div>
          
          <div ref={messagesEndRef} />
          
          <ChatInput 
            strings={strings}
            isLoading={isLoading}
            conversationId={currentConversationId}
          />
        </div>
      </div>
    </div>
  );
}
