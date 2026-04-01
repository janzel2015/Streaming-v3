// Scene Types
export interface Scene {
  id: string;
  name: string;
  icon: string;
  overlays: string[];
  chatPosition: { x: number; y: number };
  alertsPosition: { x: number; y: number };
  createdAt: number;
}

// Overlay Types
export interface Overlay {
  id: string;
  name: string;
  type: 'chat' | 'alerts' | 'events' | 'goals' | 'text';
  enabled: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
}

export interface TextOverlay extends Overlay {
  type: 'text';
  config: {
    text: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    animation: 'none' | 'fade' | 'slide' | 'bounce';
  };
}

// Chat Types
export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  platform: 'youtube' | 'twitch' | 'mock';
  avatar?: string;
}

// Alert Types
export type AlertType = 'follow' | 'subscribe' | 'donation' | 'raid' | 'host';

export interface Alert {
  id: string;
  type: AlertType;
  username: string;
  message?: string;
  amount?: number;
  timestamp: number;
  duration: number;
}

export interface AlertConfig {
  type: AlertType;
  enabled: boolean;
  template: string;
  soundEnabled: boolean;
  soundUrl?: string;
  animation: 'fade' | 'slide' | 'bounce' | 'pulse';
  duration: number;
}

// Stream Settings
export interface StreamSettings {
  streamKey: string;
  rtmpUrl: string;
  platform: 'youtube' | 'twitch' | 'custom';
  streamUrl: string;
  videoId: string;
  overlayUrl: string;
  username: string;
  avatar: string;
}

// App State
export interface AppState {
  // Scenes
  scenes: Scene[];
  activeSceneId: string | null;
  
  // Overlays
  overlays: Overlay[];
  
  // Chat
  messages: ChatMessage[];
  chatConnected: boolean;
  chatPlatform: 'youtube' | 'twitch' | 'mock' | null;
  maxMessages: number;
  
  // Alerts
  alerts: Alert[];
  alertConfigs: AlertConfig[];
  
  // Settings
  settings: StreamSettings;
  
  // UI State
  isStreaming: boolean;
  streamStartTime: number | null;
  sidebarOpen: boolean;
  activePanel: 'scenes' | 'overlays' | 'chat' | 'alerts' | 'settings';
}

// Default scenes
export const DEFAULT_SCENES: Scene[] = [
  {
    id: 'gaming',
    name: 'Gaming',
    icon: 'Gamepad2',
    overlays: ['chat', 'alerts', 'events'],
    chatPosition: { x: 20, y: 60 },
    alertsPosition: { x: 50, y: 20 },
    createdAt: Date.now(),
  },
  {
    id: 'just-chatting',
    name: 'Just Chatting',
    icon: 'MessageCircle',
    overlays: ['chat', 'alerts'],
    chatPosition: { x: 70, y: 50 },
    alertsPosition: { x: 50, y: 15 },
    createdAt: Date.now() - 1000,
  },
  {
    id: 'starting-soon',
    name: 'Starting Soon',
    icon: 'Play',
    overlays: ['text-countdown'],
    chatPosition: { x: 20, y: 80 },
    alertsPosition: { x: 50, y: 30 },
    createdAt: Date.now() - 2000,
  },
  {
    id: 'brb',
    name: 'Be Right Back',
    icon: 'Coffee',
    overlays: ['text-brb'],
    chatPosition: { x: 20, y: 80 },
    alertsPosition: { x: 50, y: 30 },
    createdAt: Date.now() - 3000,
  },
  {
    id: 'ending',
    name: 'Ending',
    icon: 'LogOut',
    overlays: ['text-thanks'],
    chatPosition: { x: 20, y: 80 },
    alertsPosition: { x: 50, y: 30 },
    createdAt: Date.now() - 4000,
  },
];

// Default overlays
export const DEFAULT_OVERLAYS: Overlay[] = [
  {
    id: 'chat',
    name: 'Chat Box',
    type: 'chat',
    enabled: true,
    position: { x: 20, y: 60 },
    size: { width: 320, height: 400 },
    config: {},
  },
  {
    id: 'alerts',
    name: 'Alert Box',
    type: 'alerts',
    enabled: true,
    position: { x: 50, y: 20 },
    size: { width: 500, height: 200 },
    config: {},
  },
  {
    id: 'events',
    name: 'Event List',
    type: 'events',
    enabled: false,
    position: { x: 75, y: 20 },
    size: { width: 280, height: 300 },
    config: {},
  },
  {
    id: 'goals',
    name: 'Goal Bar',
    type: 'goals',
    enabled: false,
    position: { x: 50, y: 85 },
    size: { width: 600, height: 80 },
    config: { goal: 1000, current: 450, title: 'Follower Goal' },
  },
  {
    id: 'text-countdown',
    name: 'Countdown',
    type: 'text',
    enabled: true,
    position: { x: 50, y: 50 },
    size: { width: 400, height: 100 },
    config: {
      text: 'Starting in 5:00',
      fontSize: 48,
      color: '#2EE6FF',
      backgroundColor: 'transparent',
      animation: 'pulse',
    },
  },
  {
    id: 'text-brb',
    name: 'BRB Text',
    type: 'text',
    enabled: true,
    position: { x: 50, y: 50 },
    size: { width: 400, height: 100 },
    config: {
      text: 'Be Right Back!',
      fontSize: 48,
      color: '#F2F5FF',
      backgroundColor: 'rgba(13, 18, 32, 0.7)',
      animation: 'fade',
    },
  },
  {
    id: 'text-thanks',
    name: 'Thanks Text',
    type: 'text',
    enabled: true,
    position: { x: 50, y: 50 },
    size: { width: 500, height: 100 },
    config: {
      text: 'Thanks for watching!',
      fontSize: 42,
      color: '#27FB5B',
      backgroundColor: 'transparent',
      animation: 'slide',
    },
  },
];

// Default alert configs
export const DEFAULT_ALERT_CONFIGS: AlertConfig[] = [
  {
    type: 'follow',
    enabled: true,
    template: '{username} just followed!',
    soundEnabled: true,
    animation: 'slide',
    duration: 5000,
  },
  {
    type: 'subscribe',
    enabled: true,
    template: '{username} subscribed!',
    soundEnabled: true,
    animation: 'bounce',
    duration: 6000,
  },
  {
    type: 'donation',
    enabled: true,
    template: '{username} donated ${amount}!',
    soundEnabled: true,
    animation: 'pulse',
    duration: 7000,
  },
  {
    type: 'raid',
    enabled: true,
    template: '{username} raided with {count} viewers!',
    soundEnabled: true,
    animation: 'bounce',
    duration: 8000,
  },
  {
    type: 'host',
    enabled: true,
    template: '{username} is hosting you!',
    soundEnabled: true,
    animation: 'fade',
    duration: 6000,
  },
];

// Default settings
export const DEFAULT_SETTINGS: StreamSettings = {
  streamKey: '',
  rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
  platform: 'youtube',
  streamUrl: '',
  videoId: '',
  overlayUrl: '',
  username: 'StreamUser',
  avatar: '',
};

// Mock chat messages
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    username: 'nightOwl',
    message: 'looking clean 🔥',
    timestamp: Date.now() - 300000,
    platform: 'mock',
  },
  {
    id: '2',
    username: 'kira_dev',
    message: "what's the stack?",
    timestamp: Date.now() - 240000,
    platform: 'mock',
  },
  {
    id: '3',
    username: 'pixel',
    message: 'smooth transitions',
    timestamp: Date.now() - 180000,
    platform: 'mock',
  },
  {
    id: '4',
    username: 'streamFan99',
    message: 'first time here, love the vibe!',
    timestamp: Date.now() - 120000,
    platform: 'mock',
  },
  {
    id: '5',
    username: 'codeNinja',
    message: 'the overlay design is sick',
    timestamp: Date.now() - 60000,
    platform: 'mock',
  },
];
