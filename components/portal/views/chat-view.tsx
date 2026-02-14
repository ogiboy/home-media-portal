import type { PortalStrings } from '@/lib/i18n';
import ChatContainer from '@/components/chat/chat-container';

type ChatViewProps = Readonly<{
  strings: PortalStrings;
}>;

export default function ChatView({ strings }: ChatViewProps) {
  return (
    <div className="w-full">
      <ChatContainer strings={strings} />
    </div>
  );
}
