export enum UserRole {
  AGENCY = 'agency',
  GENERAL = 'general',
  ADMIN = 'admin',
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
}

export enum LeadSource {
  LINKEDIN = 'linkedin',
  WEBSITE = 'website',
  REFERRAL = 'referral',
  GOOGLE_ADS = 'google_ads',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  COLD_CALL = 'cold_call',
  EMAIL = 'email',
  TRADE_SHOW = 'trade_show',
  EXHIBITION = 'exhibition',
  OTHERS = 'others',
}

export const JWT_SECRET = process.env.JWT_SECRET || 'argan=-+rDCJJZlx9bMTkuof';
export const JWT_EXPIRES_IN = '155d';

export const SALT_ROUNDS = 10;

export const MAX_TEAMS_PER_AGENCY = 30;

export const MAX_SERVICES_PER_AGENCY = 200;

export const MAX_LEADS_PER_AGENCY = 1000;

export const MAX_CLIENTS_PER_AGENCY = 500;

export enum ServiceType {
  NON_REPEATABLE = 'non_repeatable',
  REPEATABLE = 'repeatable',
}

export enum ProjectPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
