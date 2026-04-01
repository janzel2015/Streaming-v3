import { useState } from 'react';
import { useStream } from '@/store/StreamContext';
import { Radio, Copy, Check, User, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopBar() {
  const { state, getStreamDuration, startStreaming, stopStreaming, generateOverlayUrl } = useStream();
  const [copied, setCopied] = useState(false);


  const handleCopyOverlayUrl = () => {
    const url = generateOverlayUrl('all');
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const streamDuration = getStreamDuration();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-[72px] border-b border-[rgba(46,230,255,0.15)] bg-[rgba(7,10,18,0.85)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2EE6FF] to-[#8B5CF6]">
            <Radio className="h-5 w-5 text-[#070A12]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#F2F5FF]">Aether</h1>
            <p className="text-xs text-[#A7B0C8] mono">Streaming Cloud</p>
          </div>
        </div>

        {/* Center - Status & Timer */}
        <div className="flex items-center gap-6">
          {/* Status Pill */}
          <div className="flex items-center gap-3 rounded-full border border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.6)] px-4 py-2">
            <div className={`status-dot ${state.isStreaming ? 'status-online' : 'status-offline'}`} />
            <span className="text-sm font-medium text-[#F2F5FF]">
              {state.isStreaming ? 'Online' : 'Offline'}
            </span>
            {state.isStreaming && (
              <span className="border-l border-[rgba(46,230,255,0.2)] pl-3 text-sm mono text-[#2EE6FF]">
                {streamDuration}
              </span>
            )}
          </div>

          {/* Stream Control */}
          <button
            onClick={state.isStreaming ? stopStreaming : startStreaming}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              state.isStreaming
                ? 'border border-[#FF2D6E] bg-[rgba(255,45,110,0.15)] text-[#FF2D6E] hover:bg-[rgba(255,45,110,0.25)]'
                : 'bg-gradient-to-r from-[#27FB5B] to-[#1DD4EC] text-[#070A12] hover:shadow-[0_0_20px_rgba(39,251,91,0.4)]'
            }`}
          >
            {state.isStreaming ? 'End Stream' : 'Go Live'}
          </button>
        </div>

        {/* Right - Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Copy Overlay URL */}
          <button
            onClick={handleCopyOverlayUrl}
            className="flex items-center gap-2 rounded-xl border border-[rgba(46,230,255,0.25)] bg-[rgba(13,18,32,0.5)] px-4 py-2 text-sm text-[#A7B0C8] transition-all duration-200 hover:border-[rgba(46,230,255,0.5)] hover:text-[#2EE6FF]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#27FB5B]" />
                <span className="text-[#27FB5B]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Overlay URL</span>
              </>
            )}
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.5)] text-[#A7B0C8] transition-all duration-200 hover:border-[rgba(46,230,255,0.4)] hover:text-[#2EE6FF]">
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.95)] text-[#F2F5FF]"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{state.settings.username}</p>
                <p className="text-xs text-[#A7B0C8]">Streamer</p>
              </div>
              <DropdownMenuItem className="cursor-pointer text-[#A7B0C8] focus:bg-[rgba(46,230,255,0.1)] focus:text-[#2EE6FF]">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
