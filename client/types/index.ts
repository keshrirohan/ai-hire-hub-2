export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer';
  avatar?: string;
  bio?: string;
  skills: string[];
  walletBalance: number;
  rating: number;
  totalRatings: number;
  completedProjects: number;
  portfolio: PortfolioItem[];
  hourlyRate?: number;
  location?: string;
  website?: string;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt: string;
}

export interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  url?: string;
  fileUrl?: string;
  createdAt?: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'active' | 'submitted' | 'approved' | 'rejected' | 'paid';
  order: number;
  submissionFiles?: SubmissionFile[];
  submissionNote?: string;
  aiReview?: AiReview;
  clientReview?: ClientReview;
  approved: boolean;
  paidAt?: string;
  createdAt: string;
}

export interface SubmissionFile {
  url: string;
  publicId: string;
  name: string;
  type: string;
  uploadedAt: string;
}

export interface AiReview {
  score: number;
  feedback: string;
  status: 'pending' | 'approved' | 'needs_revision';
  reviewedAt: string;
}

export interface ClientReview {
  comment: string;
  approved: boolean;
  reviewedAt: string;
}

export interface Proposal {
  _id: string;
  freelancerId: User;
  coverLetter: string;
  bidAmount: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Project {
  _id: string;
  clientId: User;
  freelancerId?: User;
  title: string;
  description: string;
  budget: number;
  timeline?: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  skillsRequired: string[];
  aiSummary?: string;
  milestones: Milestone[];
  escrowAmount: number;
  totalPaid: number;
  proposals: Proposal[];
  category?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: User;
  receiverId: User;
  projectId?: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  projectId?: { _id: string; title: string };
  milestoneId?: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'escrow' | 'release' | 'refund' | 'platform_fee';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'razorpay' | 'wallet' | 'bank_transfer';
  description?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  projectId: string;
  reviewerId: User;
  revieweeId: string;
  rating: number;
  comment: string;
  categories: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  type: 'client_to_freelancer' | 'freelancer_to_client';
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface GeneratedProject {
  title: string;
  description: string;
  budget: number;
  timeline: string;
  skillsRequired: string[];
  aiSummary: string;
  milestones: {
    title: string;
    description: string;
    amount: number;
    deadline: string;
    order: number;
  }[];
}
