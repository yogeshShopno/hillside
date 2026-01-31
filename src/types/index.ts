// Provider/Doctor Types
export interface Provider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  phone: string;
  address: string;
  patientFusionUrl: string;
  acceptingPatients: boolean;
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  date: string;
}

export interface ScheduleDay {
  date: string;
  dayName: string;
  dayNum: number;
  month: string;
  isClosed: boolean;
  slots: string[];
}

// Appointment Types
export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

type QuestionStatus =
  | "pending_review"
  | "rejected"
  | "approved"
  | "answered";

// Community Q&A Types
export interface Question {
  id: string;
  category: string;
  text: string;
  authorName: string;
  answer?: string;
  answeredBy?: string;
  status: QuestionStatus;
  createdAt: Date;
  answeredAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectReason?: string;
}

// Broadcast Types
export interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'health' | 'reminder' | 'promotion';
  icon: string;
  active: boolean;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'health' | 'reminder' | 'promotion';
  read: boolean;
  createdAt: Date;
}

// Health Content Types
export interface HealthCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  imageUrl?: string;
  author: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  duration: string;
  published: boolean;
  createdAt: Date;
}

// Subscriber Types
export interface Subscriber {
  id: string;
  name: string;
  email: string;
  healthArticles: boolean;
  subscribedAt: Date;
}

// Partner/Medical Group Types
export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  order: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  gmapUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

// App State Types
export interface AppState {
  providers: Provider[];
  questions: Question[];
  broadcasts: Broadcast[];
  articles: Article[];
  videos: Video[];
  appointments: Appointment[];
  subscribers: Subscriber[];
  partners: Partner[];
  loading: boolean;
  error: string | null;
}

