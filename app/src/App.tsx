import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StreamProvider, useStream } from '@/store/StreamContext';
import { TopBar } from '@/sections/TopBar';
import { Sidebar } from '@/sections/Sidebar';
import { PreviewStage } from '@/sections/PreviewStage';
import { ScenesPanel } from '@/sections/ScenesPanel';
import { OverlaysPanel } from '@/sections/OverlaysPanel';
import { ChatPanel } from '@/sections/ChatPanel';
import { AlertsPanel } from '@/sections/AlertsPanel';
import { SettingsPanel } from '@/sections/SettingsPanel';
import { ChatOverlay, AlertsOverlay, CombinedOverlay } from '@/overlay';
import { Radio, ArrowRight } from 'lucide-react';
import './App.css';

// Welcome Page
function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070A12]">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-[#2EE6FF] to-[#8B5CF6]">
            <Radio className="h-8 w-8 text-[#070A12]" />
          </div>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-[rgba(46,230,255,0.1)]">
            <div className="h-full animate-[loading_1.5s_ease-in-out_infinite] bg-gradient-to-r from-[#2EE6FF] to-[#8B5CF6]" />
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070A12] p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg animate-grid-pulse opacity-40" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2EE6FF] to-[#8B5CF6] shadow-[0_0_60px_rgba(46,230,255,0.3)]">
          <Radio className="h-12 w-12 text-[#070A12]" />
        </div>

        {/* Title */}
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-[#F2F5FF] md:text-6xl">
          Aether
        </h1>
        <p className="mb-2 text-xl text-[#2EE6FF]">Streaming Cloud</p>
        <p className="mb-12 max-w-md text-lg text-[#A7B0C8]">
          Stream lighter. Look sharper.
        </p>

        {/* Features */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Scene Management', desc: 'Switch scenes instantly' },
            { label: 'Live Overlays', desc: 'OBS browser sources' },
            { label: 'Chat & Alerts', desc: 'Real-time interaction' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="rounded-xl border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.5)] p-4"
            >
              <p className="font-medium text-[#F2F5FF]">{feature.label}</p>
              <p className="text-sm text-[#A7B0C8]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/dashboard"
          className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2EE6FF] to-[#8B5CF6] px-8 py-4 text-lg font-semibold text-[#070A12] transition-all duration-300 hover:shadow-[0_0_40px_rgba(46,230,255,0.4)]"
        >
          Enter Dashboard
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        {/* Footer */}
        <p className="mt-12 text-sm text-[#A7B0C8]">
          No backend required. Works with OBS, YouTube, and Twitch.
        </p>
      </div>
    </div>
  );
}

// Dashboard Layout
function DashboardLayout() {
  const { state } = useStream();

  const renderPanel = () => {
    switch (state.activePanel) {
      case 'scenes':
        return <ScenesPanel />;
      case 'overlays':
        return <OverlaysPanel />;
      case 'chat':
        return <ChatPanel />;
      case 'alerts':
        return <AlertsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <ScenesPanel />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#070A12]">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-[72px]">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="ml-16 flex flex-1 gap-6 p-6">
          {/* Preview Stage */}
          <div className="flex flex-1 flex-col">
            <PreviewStage />
          </div>

          {/* Right Panel */}
          <div className="w-[360px] flex-shrink-0 overflow-hidden rounded-2xl border border-[rgba(46,230,255,0.15)] bg-[rgba(13,18,32,0.4)] animate-slide-in-right">
            {renderPanel()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Overlay Routes
function OverlayChatRoute() {
  return <ChatOverlay transparent={true} />;
}

function OverlayAlertsRoute() {
  return <AlertsOverlay transparent={true} />;
}

function OverlayAllRoute() {
  return <CombinedOverlay transparent={true} />;
}

// Main App
function App() {
  return (
    <StreamProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          {/* Overlay routes for OBS */}
          <Route path="/overlay/chat" element={<OverlayChatRoute />} />
          <Route path="/overlay/alerts" element={<OverlayAlertsRoute />} />
          <Route path="/overlay/all" element={<OverlayAllRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StreamProvider>
  );
}

export default App;
