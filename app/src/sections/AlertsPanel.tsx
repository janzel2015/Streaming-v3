import { useState } from 'react';
import { useStream } from '@/store/StreamContext';
import { UserPlus, Heart, DollarSign, Users, Play, Volume2, VolumeX, Settings2 } from 'lucide-react';
import type { AlertType, AlertConfig } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

const alertDefaults: Record<AlertType, { username: string; amount?: number; message?: string }> = {
  follow: { username: 'NewFollower' },
  subscribe: { username: 'NewSubscriber' },
  donation: { username: 'GenerousDonor', amount: 10, message: 'Love the stream!' },
  raid: { username: 'RaidingStreamer', message: '50' },
  host: { username: 'HostingStreamer', message: '100' },
};

export function AlertsPanel() {
  const { state, triggerAlert, updateAlertConfig } = useStream();
  const [editingConfig, setEditingConfig] = useState<AlertConfig | null>(null);

  const handleTestAlert = (type: AlertType) => {
    const defaults = alertDefaults[type];
    triggerAlert(type, defaults.username, defaults.amount, defaults.message);
  };

  const handleSaveConfig = () => {
    if (!editingConfig) return;
    updateAlertConfig(editingConfig);
    setEditingConfig(null);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#F2F5FF]">Alerts</h2>
        <p className="text-sm text-[#A7B0C8]">Configure stream alerts and notifications</p>
      </div>

      {/* Active Alerts Preview */}
      {state.alerts.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-[#A7B0C8]">Currently Showing</h3>
          <div className="space-y-2">
            {state.alerts.map((alert) => {
              const IconComponent = alertIcons[alert.type];
              const config = state.alertConfigs.find((c) => c.type === alert.type);
              const template = config?.template || '{username}';
              const message = template
                .replace('{username}', alert.username)
                .replace('{amount}', alert.amount?.toString() || '')
                .replace('{count}', alert.message || '');

              return (
                <div key={alert.id} className="alert-box">
                  <IconComponent className="mx-auto mb-2 h-8 w-8 text-[#2EE6FF]" />
                  <p className="text-lg font-bold text-[#F2F5FF]">{message}</p>
                  <p className="text-xs text-[#A7B0C8]">
                    {alert.message && alert.type !== 'raid' && alert.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Alert Types */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#A7B0C8]">Alert Types</h3>

        {state.alertConfigs.map((config) => {
          const IconComponent = alertIcons[config.type];
          const gradientClass = alertColors[config.type];

          return (
            <div
              key={config.type}
              className="glass-panel-hover flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass}`}>
                  <IconComponent className="h-6 w-6 text-[#070A12]" />
                </div>
                <div>
                  <h3 className="font-semibold capitalize text-[#F2F5FF]">{config.type}</h3>
                  <p className="text-xs text-[#A7B0C8]">{config.template}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound Toggle */}
                <button
                  onClick={() => updateAlertConfig({ ...config, soundEnabled: !config.soundEnabled })}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    config.soundEnabled
                      ? 'bg-[rgba(46,230,255,0.15)] text-[#2EE6FF]'
                      : 'bg-[rgba(255,45,110,0.1)] text-[#FF2D6E]'
                  }`}
                  title={config.soundEnabled ? 'Sound On' : 'Sound Off'}
                >
                  {config.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                {/* Settings */}
                <button
                  onClick={() => setEditingConfig(config)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A7B0C8] transition-colors hover:bg-[rgba(46,230,255,0.1)] hover:text-[#2EE6FF]"
                  title="Edit"
                >
                  <Settings2 className="h-4 w-4" />
                </button>

                {/* Test Button */}
                <button
                  onClick={() => handleTestAlert(config.type)}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-[rgba(46,230,255,0.15)] px-3 text-sm font-medium text-[#2EE6FF] transition-all duration-200 hover:bg-[rgba(46,230,255,0.25)]"
                >
                  <Play className="h-3 w-3" />
                  Test
                </button>

                {/* Enable Toggle */}
                <button
                  onClick={() => updateAlertConfig({ ...config, enabled: !config.enabled })}
                  className={`toggle-track ${config.enabled ? 'active' : ''}`}
                >
                  <div className="toggle-knob" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Config Dialog */}
      <Dialog open={!!editingConfig} onOpenChange={() => setEditingConfig(null)}>
        <DialogContent className="border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.98)] text-[#F2F5FF]">
          <DialogHeader>
            <DialogTitle className="capitalize">{editingConfig?.type} Alert Settings</DialogTitle>
          </DialogHeader>
          {editingConfig && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm text-[#A7B0C8]">Message Template</label>
                <input
                  type="text"
                  value={editingConfig.template}
                  onChange={(e) => setEditingConfig({ ...editingConfig, template: e.target.value })}
                  placeholder="{username} followed!"
                  className="input-field w-full"
                />
                <p className="mt-1 text-xs text-[#A7B0C8]">
                  Use {'{username}'}, {'{amount}'}, {'{count}'} as placeholders
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#A7B0C8]">Animation</label>
                <select
                  value={editingConfig.animation}
                  onChange={(e) => setEditingConfig({ ...editingConfig, animation: e.target.value as any })}
                  className="input-field w-full"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="bounce">Bounce</option>
                  <option value="pulse">Pulse</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#A7B0C8]">Duration (ms)</label>
                <input
                  type="number"
                  value={editingConfig.duration}
                  onChange={(e) => setEditingConfig({ ...editingConfig, duration: parseInt(e.target.value) })}
                  min="1000"
                  max="30000"
                  step="500"
                  className="input-field w-full"
                />
              </div>

              <button onClick={handleSaveConfig} className="btn-primary w-full">
                Save Changes
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Tips */}
      <div className="mt-6 rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(46,230,255,0.05)] p-4">
        <p className="text-sm text-[#A7B0C8]">
          <span className="text-[#2EE6FF]">Tip:</span> Alerts appear on the overlay page and in OBS. 
          Test each alert type before going live.
        </p>
      </div>
    </div>
  );
}
