import { useStream } from '@/store/StreamContext';
import { UserPlus, Heart, DollarSign, Users } from 'lucide-react';
import type { AlertType } from '@/types';

interface AlertsOverlayProps {
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

export function AlertsOverlay({ transparent = true }: AlertsOverlayProps) {
  const { state } = useStream();

  // Get active alerts
  const activeAlerts = state.alerts;

  return (
    <div
      className={`flex h-screen w-full items-start justify-center p-8 ${
        transparent ? '' : 'bg-[#070A12]'
      }`}
      style={{
        background: transparent ? 'transparent' : undefined,
      }}
    >
      <div className="w-full max-w-xl space-y-4">
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
              className="alert-enter rounded-2xl border border-[rgba(46,230,255,0.3)] p-6 text-center backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${bgColor} 0%, rgba(13, 18, 32, 0.8) 100%)`,
                boxShadow: `0 0 40px ${bgColor}`,
              }}
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass}`}>
                <IconComponent className="h-8 w-8 text-[#070A12]" />
              </div>
              <h3 className="mb-1 text-2xl font-bold capitalize text-[#F2F5FF]">
                {alert.type}
              </h3>
              <p className="text-xl text-[#2EE6FF]">{message}</p>
              {alert.message && alert.type !== 'raid' && (
                <p className="mt-2 text-sm text-[#A7B0C8]">{alert.message}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
