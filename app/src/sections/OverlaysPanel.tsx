import { useState } from 'react';
import { useStream } from '@/store/StreamContext';
import { Plus, MessageSquare, Bell, List, Target, Type, Eye, EyeOff } from 'lucide-react';
import type { Overlay } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const overlayIcons: Record<string, React.ElementType> = {
  chat: MessageSquare,
  alerts: Bell,
  events: List,
  goals: Target,
  text: Type,
};

const overlayColors: Record<string, string> = {
  chat: 'from-[#2EE6FF] to-[#1DD4EC]',
  alerts: 'from-[#8B5CF6] to-[#A78BFA]',
  events: 'from-[#27FB5B] to-[#1DD4EC]',
  goals: 'from-[#FFD166] to-[#FFB800]',
  text: 'from-[#FF2D6E] to-[#FF6B9D]',
};

export function OverlaysPanel() {
  const { state, toggleOverlay, updateOverlay } = useStream();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOverlayName, setNewOverlayName] = useState('');
  const [newOverlayType, setNewOverlayType] = useState<'chat' | 'alerts' | 'events' | 'goals' | 'text'>('text');

  const handleAddOverlay = () => {
    if (!newOverlayName.trim()) return;

    const newOverlay: Overlay = {
      id: `overlay-${Date.now()}`,
      name: newOverlayName,
      type: newOverlayType,
      enabled: true,
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
      config: newOverlayType === 'text' ? {
        text: 'New Text Overlay',
        fontSize: 24,
        color: '#2EE6FF',
        backgroundColor: 'transparent',
        animation: 'fade',
      } : {},
    };

    updateOverlay(newOverlay);
    setNewOverlayName('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F2F5FF]">Overlays</h2>
          <p className="text-sm text-[#A7B0C8]">Manage OBS browser sources</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Overlay
            </button>
          </DialogTrigger>
          <DialogContent className="border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.98)] text-[#F2F5FF]">
            <DialogHeader>
              <DialogTitle>Add New Overlay</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm text-[#A7B0C8]">Overlay Name</label>
                <input
                  type="text"
                  value={newOverlayName}
                  onChange={(e) => setNewOverlayName(e.target.value)}
                  placeholder="e.g., Top Donation"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-[#A7B0C8]">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['chat', 'alerts', 'events', 'goals', 'text'] as const).map((type) => {
                    const IconComponent = overlayIcons[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setNewOverlayType(type)}
                        className={`flex items-center gap-2 rounded-lg border p-3 transition-all duration-200 ${
                          newOverlayType === type
                            ? 'border-[#2EE6FF] bg-[rgba(46,230,255,0.15)] text-[#2EE6FF]'
                            : 'border-[rgba(46,230,255,0.2)] text-[#A7B0C8] hover:border-[rgba(46,230,255,0.4)]'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm capitalize">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleAddOverlay} className="btn-primary w-full">
                Add Overlay
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overlays List */}
      <div className="space-y-3">
        {state.overlays.map((overlay, index) => {
          const IconComponent = overlayIcons[overlay.type] || Type;
          const gradientClass = overlayColors[overlay.type] || 'from-[#2EE6FF] to-[#1DD4EC]';

          return (
            <div
              key={overlay.id}
              className="overlay-item animate-slide-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradientClass}`}>
                  <IconComponent className="h-5 w-5 text-[#070A12]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#F2F5FF]">{overlay.name}</h3>
                  <p className="text-xs text-[#A7B0C8] capitalize">{overlay.type} Overlay</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleOverlay(overlay.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    overlay.enabled
                      ? 'bg-[rgba(39,251,91,0.15)] text-[#27FB5B]'
                      : 'bg-[rgba(255,45,110,0.1)] text-[#FF2D6E]'
                  }`}
                  title={overlay.enabled ? 'Visible in OBS' : 'Hidden'}
                >
                  {overlay.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleOverlay(overlay.id)}
                  className={`toggle-track ${overlay.enabled ? 'active' : ''}`}
                >
                  <div className="toggle-knob" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlay URLs */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-medium text-[#A7B0C8]">OBS Browser Source URLs</h3>
        
        {['chat', 'alerts', 'all'].map((type) => (
          <div
            key={type}
            className="flex items-center justify-between rounded-lg border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.5)] p-3"
          >
            <span className="text-sm capitalize text-[#F2F5FF]">{type} Overlay</span>
            <button
              onClick={() => {
                const url = `${window.location.origin}/overlay/${type}?scene=${state.activeSceneId || 'gaming'}`;
                navigator.clipboard.writeText(url);
              }}
              className="text-xs text-[#2EE6FF] hover:underline"
            >
              Copy URL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
