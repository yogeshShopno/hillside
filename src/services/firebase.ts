// @ts-ignore
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Firestore,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  Auth,
  User
} from 'firebase/auth';
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

// ============================================
// FIREBASE CONFIGURATION
// ============================================

// Read environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || ""
};

// Debug: Log configuration status (remove in production)
console.log('🔧 Firebase Config Check:', {
  hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0,
  hasProjectId: !!firebaseConfig.projectId && firebaseConfig.projectId.length > 0,
  apiKeyPreview: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : '(empty)',
  projectId: firebaseConfig.projectId || '(empty)'
});

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  const apiKey = firebaseConfig.apiKey;
  const projectId = firebaseConfig.projectId;
  
  // Must have both apiKey and projectId with actual values
  const configured = !!(apiKey && apiKey.length > 5 && projectId && projectId.length > 3);
  
  return configured;
};

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let firebaseReady = false;

const initializeFirebase = () => {
  if (isFirebaseConfigured()) {
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      firebaseReady = true;
      console.log('✅ Firebase initialized successfully!');
      console.log('📦 Firestore database connected');
      console.log('🔐 Authentication ready');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      firebaseReady = false;
    }
  } else {
    console.log('ℹ️ Firebase not configured - using LocalStorage fallback');
    console.log('📝 To enable Firebase, add your credentials to .env file and restart the dev server');
    firebaseReady = false;
  }
};

// Initialize on module load
initializeFirebase();

// ============================================
// HELPER FUNCTIONS
// ============================================

// Convert Firestore Timestamp to Date
const convertTimestamps = <T>(data: any): T => {
  const result = { ...data };
  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    } else if (result[key] && typeof result[key] === 'object' && result[key].seconds) {
      // Handle serialized timestamps
      result[key] = new Date(result[key].seconds * 1000);
    }
  }
  return result as T;
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Check if we should use Firebase
const useFirebase = (): boolean => {
  return firebaseReady && db !== null;
};

// ============================================
// LOCAL STORAGE FALLBACK
// ============================================

const LocalStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`hsmg_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`hsmg_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage not available');
    }
  }
};

// ============================================
// DEFAULT DATA FOR DEMO
// ============================================

const getDefaultProviders = (): Provider[] => [
  {
    id: 'breanne',
    name: 'Breanne Bergeon',
    title: 'FNP-BC',
    specialty: 'Family Medicine',
    bio: 'Board-certified by ANCC with experience in emergency medicine, medical intensive care, interventional radiology, and oncology. Passionate about preventative care and patient education.',
    imageUrl: '',
    phone: '(210) 742-6555',
    address: '12881 I35, San Antonio, TX 78233',
    patientFusionUrl: 'https://www.patientfusion.com/doctor/breanne-bergeon-81282',
    acceptingPatients: true,
    hours: {
      weekday: '7:30am - 4:00pm',
      saturday: '8:00am - 12:00pm',
      sunday: 'Closed'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'roy',
    name: 'Roy Anderson',
    title: 'FNP',
    specialty: 'Family Medicine',
    bio: 'US Army Veteran with over 20 years nursing experience in emergency and critical care. Graduated from University of Texas at Arlington in 2020. Dedicated to exceptional primary care.',
    imageUrl: '',
    phone: '(210) 742-6555',
    address: '12881 I35, San Antonio, TX 78233',
    patientFusionUrl: 'https://www.patientfusion.com/doctor/roy-anderson-55154',
    acceptingPatients: true,
    hours: {
      weekday: '7:30am - 4:00pm',
      saturday: '8:00am - 12:00pm',
      sunday: 'Closed'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const getDefaultPartners = (): Partner[] => [
  {
    id: '1',
    name: 'Hillside Primary Care',
    logoUrl: 'https://www.hillsideprimarycare.com/wp-content/uploads/2023/09/hillside-logo.png',
    description: 'Comprehensive primary care focused on long-term wellness.',
    websiteUrl: 'https://hillsideprimarycare.com',
    order: 1
  },
  {
    id: '2',
    name: "Women's Wellness of SA",
    logoUrl: 'https://www.womenswellnessofsa.com/wp-content/uploads/2024/02/logo.png',
    description: 'Specialized healthcare for women at every stage.',
    websiteUrl: 'https://www.womenswellnessofsa.com/',
    order: 2
  },
  {
    id: '3',
    name: 'Psych of SA',
    logoUrl: 'https://www.psychofsa.com/wp-content/uploads/2024/04/cropped-logo-t-1.png',
    description: 'Mental health therapy and psychiatric evaluations.',
    websiteUrl: 'https://www.psychofsa.com/',
    order: 3
  },
  {
    id: '4',
    name: 'Podiatry of SA',
    logoUrl: 'https://podiatryofsa.com/wp-content/uploads/2024/04/brandmark-design__6_-removebg-preview.png',
    description: 'Expert foot and ankle care for better mobility.',
    websiteUrl: 'https://podiatryofsa.com/',
    order: 4
  },
  {
    id: '5',
    name: 'Physical Therapy of SA',
    logoUrl: 'https://physicaltherapyofsa.com/wp-content/uploads/2024/02/Logo-1.png',
    description: 'Rehab services to restore strength and function.',
    websiteUrl: 'https://physicaltherapyofsa.com/',
    order: 5
  }
];

const getDefaultLocations = (): Location[] => [
  {
    id: 'loc-1',
    name: 'Hillside Primary Care',
    address: '12881 I35, San Antonio, TX 78233',
    gmapUrl: 'https://www.google.com/maps/search/?api=1&query=12881+I35,+San+Antonio,+TX+78233',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const getDefaultBroadcasts = (): Broadcast[] => [
  {
    id: '1',
    title: 'Flu Shots Available',
    message: 'Walk-ins welcome at Hillside Primary Care all week.',
    type: 'health',
    icon: 'Syringe',
    active: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'New App Launched',
    message: 'Download our mobile app for faster booking.',
    type: 'announcement',
    icon: 'Smartphone',
    active: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

// ============================================
// DATABASE SERVICE
// ============================================

export const DatabaseService = {
  // ==========================================
  // PROVIDERS
  // ==========================================
  getProviders: async (): Promise<Provider[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching providers from Firestore...');
        const q = query(collection(db!, 'providers'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const providers = snapshot.docs.map(doc => convertTimestamps<Provider>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${providers.length} providers from Firestore`);
        return providers;
      } catch (error) {
        console.error('❌ Error fetching providers from Firestore:', error);
      }
    }
    console.log('📦 Using LocalStorage for providers');
    return LocalStorage.get<Provider[]>('providers', getDefaultProviders());
  },

  addProvider: async (provider: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider> => {
    const newProvider: Provider = {
      ...provider,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding provider to Firestore...');
        const docRef = await addDoc(collection(db!, 'providers'), {
          ...provider,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        newProvider.id = docRef.id;
        console.log('✅ Provider added to Firestore:', docRef.id);
        return newProvider;
      } catch (error) {
        console.error('❌ Error adding provider to Firestore:', error);
      }
    }
    
    console.log('📦 Adding provider to LocalStorage');
    const providers = LocalStorage.get<Provider[]>('providers', getDefaultProviders());
    providers.push(newProvider);
    LocalStorage.set('providers', providers);
    return newProvider;
  },

  updateProvider: async (id: string, data: Partial<Provider>): Promise<void> => {
    if (useFirebase()) {
      try {
        console.log('📡 Updating provider in Firestore:', id);
        await updateDoc(doc(db!, 'providers', id), { ...data, updatedAt: Timestamp.now() });
        console.log('✅ Provider updated in Firestore');
        return;
      } catch (error) {
        console.error('❌ Error updating provider in Firestore:', error);
      }
    }
    
    console.log('📦 Updating provider in LocalStorage');
    const providers = LocalStorage.get<Provider[]>('providers', getDefaultProviders());
    const index = providers.findIndex(p => p.id === id);
    if (index !== -1) {
      providers[index] = { ...providers[index], ...data, updatedAt: new Date() };
      LocalStorage.set('providers', providers);
    }
  },

  deleteProvider: async (id: string): Promise<void> => {
    if (useFirebase()) {
      try {
        console.log('📡 Deleting provider from Firestore:', id);
        await deleteDoc(doc(db!, 'providers', id));
        console.log('✅ Provider deleted from Firestore');
        return;
      } catch (error) {
        console.error('❌ Error deleting provider from Firestore:', error);
      }
    }
    
    console.log('📦 Deleting provider from LocalStorage');
    const providers = LocalStorage.get<Provider[]>('providers', getDefaultProviders());
    LocalStorage.set('providers', providers.filter(p => p.id !== id));
  },

  // ==========================================
  // QUESTIONS
  // ==========================================
  getQuestions: async (): Promise<Question[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching questions from Firestore...');
        const q = query(collection(db!, 'questions'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const questions = snapshot.docs.map(doc => convertTimestamps<Question>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${questions.length} questions from Firestore`);
        return questions;
      } catch (error) {
        console.error('❌ Error fetching questions from Firestore:', error);
      }
    }
    return LocalStorage.get<Question[]>('questions', []);
  },

  addQuestion: async (question: Omit<Question, 'id' | 'createdAt' | 'status'>): Promise<Question> => {
    const newQuestion: Question = {
      ...question,
      id: generateId(),
      status: 'pending_review' as const,
      createdAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding question to Firestore...');
        const docRef = await addDoc(collection(db!, 'questions'), {
          ...question,
          status: 'pending_review' as const,
          createdAt: Timestamp.now()
        });
        newQuestion.id = docRef.id;
        console.log('✅ Question added to Firestore:', docRef.id);
        return newQuestion;
      } catch (error) {
        console.error('❌ Error adding question to Firestore:', error);
      }
    }
    
    const questions = LocalStorage.get<Question[]>('questions', []);
    questions.unshift(newQuestion);
    LocalStorage.set('questions', questions);
    return newQuestion;
  },

  approveQuestion: async (id: string): Promise<void> => {
    const updateData = {
      status: 'approved' as const,
      reviewedAt: useFirebase() ? Timestamp.now() : new Date(),
      reviewedBy: 'Admin'
    };
    
    if (useFirebase()) {
      try {
        await updateDoc(doc(db!, 'questions', id), updateData);
        return;
      } catch (error) {
        console.error('❌ Error approving question in Firestore:', error);
      }
    }
    
    const questions = LocalStorage.get<Question[]>('questions', []);
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updateData, reviewedAt: new Date() };
      LocalStorage.set('questions', questions);
    }
  },

  rejectQuestion: async (id: string, reason?: string): Promise<void> => {
    const updateData = {
      status: 'rejected' as const,
      reviewedAt: useFirebase() ? Timestamp.now() : new Date(),
      reviewedBy: 'Admin',
      rejectReason: reason || 'Rejected'
    };
    
    if (useFirebase()) {
      try {
        await updateDoc(doc(db!, 'questions', id), updateData);
        return;
      } catch (error) {
        console.error('❌ Error rejecting question in Firestore:', error);
      }
    }
    
    const questions = LocalStorage.get<Question[]>('questions', []);
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updateData, reviewedAt: new Date() };
      LocalStorage.set('questions', questions);
    }
  },

  answerQuestion: async (id: string, answer: string): Promise<void> => {
    const updateData = {
      answer,
      status: 'answered' as const,
      answeredAt: useFirebase() ? Timestamp.now() : new Date(),
      answeredBy: 'Hillside Team'
    };
    
    if (useFirebase()) {
      try {
        await updateDoc(doc(db!, 'questions', id), updateData);
        return;
      } catch (error) {
        console.error('❌ Error answering question in Firestore:', error);
      }
    }
    
    const questions = LocalStorage.get<Question[]>('questions', []);
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updateData, answeredAt: new Date() };
      LocalStorage.set('questions', questions);
    }
  },

  // ==========================================
  // BROADCASTS
  // ==========================================
  getBroadcasts: async (): Promise<Broadcast[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching broadcasts from Firestore...');
        const q = query(collection(db!, 'broadcasts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const broadcasts = snapshot.docs.map(doc => convertTimestamps<Broadcast>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${broadcasts.length} broadcasts from Firestore`);
        return broadcasts;
      } catch (error) {
        console.error('❌ Error fetching broadcasts from Firestore:', error);
      }
    }
    return LocalStorage.get<Broadcast[]>('broadcasts', getDefaultBroadcasts());
  },

  addBroadcast: async (broadcast: Omit<Broadcast, 'id' | 'createdAt'>): Promise<Broadcast> => {
    const newBroadcast: Broadcast = {
      ...broadcast,
      id: generateId(),
      createdAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding broadcast to Firestore...');
        const docRef = await addDoc(collection(db!, 'broadcasts'), {
          ...broadcast,
          createdAt: Timestamp.now()
        });
        newBroadcast.id = docRef.id;
        console.log('✅ Broadcast added to Firestore:', docRef.id);
        return newBroadcast;
      } catch (error) {
        console.error('❌ Error adding broadcast to Firestore:', error);
      }
    }
    
    console.log('📦 Adding broadcast to LocalStorage');
    const broadcasts = LocalStorage.get<Broadcast[]>('broadcasts', getDefaultBroadcasts());
    broadcasts.unshift(newBroadcast);
    LocalStorage.set('broadcasts', broadcasts);
    return newBroadcast;
  },

  // ==========================================
  // ARTICLES
  // ==========================================
  getArticles: async (): Promise<Article[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching articles from Firestore...');
        const q = query(collection(db!, 'articles'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const articles = snapshot.docs.map(doc => convertTimestamps<Article>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${articles.length} articles from Firestore`);
        return articles;
      } catch (error) {
        console.error('❌ Error fetching articles from Firestore:', error);
      }
    }
    return LocalStorage.get<Article[]>('articles', []);
  },

  addArticle: async (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> => {
    const newArticle: Article = {
      ...article,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding article to Firestore...');
        const docRef = await addDoc(collection(db!, 'articles'), {
          ...article,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        newArticle.id = docRef.id;
        console.log('✅ Article added to Firestore:', docRef.id);
        return newArticle;
      } catch (error) {
        console.error('❌ Error adding article to Firestore:', error);
      }
    }
    
    const articles = LocalStorage.get<Article[]>('articles', []);
    articles.unshift(newArticle);
    LocalStorage.set('articles', articles);
    return newArticle;
  },

  updateArticle: async (id: string, data: Partial<Article>): Promise<void> => {
    if (useFirebase()) {
      try {
        await updateDoc(doc(db!, 'articles', id), { ...data, updatedAt: Timestamp.now() });
        return;
      } catch (error) {
        console.error('❌ Error updating article in Firestore:', error);
      }
    }
    
    const articles = LocalStorage.get<Article[]>('articles', []);
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...data, updatedAt: new Date() };
      LocalStorage.set('articles', articles);
    }
  },

  deleteArticle: async (id: string): Promise<void> => {
    if (useFirebase()) {
      try {
        await deleteDoc(doc(db!, 'articles', id));
        return;
      } catch (error) {
        console.error('❌ Error deleting article from Firestore:', error);
      }
    }
    
    const articles = LocalStorage.get<Article[]>('articles', []);
    LocalStorage.set('articles', articles.filter(a => a.id !== id));
  },

  // ==========================================
  // VIDEOS
  // ==========================================
  getVideos: async (): Promise<Video[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching videos from Firestore...');
        const q = query(collection(db!, 'videos'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const videos = snapshot.docs.map(doc => convertTimestamps<Video>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${videos.length} videos from Firestore`);
        return videos;
      } catch (error) {
        console.error('❌ Error fetching videos from Firestore:', error);
      }
    }
    return LocalStorage.get<Video[]>('videos', []);
  },

  addVideo: async (video: Omit<Video, 'id' | 'createdAt'>): Promise<Video> => {
    const newVideo: Video = {
      ...video,
      id: generateId(),
      createdAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding video to Firestore...');
        const docRef = await addDoc(collection(db!, 'videos'), {
          ...video,
          createdAt: Timestamp.now()
        });
        newVideo.id = docRef.id;
        console.log('✅ Video added to Firestore:', docRef.id);
        return newVideo;
      } catch (error) {
        console.error('❌ Error adding video to Firestore:', error);
      }
    }
    
    const videos = LocalStorage.get<Video[]>('videos', []);
    videos.unshift(newVideo);
    LocalStorage.set('videos', videos);
    return newVideo;
  },

  deleteVideo: async (id: string): Promise<void> => {
    if (useFirebase()) {
      try {
        await deleteDoc(doc(db!, 'videos', id));
        return;
      } catch (error) {
        console.error('❌ Error deleting video from Firestore:', error);
      }
    }
    
    const videos = LocalStorage.get<Video[]>('videos', []);
    LocalStorage.set('videos', videos.filter(v => v.id !== id));
  },

  // ==========================================
  // APPOINTMENTS
  // ==========================================
  getAppointments: async (): Promise<Appointment[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching appointments from Firestore...');
        const q = query(collection(db!, 'appointments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const appointments = snapshot.docs.map(doc => convertTimestamps<Appointment>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${appointments.length} appointments from Firestore`);
        return appointments;
      } catch (error) {
        console.error('❌ Error fetching appointments from Firestore:', error);
      }
    }
    return LocalStorage.get<Appointment[]>('appointments', []);
  },

  addAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> => {
    const newAppointment: Appointment = {
      ...appointment,
      id: generateId(),
      status: 'pending' as const,
      createdAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding appointment to Firestore...');
        const docRef = await addDoc(collection(db!, 'appointments'), {
          ...appointment,
          status: 'pending' as const,
          createdAt: Timestamp.now()
        });
        newAppointment.id = docRef.id;
        console.log('✅ Appointment added to Firestore:', docRef.id);
        return newAppointment;
      } catch (error) {
        console.error('❌ Error adding appointment to Firestore:', error);
      }
    }
    
    const appointments = LocalStorage.get<Appointment[]>('appointments', []);
    appointments.unshift(newAppointment);
    LocalStorage.set('appointments', appointments);
    return newAppointment;
  },

  // ==========================================
  // SUBSCRIBERS
  // ==========================================
  getSubscribers: async (): Promise<Subscriber[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching subscribers from Firestore...');
        const q = query(collection(db!, 'subscribers'), orderBy('subscribedAt', 'desc'));
        const snapshot = await getDocs(q);
        const subscribers = snapshot.docs.map(doc => convertTimestamps<Subscriber>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${subscribers.length} subscribers from Firestore`);
        return subscribers;
      } catch (error) {
        console.error('❌ Error fetching subscribers from Firestore:', error);
      }
    }
    return LocalStorage.get<Subscriber[]>('subscribers', []);
  },

  addSubscriber: async (subscriber: Omit<Subscriber, 'id' | 'subscribedAt'>): Promise<Subscriber> => {
    const newSubscriber: Subscriber = {
      ...subscriber,
      id: generateId(),
      subscribedAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding subscriber to Firestore...');
        const docRef = await addDoc(collection(db!, 'subscribers'), {
          ...subscriber,
          subscribedAt: Timestamp.now()
        });
        newSubscriber.id = docRef.id;
        console.log('✅ Subscriber added to Firestore:', docRef.id);
        return newSubscriber;
      } catch (error) {
        console.error('❌ Error adding subscriber to Firestore:', error);
      }
    }
    
    const subscribers = LocalStorage.get<Subscriber[]>('subscribers', []);
    subscribers.push(newSubscriber);
    LocalStorage.set('subscribers', subscribers);
    return newSubscriber;
  },

  // ==========================================
  // PARTNERS
  // ==========================================
  getPartners: async (): Promise<Partner[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching partners from Firestore...');
        const q = query(collection(db!, 'partners'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (snapshot.docs.length > 0) {
          const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partner));
          console.log(`✅ Fetched ${partners.length} partners from Firestore`);
          return partners;
        }
      } catch (error) {
        console.error('❌ Error fetching partners from Firestore:', error);
      }
    }
    return LocalStorage.get<Partner[]>('partners', getDefaultPartners());
  },

  // ==========================================
  // LOCATIONS
  // ==========================================
  getLocations: async (): Promise<Location[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching locations from Firestore...');
        const q = query(collection(db!, 'locations'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const locations = snapshot.docs.map(doc => convertTimestamps<Location>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${locations.length} locations from Firestore`);
        return locations;
      } catch (error) {
        console.error('❌ Error fetching locations from Firestore:', error);
      }
    }
    return LocalStorage.get<Location[]>('locations', getDefaultLocations());
  },

  addLocation: async (location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
    const newLocation: Location = {
      ...location,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding location to Firestore...');
        const docRef = await addDoc(collection(db!, 'locations'), {
          ...location,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        newLocation.id = docRef.id;
        console.log('✅ Location added to Firestore:', docRef.id);
        return newLocation;
      } catch (error) {
        console.error('❌ Error adding location to Firestore:', error);
      }
    }
    
    const locations = LocalStorage.get<Location[]>('locations', getDefaultLocations());
    locations.push(newLocation);
    LocalStorage.set('locations', locations);
    return newLocation;
  },

  updateLocation: async (id: string, data: Partial<Location>): Promise<void> => {
    if (useFirebase()) {
      try {
        await updateDoc(doc(db!, 'locations', id), { ...data, updatedAt: Timestamp.now() });
        return;
      } catch (error) {
        console.error('❌ Error updating location in Firestore:', error);
      }
    }
    
    const locations = LocalStorage.get<Location[]>('locations', getDefaultLocations());
    const idx = locations.findIndex((l) => l.id === id);
    if (idx !== -1) {
      locations[idx] = { ...locations[idx], ...data, updatedAt: new Date() };
      LocalStorage.set('locations', locations);
    }
  },

  deleteLocation: async (id: string): Promise<void> => {
    if (useFirebase()) {
      try {
        await deleteDoc(doc(db!, 'locations', id));
        return;
      } catch (error) {
        console.error('❌ Error deleting location from Firestore:', error);
      }
    }
    
    const locations = LocalStorage.get<Location[]>('locations', getDefaultLocations());
    LocalStorage.set('locations', locations.filter((l) => l.id !== id));
  },

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  getNotifications: async (): Promise<Notification[]> => {
    if (useFirebase()) {
      try {
        console.log('📡 Fetching notifications from Firestore...');
        const q = query(collection(db!, 'notifications'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const notifications = snapshot.docs.map(doc => convertTimestamps<Notification>({ id: doc.id, ...doc.data() }));
        console.log(`✅ Fetched ${notifications.length} notifications from Firestore`);
        return notifications;
      } catch (error) {
        console.error('❌ Error fetching notifications from Firestore:', error);
      }
    }
    return LocalStorage.get<Notification[]>('notifications', []);
  },

  addNotification: async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      read: false,
      createdAt: new Date()
    };
    
    if (useFirebase()) {
      try {
        console.log('📡 Adding notification to Firestore...');
        const docRef = await addDoc(collection(db!, 'notifications'), {
          ...notification,
          read: false,
          createdAt: Timestamp.now()
        });
        newNotification.id = docRef.id;
        console.log('✅ Notification added to Firestore:', docRef.id);
        return newNotification;
      } catch (error) {
        console.error('❌ Error adding notification to Firestore:', error);
      }
    }
    
    console.log('📦 Adding notification to LocalStorage');
    const notifications = LocalStorage.get<Notification[]>('notifications', []);
    notifications.unshift(newNotification);
    LocalStorage.set('notifications', notifications);
    return newNotification;
  },

  markAllNotificationsRead: async (): Promise<void> => {
    if (useFirebase()) {
      try {
        console.log('📡 Marking all notifications as read in Firestore...');
        const q = query(collection(db!, 'notifications'));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db!);
        snapshot.docs.forEach((docSnap) => {
          batch.update(doc(db!, 'notifications', docSnap.id), { read: true });
        });
        await batch.commit();
        console.log('✅ All notifications marked as read in Firestore');
        return;
      } catch (error) {
        console.error('❌ Error marking notifications as read in Firestore:', error);
      }
    }
    
    const notifications = LocalStorage.get<Notification[]>('notifications', []);
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    LocalStorage.set('notifications', updatedNotifications);
  },

  // ==========================================
  // NEWSLETTER SUBSCRIPTION CHECK
  // ==========================================
  hasSubscribed: (): boolean => {
    try {
      return localStorage.getItem('hsmg_subscribed') === 'true';
    } catch {
      return false;
    }
  },

  setSubscribed: (): void => {
    try {
      localStorage.setItem('hsmg_subscribed', 'true');
    } catch {
      // Ignore
    }
  }
};

// ============================================
// AUTHENTICATION SERVICE
// ============================================

export const AuthService = {
  login: async (email: string, password: string): Promise<User | { uid: string; email: string }> => {
    // Use Firebase Auth if configured
    if (useFirebase() && auth) {
      try {
        console.log('🔐 Attempting Firebase login...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem('hsmg_admin', 'true');
        console.log('✅ Firebase login successful');
        return userCredential.user;
      } catch (error: any) {
        console.error('❌ Firebase login error:', error.message);
        throw new Error(error.message || 'Invalid credentials');
      }
    }
    
    // Fallback: Demo login when Firebase is not configured
    console.log('🔐 Using demo login (Firebase not configured)');
    if (email === 'admin@hillside.com' && password === 'admin123') {
      sessionStorage.setItem('hsmg_admin', 'true');
      return { uid: 'demo', email };
    }
    
    throw new Error('Invalid credentials');
  },

  logout: async (): Promise<void> => {
    if (auth) {
      try {
        await signOut(auth);
        console.log('✅ Firebase logout successful');
      } catch (error) {
        console.error('❌ Firebase logout error:', error);
      }
    }
    sessionStorage.removeItem('hsmg_admin');
  },

  isLoggedIn: (): boolean => {
    try {
      return sessionStorage.getItem('hsmg_admin') === 'true';
    } catch {
      return false;
    }
  },

  onAuthChange: (callback: (user: User | null) => void): (() => void) => {
    if (auth) {
      return onAuthStateChanged(auth, (user) => {
        if (user) {
          sessionStorage.setItem('hsmg_admin', 'true');
        }
        callback(user);
      });
    }
    
    // Demo mode fallback
    try {
      const isLoggedIn = sessionStorage.getItem('hsmg_admin') === 'true';
      callback(isLoggedIn ? ({ uid: 'demo', email: 'admin@hillside.com' } as any) : null);
    } catch {
      callback(null);
    }
    return () => {};
  },

  getCurrentUser: (): User | null => {
    if (auth) {
      return auth.currentUser;
    }
    return null;
  }
};

// ============================================
// REAL-TIME SUBSCRIPTIONS (For future use)
// ============================================

export const subscribeToCollection = <T>(
  collectionName: string, 
  callback: (data: T[]) => void,
  _orderField: string = 'createdAt'
): (() => void) => {
  const getters: Record<string, () => Promise<any[]>> = {
    providers: DatabaseService.getProviders,
    broadcasts: DatabaseService.getBroadcasts,
    partners: DatabaseService.getPartners,
    questions: DatabaseService.getQuestions,
    articles: DatabaseService.getArticles,
    videos: DatabaseService.getVideos,
    appointments: DatabaseService.getAppointments,
    subscribers: DatabaseService.getSubscribers,
    notifications: DatabaseService.getNotifications,
    locations: DatabaseService.getLocations
  };
  
  const getter = getters[collectionName];
  if (getter) {
    getter().then(data => callback(data as T[]));
  }
  
  return () => {};
};

// Export utilities
export { isFirebaseConfigured, useFirebase };

// Export a function to check Firebase status
export const getFirebaseStatus = () => ({
  configured: isFirebaseConfigured(),
  ready: firebaseReady,
  hasDb: db !== null,
  hasAuth: auth !== null,
  config: {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    projectId: firebaseConfig.projectId
  }
});
