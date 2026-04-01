import { useStream } from '@/store/StreamContext';
import { LayoutGrid, Layers, MessageSquare, Bell, Settings } from 'lucide-react';

const sidebarItems = [
  { id: 'scenes', label: 'Scenes', icon: LayoutGrid },
  { id: 'overlays', label: 'Overlays', icon: Layers },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const { state, setActivePanel } = useStream();

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 z-30 w-16 border-r border-[rgba(46,230,255,0.15)] bg-[rgba(7,10,18,0.9)]">
      <nav className="flex flex-col items-center gap-2 py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = state.activePanel === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[rgba(46,230,255,0.15)] text-[#2EE6FF] shadow-[0_0_16px_rgba(46,230,255,0.2)]'
                  : 'text-[#A7B0C8] hover:bg-[rgba(46,230,255,0.1)] hover:text-[#2EE6FF]'
              }`}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              
              {/* Tooltip */}
              <span className="absolute left-full ml-3 whitespace-nowrap rounded-lg border border-[rgba(46,230,255,0.2)] bg-[rgba(13,18,32,0.95)] px-3 py-1.5 text-xs font-medium text-[#F2F5FF] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -right-[1px] top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-l bg-[#2EE6FF] shadow-[0_0_8px_rgba(46,230,255,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
