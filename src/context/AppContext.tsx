import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DatabaseService, AuthService } from '../services/firebase';
import type { 
  Provider, 
  Question, 
  Broadcast, 
  Article, 
  Video, 
  Appointment, 
  Subscriber,
  Partner,
  Location,
  Notification
} from '../types';

// State type
interface AppState {
  providers: Provider[];
  questions: Question[];
  broadcasts: Broadcast[];
  articles: Article[];
  videos: Video[];
  appointments: Appointment[];
  subscribers: Subscriber[];
  partners: Partner[];
  locations: Location[];
  notifications: Notification[];
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_PROVIDERS'; payload: Provider[] }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_BROADCASTS'; payload: Broadcast[] }
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_VIDEOS'; payload: Video[] }
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'SET_SUBSCRIBERS'; payload: Subscriber[] }
  | { type: 'SET_PARTNERS'; payload: Partner[] }
  | { type: 'SET_LOCATIONS'; payload: Location[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_ADMIN'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PROVIDER'; payload: Provider }
  | { type: 'UPDATE_PROVIDER'; payload: { id: string; data: Partial<Provider> } }
  | { type: 'DELETE_PROVIDER'; payload: string }
  | { type: 'ADD_QUESTION'; payload: Question }
  | { type: 'ANSWER_QUESTION'; payload: { id: string; answer: string } }
  | { type: 'APPROVE_QUESTION'; payload: { id: string } }
  | { type: 'REJECT_QUESTION'; payload: { id: string; reason?: string } }
  | { type: 'ADD_BROADCAST'; payload: Broadcast }
  | { type: 'ADD_ARTICLE'; payload: Article }
  | { type: 'ADD_VIDEO'; payload: Video }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'ADD_SUBSCRIBER'; payload: Subscriber }
  | { type: 'ADD_LOCATION'; payload: Location }
  | { type: 'UPDATE_LOCATION'; payload: { id: string; data: Partial<Location> } }
  | { type: 'DELETE_LOCATION'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' };

// Initial state
const initialState: AppState = {
  providers: [],
  questions: [],
  broadcasts: [],
  articles: [],
  videos: [],
  appointments: [],
  subscribers: [],
  partners: [],
  locations: [],
  notifications: [],
  isAdmin: false,
  loading: true,
  error: null
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROVIDERS':
      return { ...state, providers: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'SET_BROADCASTS':
      return { ...state, broadcasts: action.payload };
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'SET_SUBSCRIBERS':
      return { ...state, subscribers: action.payload };
    case 'SET_PARTNERS':
      return { ...state, partners: action.payload };
    case 'SET_LOCATIONS':
      return { ...state, locations: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_PROVIDER':
      return { ...state, providers: [...state.providers, action.payload] };
    case 'UPDATE_PROVIDER':
      return {
        ...state,
        providers: state.providers.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        )
      };
    case 'DELETE_PROVIDER':
      return {
        ...state,
        providers: state.providers.filter(p => p.id !== action.payload)
      };
    case 'ADD_QUESTION':
      return { ...state, questions: [action.payload, ...state.questions] };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.id
            ? { ...q, answer: action.payload.answer, status: 'answered' as const }
            : q
        )
      };
    case 'APPROVE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.id
            ? { ...q, status: 'approved' as const, reviewedAt: new Date(), reviewedBy: 'Admin' }
            : q
        )
      };
    case 'REJECT_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.id
            ? { ...q, status: 'rejected' as const, reviewedAt: new Date(), reviewedBy: 'Admin', rejectReason: action.payload.reason || 'Rejected' }
            : q
        )
      };
    case 'ADD_BROADCAST':
      return { ...state, broadcasts: [action.payload, ...state.broadcasts] };
    case 'ADD_ARTICLE':
      return { ...state, articles: [action.payload, ...state.articles] };
    case 'ADD_VIDEO':
      return { ...state, videos: [action.payload, ...state.videos] };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [action.payload, ...state.appointments] };
    case 'ADD_SUBSCRIBER':
      return { ...state, subscribers: [...state.subscribers, action.payload] };
    case 'ADD_LOCATION':
      return { ...state, locations: [...state.locations, action.payload] };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map((l) => (l.id === action.payload.id ? { ...l, ...action.payload.data } : l)),
      };
    case 'DELETE_LOCATION':
      return { ...state, locations: state.locations.filter((l) => l.id !== action.payload) };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return { 
        ...state, 
        notifications: state.notifications.map(n => ({ ...n, read: true })) 
      };
    default:
      return state;
  }
}

// Context types
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    // Provider actions
    addProvider: (provider: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateProvider: (id: string, data: Partial<Provider>) => Promise<void>;
    deleteProvider: (id: string) => Promise<void>;
    // Question actions
    addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    answerQuestion: (id: string, answer: string) => Promise<void>;
    approveQuestion: (id: string) => Promise<void>;
    rejectQuestion: (id: string, reason?: string) => Promise<void>;
    // Broadcast actions
    addBroadcast: (broadcast: Omit<Broadcast, 'id' | 'createdAt'>) => Promise<void>;
    // Article actions
    addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateArticle: (id: string, data: Partial<Article>) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    // Video actions
    addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => Promise<void>;
    deleteVideo: (id: string) => Promise<void>;
    // Appointment actions
    addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    // Subscriber actions
    addSubscriber: (subscriber: Omit<Subscriber, 'id' | 'subscribedAt'>) => Promise<void>;
    // Auth actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;

    // Locations
    addLocation: (location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateLocation: (id: string, data: Partial<Location>) => Promise<void>;
    deleteLocation: (id: string) => Promise<void>;
    // Notifications
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
    markAllNotificationsRead: () => Promise<void>;
  };
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const [providers, questions, broadcasts, articles, videos, appointments, subscribers, partners, locations, notifications] = 
          await Promise.all([
            DatabaseService.getProviders(),
            DatabaseService.getQuestions(),
            DatabaseService.getBroadcasts(),
            DatabaseService.getArticles(),
            DatabaseService.getVideos(),
            DatabaseService.getAppointments(),
            DatabaseService.getSubscribers(),
            DatabaseService.getPartners(),
            DatabaseService.getLocations(),
            DatabaseService.getNotifications()
          ]);

        dispatch({ type: 'SET_PROVIDERS', payload: providers });
        dispatch({ type: 'SET_QUESTIONS', payload: questions });
        dispatch({ type: 'SET_BROADCASTS', payload: broadcasts });
        dispatch({ type: 'SET_ARTICLES', payload: articles });
        dispatch({ type: 'SET_VIDEOS', payload: videos });
        dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
        dispatch({ type: 'SET_SUBSCRIBERS', payload: subscribers });
        dispatch({ type: 'SET_PARTNERS', payload: partners });
        dispatch({ type: 'SET_LOCATIONS', payload: locations });
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
        
        // Check if admin is logged in
        dispatch({ type: 'SET_ADMIN', payload: AuthService.isLoggedIn() });
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Actions
  const actions = {
    addProvider: async (provider: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newProvider = await DatabaseService.addProvider(provider);
      dispatch({ type: 'ADD_PROVIDER', payload: newProvider });
    },

    updateProvider: async (id: string, data: Partial<Provider>) => {
      await DatabaseService.updateProvider(id, data);
      dispatch({ type: 'UPDATE_PROVIDER', payload: { id, data } });
    },

    deleteProvider: async (id: string) => {
      await DatabaseService.deleteProvider(id);
      dispatch({ type: 'DELETE_PROVIDER', payload: id });
    },

    addQuestion: async (question: Omit<Question, 'id' | 'createdAt' | 'status'>) => {
      const newQuestion = await DatabaseService.addQuestion(question);
      dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
    },

    answerQuestion: async (id: string, answer: string) => {
      await DatabaseService.answerQuestion(id, answer);
      dispatch({ type: 'ANSWER_QUESTION', payload: { id, answer } });
    },

    approveQuestion: async (id: string) => {
      await DatabaseService.approveQuestion(id);
      dispatch({ type: 'APPROVE_QUESTION', payload: { id } });
    },

    rejectQuestion: async (id: string, reason?: string) => {
      await DatabaseService.rejectQuestion(id, reason);
      dispatch({ type: 'REJECT_QUESTION', payload: { id, reason } });
    },

    addBroadcast: async (broadcast: Omit<Broadcast, 'id' | 'createdAt'>) => {
      const newBroadcast = await DatabaseService.addBroadcast(broadcast);
      dispatch({ type: 'ADD_BROADCAST', payload: newBroadcast });
    },

    addArticle: async (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newArticle = await DatabaseService.addArticle(article);
      dispatch({ type: 'ADD_ARTICLE', payload: newArticle });
    },

    updateArticle: async (id: string, data: Partial<Article>) => {
      await DatabaseService.updateArticle(id, data);
      // Refresh articles
      const articles = await DatabaseService.getArticles();
      dispatch({ type: 'SET_ARTICLES', payload: articles });
    },

    deleteArticle: async (id: string) => {
      await DatabaseService.deleteArticle(id);
      const articles = await DatabaseService.getArticles();
      dispatch({ type: 'SET_ARTICLES', payload: articles });
    },

    addVideo: async (video: Omit<Video, 'id' | 'createdAt'>) => {
      const newVideo = await DatabaseService.addVideo(video);
      dispatch({ type: 'ADD_VIDEO', payload: newVideo });
    },

    deleteVideo: async (id: string) => {
      await DatabaseService.deleteVideo(id);
      const videos = await DatabaseService.getVideos();
      dispatch({ type: 'SET_VIDEOS', payload: videos });
    },

    addAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
      const newAppointment = await DatabaseService.addAppointment(appointment);
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
    },

    addSubscriber: async (subscriber: Omit<Subscriber, 'id' | 'subscribedAt'>) => {
      const newSubscriber = await DatabaseService.addSubscriber(subscriber);
      dispatch({ type: 'ADD_SUBSCRIBER', payload: newSubscriber });
      DatabaseService.setSubscribed();
    },

    login: async (email: string, password: string): Promise<boolean> => {
      try {
        await AuthService.login(email, password);
        dispatch({ type: 'SET_ADMIN', payload: true });
        return true;
      } catch (error) {
        return false;
      }
    },

    logout: async () => {
      await AuthService.logout();
      dispatch({ type: 'SET_ADMIN', payload: false });
    },

    addLocation: async (location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newLoc = await DatabaseService.addLocation(location);
      dispatch({ type: 'ADD_LOCATION', payload: newLoc });
    },

    updateLocation: async (id: string, data: Partial<Location>) => {
      await DatabaseService.updateLocation(id, data);
      dispatch({ type: 'UPDATE_LOCATION', payload: { id, data } });
    },

    deleteLocation: async (id: string) => {
      await DatabaseService.deleteLocation(id);
      dispatch({ type: 'DELETE_LOCATION', payload: id });
    },

    addNotification: async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
      const newNotification = await DatabaseService.addNotification(notification);
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    },

    markAllNotificationsRead: async () => {
      await DatabaseService.markAllNotificationsRead();
      dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Utility hook for checking subscription status
export function useHasSubscribed() {
  return DatabaseService.hasSubscribed();
}

