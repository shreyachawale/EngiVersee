export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  techStack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  contributors: Contributor[];
  owner: User;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  createdAt: Date;
  lastActivity: Date;
  adopted: boolean;
  category: string;
  tags: string[];
  milestones: Milestone[];
  aiInsights?: {
    healthScore: number;
    nextSteps: string[];
    pitchDeck: string[];
  };
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  joinedAt: Date;
  contributions: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'contributor' | 'mentor' | 'owner';
  skills: string[];
  projects: string[];
  mentorProjects?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  completedAt?: Date;
}

export interface Notification {
  id: string;
  type: 'project_adopted' | 'milestone_completed' | 'new_contributor' | 'mentor_feedback';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  projectId?: string;
}