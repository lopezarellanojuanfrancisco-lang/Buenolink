
export enum PlanType {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  PREMIUM = 'PREMIUM'
}

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
  STAFF = 'STAFF'
}

export interface PlanFeature {
  code: string;
  name: string;
  includedIn: PlanType[];
}

export type SubscriptionTerm = '1_MONTH' | '3_MONTHS' | '6_MONTHS' | '12_MONTHS';

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  plan: PlanType;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED';
  
  // Lifecycle Dates
  joinedAt: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  lastPaymentDate?: string;
  term?: SubscriptionTerm;

  // Onboarding Pipeline Tracking
  // 0 = Not started, 1 = Step 1 sent/pending, 2 = Step 2 sent/pending, etc. 99 = Completed
  currentOnboardingStep: number; 

  // Stats
  registeredClients: number;
  totalSales: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  points: number;
}

export interface Order {
  id: string;
  clientName: string;
  total: number;
  status: 'NEW' | 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
  items: string[];
  createdAt: string;
  source: 'WHATSAPP' | 'LOCAL' | 'DIRECT_MESSAGE';
}

export interface User {
  id: string;
  name: string;
  role: Role;
  businessId?: string; // Null if Superadmin
}

export type FeatureKey = 'ai' | 'crm' | 'menu' | 'sales_tracking' | 'mass_messages';

export const PLAN_FEATURES: Record<FeatureKey, PlanType[]> = {
  mass_messages: [PlanType.BASIC, PlanType.INTERMEDIATE, PlanType.PREMIUM],
  ai: [PlanType.INTERMEDIATE, PlanType.PREMIUM],
  crm: [PlanType.PREMIUM],
  menu: [PlanType.PREMIUM],
  sales_tracking: [PlanType.PREMIUM]
};