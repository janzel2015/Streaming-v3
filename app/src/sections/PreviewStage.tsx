import { useStream } from '@/store/StreamContext';
import { Monitor, Maximize2 } from 'lucide-react';

export function PreviewStage() {
  const { state, getActiveScene } = useStream();
  const activeScene = getActiveScene();

  return (
    <div className="flex h-full flex-col">
      {/* Stage Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="h-5 w-5 text-[#2EE6FF]" />
          <h2 className="text-lg font-semibold text-[#F2F5FF]">Preview</h2>
          <span className="rounded-full bg-[rgba(46,230,255,0.1)] px-2.5 py-0.5 text-xs mono text-[#2EE6FF]">
            1920×1080
          </span>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(46,230,255,0.2)] text-[#A7B0C8] transition-all duration-200 hover:border-[rgba(46,230,255,0.4)] hover:text-[#2EE6FF]">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Stage Canvas */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-[rgba(46,230,255,0.2)] bg-[#0D1220] shadow-[0_0_40px_rgba(139,92,246,0.1)]">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg animate-grid-pulse opacity-60" />
        
        {/* Preview Content */}
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          {/* Scene Name */}
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm text-[#A7B0C8]">Current Scene</p>
            <h3 className="text-3xl font-bold text-gradient">
              {activeScene?.name || 'No Scene Selected'}
            </h3>
          </div>

          {/* Enabled Overlays Preview */}
          <div className="w-full max-w-2xl">
            <p className="mb-3 text-xs text-[#A7B0C8] mono">ACTIVE OVERLAYS</p>
            <div className="flex flex-wrap gap-2">
              {state.overlays
                .filter((o) => o.enabled)
                .map((overlay) => (
                  <span
                    key={overlay.id}
                    className="rounded-full border border-[rgba(46,230,255,0.3)] bg-[rgba(46,230,255,0.1)] px-3 py-1 text-xs text-[#2EE6FF]"
                  >
                    {overlay.name}
                  </span>
                ))}
              {state.overlays.filter((o) => o.enabled).length === 0 && (
                <span className="text-sm text-[#A7B0C8]">No overlays enabled</span>
              )}
            </div>
          </div>

          {/* OBS Hint */}
          <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.7)] p-4">
            <p className="text-sm text-[#A7B0C8]">
              <span className="text-[#2EE6FF]">Tip:</span> Stream to OBS using the overlay URL as a Browser Source.
              Copy the URL from the top bar.
            </p>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[rgba(46,230,255,0.3)]" />
        <div className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-[rgba(46,230,255,0.3)]" />
        <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-[rgba(46,230,255,0.3)]" />
        <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[rgba(46,230,255,0.3)]" />
      </div>
    </div>
  );
}
