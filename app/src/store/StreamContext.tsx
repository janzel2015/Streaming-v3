import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type {
  Scene,
  Overlay,
  ChatMessage,
  Alert,
  AlertConfig,
  AlertType,
  StreamSettings,
} from '@/types';
import {
  DEFAULT_SCENES,
  DEFAULT_OVERLAYS,
  DEFAULT_ALERT_CONFIGS,
  DEFAULT_SETTINGS,
  MOCK_CHAT_MESSAGES,
} from '@/types';

// State interface
interface StreamState {
  scenes: Scene[];
  activeSceneId: string | null;
  overlays: Overlay[];
  messages: ChatMessage[];
  chatConnected: boolean;
  chatPlatform: 'youtube' | 'twitch' | 'mock' | null;
  maxMessages: number;
  alerts: Alert[];
  alertConfigs: AlertConfig[];
  settings: StreamSettings;
  isStreaming: boolean;
  streamStartTime: number | null;
  activePanel: 'scenes' | 'overlays' | 'chat' | 'alerts' | 'settings';
}

// Action types
type Action =
  | { type: 'SET_SCENES'; payload: Scene[] }
  | { type: 'ADD_SCENE'; payload: Scene }
  | { type: 'UPDATE_SCENE'; payload: Scene }
  | { type: 'DELETE_SCENE'; payload: string }
  | { type: 'SET_ACTIVE_SCENE'; payload: string }
  | { type: 'SET_OVERLAYS'; payload: Overlay[] }
  | { type: 'UPDATE_OVERLAY'; payload: Overlay }
  | { type: 'TOGGLE_OVERLAY'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_CHAT_CONNECTED'; payload: boolean }
  | { type: 'SET_CHAT_PLATFORM'; payload: 'youtube' | 'twitch' | 'mock' | null }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'REMOVE_ALERT'; payload: string }
  | { type: 'SET_ALERT_CONFIGS'; payload: AlertConfig[] }
  | { type: 'UPDATE_ALERT_CONFIG'; payload: AlertConfig }
  | { type: 'SET_SETTINGS'; payload: StreamSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<StreamSettings> }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_STREAM_START_TIME'; payload: number | null }
  | { type: 'SET_ACTIVE_PANEL'; payload: 'scenes' | 'overlays' | 'chat' | 'alerts' | 'settings' }
  | { type: 'LOAD_STATE'; payload: Partial<StreamState> };

// Initial state
const initialState: StreamState = {
  scenes: DEFAULT_SCENES,
  activeSceneId: 'gaming',
  overlays: DEFAULT_OVERLAYS,
  messages: MOCK_CHAT_MESSAGES,
  chatConnected: false,
  chatPlatform: null,
  maxMessages: 100,
  alerts: [],
  alertConfigs: DEFAULT_ALERT_CONFIGS,
  settings: DEFAULT_SETTINGS,
  isStreaming: false,
  streamStartTime: null,
  activePanel: 'scenes',
};

// Reducer
function streamReducer(state: StreamState, action: Action): StreamState {
  switch (action.type) {
    case 'SET_SCENES':
      return { ...state, scenes: action.payload };
    case 'ADD_SCENE':
      return { ...state, scenes: [...state.scenes, action.payload] };
    case 'UPDATE_SCENE':
      return {
        ...state,
        scenes: state.scenes.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE_SCENE':
      return {
        ...state,
        scenes: state.scenes.filter((s) => s.id !== action.payload),
        activeSceneId: state.activeSceneId === action.payload ? state.scenes[0]?.id || null : state.activeSceneId,
      };
    case 'SET_ACTIVE_SCENE':
      return { ...state, activeSceneId: action.payload };
    case 'SET_OVERLAYS':
      return { ...state, overlays: action.payload };
    case 'UPDATE_OVERLAY':
      return {
        ...state,
        overlays: state.overlays.map((o) => (o.id === action.payload.id ? action.payload : o)),
      };
    case 'TOGGLE_OVERLAY':
      return {
        ...state,
        overlays: state.overlays.map((o) =>
          o.id === action.payload ? { ...o, enabled: !o.enabled } : o
        ),
      };
    case 'ADD_MESSAGE':
      const newMessages = [...state.messages, action.payload];
      if (newMessages.length > state.maxMessages) {
        newMessages.shift();
      }
      return { ...state, messages: newMessages };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload.slice(-state.maxMessages) };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SET_CHAT_CONNECTED':
      return { ...state, chatConnected: action.payload };
    case 'SET_CHAT_PLATFORM':
      return { ...state, chatPlatform: action.payload };
    case 'ADD_ALERT':
      return { ...state, alerts: [...state.alerts, action.payload] };
    case 'REMOVE_ALERT':
      return { ...state, alerts: state.alerts.filter((a) => a.id !== action.payload) };
    case 'SET_ALERT_CONFIGS':
      return { ...state, alertConfigs: action.payload };
    case 'UPDATE_ALERT_CONFIG':
      return {
        ...state,
        alertConfigs: state.alertConfigs.map((c) =>
          c.type === action.payload.type ? action.payload : c
        ),
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };
    case 'SET_STREAM_START_TIME':
      return { ...state, streamStartTime: action.payload };
    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Context
interface StreamContextType {
  state: StreamState;
  dispatch: React.Dispatch<Action>;
  // Helper functions
  addScene: (scene: Omit<Scene, 'id' | 'createdAt'>) => void;
  updateScene: (scene: Scene) => void;
  deleteScene: (id: string) => void;
  setActiveScene: (id: string) => void;
  toggleOverlay: (id: string) => void;
  updateOverlay: (overlay: Overlay) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  connectChat: (platform: 'youtube' | 'twitch' | 'mock') => void;
  disconnectChat: () => void;
  triggerAlert: (type: AlertType, username: string, amount?: number, message?: string) => void;
  removeAlert: (id: string) => void;
  updateAlertConfig: (config: AlertConfig) => void;
  updateSettings: (settings: Partial<StreamSettings>) => void;
  startStreaming: () => void;
  stopStreaming: () => void;
  setActivePanel: (panel: 'scenes' | 'overlays' | 'chat' | 'alerts' | 'settings') => void;
  getActiveScene: () => Scene | null;
  getEnabledOverlays: () => Overlay[];
  getStreamDuration: () => string;
  generateOverlayUrl: (type: string) => string;
}

const StreamContext = createContext<StreamContextType | null>(null);

// Provider
export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(streamReducer, initialState);
  const chatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aether-stream-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    const toSave = {
      scenes: state.scenes,
      activeSceneId: state.activeSceneId,
      overlays: state.overlays,
      alertConfigs: state.alertConfigs,
      settings: state.settings,
      maxMessages: state.maxMessages,
    };
    localStorage.setItem('aether-stream-state', JSON.stringify(toSave));
  }, [state.scenes, state.activeSceneId, state.overlays, state.alertConfigs, state.settings, state.maxMessages]);

  // Stream timer
  useEffect(() => {
    if (state.isStreaming && state.streamStartTime) {
      streamTimerRef.current = setInterval(() => {
        // Force re-render for timer update
        dispatch({ type: 'SET_STREAMING', payload: true });
      }, 1000);
    } else {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    }
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, [state.isStreaming, state.streamStartTime]);

  // Mock chat messages
  useEffect(() => {
    if (state.chatConnected && state.chatPlatform === 'mock') {
      const mockUsers = ['nightOwl', 'kira_dev', 'pixel', 'streamFan99', 'codeNinja', 'designGuru', 'techieTom', 'creativeCat'];
      const mockMessages = [
        'looking great! 🔥',
        'love the overlay',
        'what game is this?',
        'first time here!',
        'smooth transitions',
        'amazing quality',
        'hello from Brazil!',
        'can you show settings?',
        'nice alerts!',
        'GG!',
        'how long have you been streaming?',
        'this is awesome',
      ];

      chatIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.6) {
          const username = mockUsers[Math.floor(Math.random() * mockUsers.length)];
          const message = mockMessages[Math.floor(Math.random() * mockMessages.length)];
          addMessage({ username, message, platform: 'mock' });
        }
      }, 3000);
    } else {
      if (chatIntervalRef.current) {
        clearInterval(chatIntervalRef.current);
      }
    }
    return () => {
      if (chatIntervalRef.current) {
        clearInterval(chatIntervalRef.current);
      }
    };
  }, [state.chatConnected, state.chatPlatform]);

  // Helper functions
  const addScene = useCallback((scene: Omit<Scene, 'id' | 'createdAt'>) => {
    const newScene: Scene = {
      ...scene,
      id: `scene-${Date.now()}`,
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_SCENE', payload: newScene });
  }, []);

  const updateScene = useCallback((scene: Scene) => {
    dispatch({ type: 'UPDATE_SCENE', payload: scene });
  }, []);

  const deleteScene = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SCENE', payload: id });
  }, []);

  const setActiveScene = useCallback((id: string) => {
    dispatch({ type: 'SET_ACTIVE_SCENE', payload: id });
  }, []);

  const toggleOverlay = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_OVERLAY', payload: id });
  }, []);

  const updateOverlay = useCallback((overlay: Overlay) => {
    dispatch({ type: 'UPDATE_OVERLAY', payload: overlay });
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  }, []);

  const connectChat = useCallback((platform: 'youtube' | 'twitch' | 'mock') => {
    dispatch({ type: 'SET_CHAT_PLATFORM', payload: platform });
    dispatch({ type: 'SET_CHAT_CONNECTED', payload: true });
  }, []);

  const disconnectChat = useCallback(() => {
    dispatch({ type: 'SET_CHAT_CONNECTED', payload: false });
    dispatch({ type: 'SET_CHAT_PLATFORM', payload: null });
  }, []);

  const triggerAlert = useCallback((type: AlertType, username: string, amount?: number, message?: string) => {
    const config = state.alertConfigs.find((c) => c.type === type);
    if (!config || !config.enabled) return;

    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      username,
      message,
      amount,
      timestamp: Date.now(),
      duration: config.duration,
    };
    dispatch({ type: 'ADD_ALERT', payload: alert });

    // Auto-remove after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_ALERT', payload: alert.id });
    }, config.duration);
  }, [state.alertConfigs]);

  const removeAlert = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id });
  }, []);

  const updateAlertConfig = useCallback((config: AlertConfig) => {
    dispatch({ type: 'UPDATE_ALERT_CONFIG', payload: config });
  }, []);

  const updateSettings = useCallback((settings: Partial<StreamSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const startStreaming = useCallback(() => {
    dispatch({ type: 'SET_STREAMING', payload: true });
    dispatch({ type: 'SET_STREAM_START_TIME', payload: Date.now() });
  }, []);

  const stopStreaming = useCallback(() => {
    dispatch({ type: 'SET_STREAMING', payload: false });
    dispatch({ type: 'SET_STREAM_START_TIME', payload: null });
  }, []);

  const setActivePanel = useCallback((panel: 'scenes' | 'overlays' | 'chat' | 'alerts' | 'settings') => {
    dispatch({ type: 'SET_ACTIVE_PANEL', payload: panel });
  }, []);

  const getActiveScene = useCallback(() => {
    return state.scenes.find((s) => s.id === state.activeSceneId) || null;
  }, [state.scenes, state.activeSceneId]);

  const getEnabledOverlays = useCallback(() => {
    return state.overlays.filter((o) => o.enabled);
  }, [state.overlays]);

  const getStreamDuration = useCallback(() => {
    if (!state.isStreaming || !state.streamStartTime) return '00:00:00';
    const diff = Date.now() - state.streamStartTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [state.isStreaming, state.streamStartTime]);

  const generateOverlayUrl = useCallback((type: string) => {
    const baseUrl = window.location.origin;
    const scene = state.activeSceneId || 'gaming';
    return `${baseUrl}/overlay/${type}?scene=${scene}`;
  }, [state.activeSceneId]);

  const value: StreamContextType = {
    state,
    dispatch,
    addScene,
    updateScene,
    deleteScene,
    setActiveScene,
    toggleOverlay,
    updateOverlay,
    addMessage,
    connectChat,
    disconnectChat,
    triggerAlert,
    removeAlert,
    updateAlertConfig,
    updateSettings,
    startStreaming,
    stopStreaming,
    setActivePanel,
    getActiveScene,
    getEnabledOverlays,
    getStreamDuration,
    generateOverlayUrl,
  };

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

// Hook
export function useStream() {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
}
