export type Role = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  phone?: string;
  bio?: string;
  plan: Plan;
  createdAt: string;
}

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location?: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject?: string;
  monthlyFee?: number;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export interface Payment {
  _id: string;
  userEmail: string;
  userName?: string;
  userRole: "student" | "tutor";
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}