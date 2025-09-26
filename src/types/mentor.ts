export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  author: string;
  team: string[];
  tags: string[];
  technologies: string[];
  status: 'pending' | 'in-progress' | 'completed';
  isPromising: boolean;
  totalFunding: number;
  feedback: Feedback[];
  imageUrl: string;
  createdAt: string;
  // Mentor page compatibility
  category: string;
  adopted: boolean;
  progress: number;
  // Projects page compatibility
  techStack: string[];
  description: string;
  difficulty: string;
  lastActivity: string;
  contributors: string[];
}

export interface Feedback {
  id: string;
  mentorName: string;
  message: string;
  timestamp: string;
  rating?: number;
}

export interface FundingPledge {
  amount: number;
  mentorName: string;
  projectId: string;
}