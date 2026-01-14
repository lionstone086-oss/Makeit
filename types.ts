
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN'
}

export enum SkillTrack {
  TECH = 'TECH',
  TRADES = 'TRADES',
  CREATIVE = 'CREATIVE'
}

export enum ActiveTab {
  DASHBOARD = 'DASHBOARD',
  CURRICULUM = 'CURRICULUM',
  PORTFOLIO = 'PORTFOLIO',
  PAYMENTS = 'PAYMENTS',
  SETTINGS = 'SETTINGS'
}

export interface Skill {
  name: string;
  level: number; // 0-100
  track: SkillTrack;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  track: SkillTrack;
  status: 'SUBMITTED' | 'GRADED' | 'DRAFT';
  feedback?: string;
  imageUrl?: string;
  videoUrl?: string;
  grade?: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  track?: SkillTrack;
  skills: Skill[];
}
