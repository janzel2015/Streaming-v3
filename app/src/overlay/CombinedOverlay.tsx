import { useEffect, useRef } from 'react';
import { useStream } from '@/store/StreamContext';
import { UserPlus, Heart, DollarSign, Users, MessageSquare } from 'lucide-react';
import type { AlertType } from '@/types';

interface CombinedOverlayProps {
  transparent?: boolean;
}

const alertIcons: Record<AlertType, React.ElementType> = {
  follow: UserPlus,
  subscribe: Heart,
  donation: DollarSign,
  raid: Users,
  host: Users,
};

const alertColors: Record<AlertType, string> = {
  follow: 'from-[#2EE6FF] to-[#1DD4EC]',
  subscribe: 'from-[#8B5CF6] to-[#A78BFA]',
  donation: 'from-[#FFD166] to-[#FFB800]',
  raid: 'from-[#27FB5B] to-[#1DD4EC]',
  host: 'from-[#FF2D6E] to-[#FF6B9D]',
};

const alertBgColors: Record<AlertType, string> = {
  follow: 'rgba(46, 230, 255, 0.15)',
  subscribe: 'rgba(139, 92, 246, 0.15)',
  donation: 'rgba(255, 209, 102, 0.15)',
  raid: 'rgba(39, 251, 91, 0.15)',
  host: 'rgba(255, 45, 110, 0.15)',
};

export function CombinedOverlay({ transparent = true }: CombinedOverlayProps) {
  const { state } = useStream();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
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

  // Get last 15 messages for overlay
  const recentMessages = state.messages.slice(-15);

  // Get active alerts
  const activeAlerts = state.alerts;

  return (
    <div
      className={`relative h-screen w-full overflow-hidden ${transparent ? '' : 'bg-[#070A12]'}`}
      style={{
        background: transparent ? 'transparent' : undefined,
      }}
    >
      {/* Alerts - Top Center */}
      {activeAlerts.length > 0 && (
        <div className="absolute left-1/2 top-8 z-20 w-full max-w-xl -translate-x-1/2">
          {activeAlerts.map((alert) => {
            const IconComponent = alertIcons[alert.type];
            const gradientClass = alertColors[alert.type];
            const bgColor = alertBgColors[alert.type];
            const config = state.alertConfigs.find((c) => c.type === alert.type);
            const template = config?.template || '{username}';
            const message = template
              .replace('{username}', alert.username)
              .replace('{amount}', alert.amount?.toString() || '')
              .replace('{count}', alert.message || '');

            return (
              <div
                key={alert.id}
                className="alert-enter mb-4 rounded-2xl border border-[rgba(46,230,255,0.3)] p-5 text-center backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${bgColor} 0%, rgba(13, 18, 32, 0.9) 100%)`,
                  boxShadow: `0 0 40px ${bgColor}`,
                }}
              >
                <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass}`}>
                  <IconComponent className="h-6 w-6 text-[#070A12]" />
                </div>
                <h3 className="mb-1 text-xl font-bold capitalize text-[#F2F5FF]">
                  {alert.type}
                </h3>
                <p className="text-lg text-[#2EE6FF]">{message}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Chat - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 w-80">
        {/* Chat Header */}
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#2EE6FF]" />
          <span className="text-sm font-bold text-[#F2F5FF]">Live Chat</span>
        </div>

        {/* Chat Messages */}
        <div className="space-y-2">
          {recentMessages.map((msg, index) => (
            <div
              key={msg.id}
              className="chat-message-enter rounded-lg border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.85)] p-2.5 backdrop-blur-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-baseline gap-1.5">
                <span className={`text-sm font-semibold ${getPlatformColor(msg.platform)}`}>
                  {msg.username}
                </span>
                <span className="text-xs text-[#A7B0C8] mono">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="mt-0.5 text-sm text-[#F2F5FF]">{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Event List - Top Right (optional, if enabled) */}
      {state.overlays.find((o) => o.id === 'events')?.enabled && (
        <div className="absolute right-4 top-4 z-10 w-64">
          <div className="rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.85)] p-3 backdrop-blur-sm">
            <h4 className="mb-2 text-sm font-semibold text-[#F2F5FF]">Recent Events</h4>
            <div className="space-y-2">
              {state.alerts.slice(-5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="capitalize text-[#A7B0C8]">{alert.type}</span>
                  <span className="text-[#2EE6FF]">{alert.username}</span>
                </div>
              ))}
              {state.alerts.length === 0 && (
                <p className="text-xs text-[#A7B0C8]">No recent events</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Goal Bar - Bottom Center (optional, if enabled) */}
      {state.overlays.find((o) => o.id === 'goals')?.enabled && (
        <div className="absolute bottom-4 left-1/2 z-10 w-full max-w-lg -translate-x-1/2">
          <div className="rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.85)] p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#F2F5FF]">Follower Goal</span>
              <span className="text-sm text-[#2EE6FF]">450 / 1000</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[rgba(46,230,255,0.1)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2EE6FF] to-[#8B5CF6] transition-all duration-500"
                style={{ width: '45%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
