import { useEffect, useRef } from 'react';
import { useStream } from '@/store/StreamContext';
import { MessageSquare } from 'lucide-react';

interface ChatOverlayProps {
  transparent?: boolean;
}

export function ChatOverlay({ transparent = true }: ChatOverlayProps) {
  const { state } = useStream();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'text-[#FF0000]';
      case 'twitch':
        return 'text-[#9146FF]';
      default:
        return 'text-[#2EE6FF]';
    }
  };

  // Get last 20 messages for overlay
  const recentMessages = state.messages.slice(-20);

  return (
    <div
      className={`flex h-screen w-full flex-col p-4 ${
        transparent ? '' : 'bg-[#070A12]'
      }`}
      style={{
        background: transparent ? 'transparent' : undefined,
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#2EE6FF]" />
        <span className="text-lg font-bold text-[#F2F5FF]">Live Chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2">
          {recentMessages.map((msg, index) => (
            <div
              key={msg.id}
              className="chat-message-enter rounded-lg border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.7)] p-3 backdrop-blur-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-baseline gap-2">
                <span className={`font-semibold ${getPlatformColor(msg.platform)}`}>
                  {msg.username}
                </span>
                <span className="text-xs text-[#A7B0C8] mono">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="mt-1 text-sm text-[#F2F5FF]">{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
