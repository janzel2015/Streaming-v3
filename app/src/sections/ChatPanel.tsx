import { useState, useRef, useEffect } from 'react';
import { useStream } from '@/store/StreamContext';
import { MessageSquare, Youtube, Twitch, Send, Power, PowerOff, Trash2, Users } from 'lucide-react';

export function ChatPanel() {
  const { state, addMessage, connectChat, disconnectChat } = useStream();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    addMessage({
      username: state.settings.username,
      message: inputMessage,
      platform: 'mock',
    });
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="h-3 w-3 text-[#FF0000]" />;
      case 'twitch':
        return <Twitch className="h-3 w-3 text-[#9146FF]" />;
      default:
        return <MessageSquare className="h-3 w-3 text-[#A7B0C8]" />;
    }
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

  return (
    <div className="flex h-full flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F2F5FF]">Live Chat</h2>
          <div className="flex items-center gap-2 text-sm text-[#A7B0C8]">
            <Users className="h-4 w-4" />
            <span>{state.messages.length} messages</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Platform Connect Buttons */}
          <button
            onClick={() => connectChat('mock')}
            disabled={state.chatConnected}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
              state.chatConnected && state.chatPlatform === 'mock'
                ? 'border-[#2EE6FF] bg-[rgba(46,230,255,0.15)] text-[#2EE6FF]'
                : 'border-[rgba(46,230,255,0.2)] text-[#A7B0C8] hover:border-[rgba(46,230,255,0.4)]'
            }`}
            title="Mock Chat"
          >
            <MessageSquare className="h-4 w-4" />
          </button>

          <button
            onClick={() => connectChat('youtube')}
            disabled={state.chatConnected}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
              state.chatConnected && state.chatPlatform === 'youtube'
                ? 'border-[#FF0000] bg-[rgba(255,0,0,0.15)] text-[#FF0000]'
                : 'border-[rgba(46,230,255,0.2)] text-[#A7B0C8] hover:border-[rgba(46,230,255,0.4)]'
            }`}
            title="YouTube"
          >
            <Youtube className="h-4 w-4" />
          </button>

          <button
            onClick={() => connectChat('twitch')}
            disabled={state.chatConnected}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
              state.chatConnected && state.chatPlatform === 'twitch'
                ? 'border-[#9146FF] bg-[rgba(145,70,255,0.15)] text-[#9146FF]'
                : 'border-[rgba(46,230,255,0.2)] text-[#A7B0C8] hover:border-[rgba(46,230,255,0.4)]'
            }`}
            title="Twitch"
          >
            <Twitch className="h-4 w-4" />
          </button>

          {/* Connect/Disconnect */}
          {state.chatConnected ? (
            <button
              onClick={disconnectChat}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#FF2D6E] bg-[rgba(255,45,110,0.1)] text-[#FF2D6E] transition-all duration-200 hover:bg-[rgba(255,45,110,0.2)]"
              title="Disconnect"
            >
              <PowerOff className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => connectChat('mock')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#27FB5B] bg-[rgba(39,251,91,0.1)] text-[#27FB5B] transition-all duration-200 hover:bg-[rgba(39,251,91,0.2)]"
              title="Connect"
            >
              <Power className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div
        className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 ${
          state.chatConnected
            ? 'border-[rgba(39,251,91,0.3)] bg-[rgba(39,251,91,0.1)]'
            : 'border-[rgba(255,45,110,0.3)] bg-[rgba(255,45,110,0.1)]'
        }`}
      >
        <div className={`h-2 w-2 rounded-full ${state.chatConnected ? 'bg-[#27FB5B]' : 'bg-[#FF2D6E]'}`} />
        <span className="text-sm">
          {state.chatConnected
            ? `Connected to ${state.chatPlatform?.charAt(0).toUpperCase()}${state.chatPlatform?.slice(1)}`
            : 'Disconnected'}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.4)] p-4"
      >
        {state.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-[#A7B0C8]">
            <MessageSquare className="mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs opacity-70">Connect to a platform to see chat</p>
          </div>
        ) : (
          <div className="space-y-2">
            {state.messages.map((msg) => (
              <div key={msg.id} className="chat-message group">
                <div className="flex-shrink-0 pt-0.5">{getPlatformIcon(msg.platform)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`chat-username text-sm font-semibold ${getPlatformColor(msg.platform)}`}>
                      {msg.username}
                    </span>
                    <span className="chat-timestamp">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="chat-text break-words text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="input-field flex-1"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#2EE6FF] to-[#1DD4EC] text-[#070A12] transition-all duration-200 hover:shadow-[0_0_20px_rgba(46,230,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {/* Clear Chat */}
      <button
        onClick={() => {
          if (confirm('Clear all messages?')) {
            // Clear messages via dispatch
          }
        }}
        className="mt-2 flex items-center justify-center gap-2 text-xs text-[#A7B0C8] hover:text-[#FF2D6E]"
      >
        <Trash2 className="h-3 w-3" />
        Clear Chat History
      </button>
    </div>
  );
}
