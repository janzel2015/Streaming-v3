import { useState } from 'react';
import { useStream } from '@/store/StreamContext';
import { Settings, Link2, Youtube, Twitch, User, Save, Copy, Check, ExternalLink } from 'lucide-react';

export function SettingsPanel() {
  const { state, updateSettings } = useStream();
  const [localSettings, setLocalSettings] = useState(state.settings);
  const [saved, setSaved] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateOverlayUrl = (type: string) => {
    return `${window.location.origin}/overlay/${type}?scene=${state.activeSceneId || 'gaming'}`;
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F2F5FF]">Stream Settings</h2>
          <p className="text-sm text-[#A7B0C8]">Configure your streaming setup</p>
        </div>

        <button
          onClick={handleSave}
          className={`btn-primary flex items-center gap-2 ${saved ? 'bg-[#27FB5B]' : ''}`}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-[#A7B0C8]">
          <User className="h-4 w-4" />
          Profile
        </h3>
        <div className="glass-panel p-4">
          <div>
            <label className="mb-2 block text-sm text-[#A7B0C8]">Streamer Name</label>
            <input
              type="text"
              value={localSettings.username}
              onChange={(e) => setLocalSettings({ ...localSettings, username: e.target.value })}
              placeholder="Your streamer name"
              className="input-field w-full"
            />
          </div>
        </div>
      </div>

      {/* Platform Section */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-[#A7B0C8]">
          <Youtube className="h-4 w-4" />
          Streaming Platform
        </h3>
        <div className="glass-panel space-y-4 p-4">
          <div>
            <label className="mb-2 block text-sm text-[#A7B0C8]">Platform</label>
            <div className="flex gap-2">
              {(['youtube', 'twitch', 'custom'] as const).map((platform) => (
                <button
                  key={platform}
                  onClick={() => setLocalSettings({ ...localSettings, platform })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 transition-all duration-200 ${
                    localSettings.platform === platform
                      ? 'border-[#2EE6FF] bg-[rgba(46,230,255,0.15)] text-[#2EE6FF]'
                      : 'border-[rgba(46,230,255,0.2)] text-[#A7B0C8] hover:border-[rgba(46,230,255,0.4)]'
                  }`}
                >
                  {platform === 'youtube' && <Youtube className="h-4 w-4" />}
                  {platform === 'twitch' && <Twitch className="h-4 w-4" />}
                  {platform === 'custom' && <Settings className="h-4 w-4" />}
                  <span className="text-sm capitalize">{platform}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#A7B0C8]">RTMP URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localSettings.rtmpUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, rtmpUrl: e.target.value })}
                placeholder="rtmp://..."
                className="input-field flex-1"
              />
              <button
                onClick={() => handleCopy(localSettings.rtmpUrl, 'rtmp')}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(46,230,255,0.2)] text-[#A7B0C8] transition-all duration-200 hover:border-[rgba(46,230,255,0.4)] hover:text-[#2EE6FF]"
              >
                {copiedField === 'rtmp' ? <Check className="h-4 w-4 text-[#27FB5B]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#A7B0C8]">Stream Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={localSettings.streamKey}
                onChange={(e) => setLocalSettings({ ...localSettings, streamKey: e.target.value })}
                placeholder="Your stream key"
                className="input-field flex-1"
              />
              <button
                onClick={() => handleCopy(localSettings.streamKey, 'key')}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(46,230,255,0.2)] text-[#A7B0C8] transition-all duration-200 hover:border-[rgba(46,230,255,0.4)] hover:text-[#2EE6FF]"
              >
                {copiedField === 'key' ? <Check className="h-4 w-4 text-[#27FB5B]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Preview */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-[#A7B0C8]">
          <ExternalLink className="h-4 w-4" />
          Stream Preview
        </h3>
        <div className="glass-panel space-y-4 p-4">
          <div>
            <label className="mb-2 block text-sm text-[#A7B0C8]">YouTube Video ID or Stream URL</label>
            <input
              type="text"
              value={localSettings.videoId}
              onChange={(e) => setLocalSettings({ ...localSettings, videoId: e.target.value })}
              placeholder="e.g., dQw4w9WgXcQ or full YouTube URL"
              className="input-field w-full"
            />
          </div>
        </div>
      </div>

      {/* Overlay URLs */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-[#A7B0C8]">
          <Link2 className="h-4 w-4" />
          OBS Browser Source URLs
        </h3>
        <div className="space-y-3">
          {[
            { type: 'all', label: 'All Overlays (Combined)' },
            { type: 'chat', label: 'Chat Only' },
            { type: 'alerts', label: 'Alerts Only' },
          ].map(({ type, label }) => {
            const url = generateOverlayUrl(type);
            return (
              <div key={type} className="glass-panel p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#F2F5FF]">{label}</span>
                  <button
                    onClick={() => handleCopy(url, type)}
                    className="flex items-center gap-1 text-xs text-[#2EE6FF] hover:underline"
                  >
                    {copiedField === type ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="block truncate rounded-lg bg-[rgba(7,10,18,0.6)] px-3 py-2 text-xs text-[#A7B0C8] mono">
                  {url}
                </code>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Setup Guide */}
      <div className="rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(46,230,255,0.05)] p-4">
        <h4 className="mb-2 text-sm font-semibold text-[#F2F5FF]">Quick Setup Guide</h4>
        <ol className="list-inside list-decimal space-y-1 text-sm text-[#A7B0C8]">
          <li>Copy the "All Overlays" URL above</li>
          <li>Open OBS Studio</li>
          <li>Add a new Browser Source</li>
          <li>Paste the URL and set size to 1920×1080</li>
          <li>Stream to your platform using the RTMP URL and Stream Key</li>
        </ol>
      </div>
    </div>
  );
}
