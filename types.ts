
export interface UserProfile {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'travel' | 'business' | 'family' | 'slang';
  isPremium: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isSlang?: boolean;
  retrievedContext?: string[]; // For RAG visualization
}

export enum AppScreen {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  PAYWALL = 'PAYWALL',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}
