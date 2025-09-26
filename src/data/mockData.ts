import { Project, User, Notification } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'EcoTracker - Carbon Footprint Monitor',
    shortDescription: 'Track and reduce your daily carbon footprint with AI-powered recommendations',
    description: 'A comprehensive web application that helps users monitor their daily carbon footprint through activity tracking, provides AI-powered insights for reduction, and connects users with local environmental initiatives. Built with React, Node.js, and integrates with Google Maps API for location-based recommendations.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Google Maps API', 'Chart.js'],
    difficulty: 'Intermediate',
    progress: 65,
    contributors: [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
        role: 'Frontend Developer',
        joinedAt: new Date('2024-01-15'),
        contributions: 23
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
        role: 'Backend Developer',
        joinedAt: new Date('2024-01-20'),
        contributions: 18
      }
    ],
    owner: {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
      role: 'owner',
      skills: ['React', 'Python', 'Machine Learning'],
      projects: ['1']
    },
    githubUrl: 'https://github.com/alexj/ecotracker',
    demoUrl: 'https://ecotracker-demo.com',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    createdAt: new Date('2024-01-10'),
    lastActivity: new Date('2024-01-25'),
    adopted: false,
    category: 'Environmental',
    tags: ['sustainability', 'AI', 'mobile-first'],
    milestones: [
      {
        id: '1',
        title: 'MVP Development',
        description: 'Core tracking functionality',
        completed: true,
        completedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        title: 'AI Integration',
        description: 'Implement recommendation engine',
        completed: true,
        completedAt: new Date('2024-01-23')
      },
      {
        id: '3',
        title: 'Mobile App',
        description: 'React Native mobile version',
        completed: false,
        dueDate: new Date('2024-02-15')
      }
    ],
    aiInsights: {
      healthScore: 78,
      nextSteps: [
        'Implement user authentication system',
        'Add data visualization components',
        'Create mobile-responsive design',
        'Integrate payment gateway for premium features'
      ],
      pitchDeck: [
        'Problem: 73% of people want to reduce carbon footprint but lack tools',
        'Solution: AI-powered personal carbon tracking with actionable insights',
        'Market: $2.8B environmental software market, 15% YoY growth',
        'Revenue: Freemium model, $9.99/month premium, corporate licenses'
      ]
    }
  },
  {
    id: '2',
    title: 'CodeMentor AI',
    shortDescription: 'AI-powered code review and mentorship platform for developers',
    description: 'An intelligent platform that provides automated code reviews, suggests improvements, and connects junior developers with experienced mentors. Features include real-time collaboration, skill assessments, and personalized learning paths.',
    techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'OpenAI API', 'WebRTC'],
    difficulty: 'Advanced',
    progress: 40,
    contributors: [
      {
        id: '3',
        name: 'Emily Davis',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150',
        role: 'Full Stack Developer',
        joinedAt: new Date('2024-01-12'),
        contributions: 31
      }
    ],
    owner: {
      id: '2',
      name: 'David Kim',
      email: 'david@example.com',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=150',
      role: 'owner',
      skills: ['TypeScript', 'AI/ML', 'System Design'],
      projects: ['2']
    },
    githubUrl: 'https://github.com/davidk/codementor-ai',
    createdAt: new Date('2024-01-08'),
    lastActivity: new Date('2024-01-24'),
    adopted: false,
    category: 'Developer Tools',
    tags: ['AI', 'education', 'mentorship'],
    milestones: [
      {
        id: '4',
        title: 'Core Architecture',
        description: 'Set up Next.js and database schema',
        completed: true,
        completedAt: new Date('2024-01-15')
      },
      {
        id: '5',
        title: 'AI Integration',
        description: 'Integrate OpenAI for code analysis',
        completed: false,
        dueDate: new Date('2024-02-01')
      }
    ],
    aiInsights: {
      healthScore: 65,
      nextSteps: [
        'Complete OpenAI API integration',
        'Build mentor matching algorithm',
        'Implement real-time code collaboration',
        'Add comprehensive testing suite'
      ],
      pitchDeck: [
        'Problem: Junior developers struggle with code quality and finding mentors',
        'Solution: AI-powered code review + human mentorship in one platform',
        'Market: $5.2B developer tools market, high demand for mentorship',
        'Revenue: Subscription model for mentees, commission from mentors'
      ]
    }
  },
  {
    id: '3',
    title: 'LocalHero - Community Helper',
    shortDescription: 'Connect neighbors for local services and community support',
    description: 'A location-based platform connecting community members for mutual assistance, skill sharing, and local services. Features include service requests, skill matching, reputation systems, and community events.',
    techStack: ['Vue.js', 'Express', 'MongoDB', 'Socket.io', 'Mapbox'],
    difficulty: 'Beginner',
    progress: 85,
    contributors: [
      {
        id: '4',
        name: 'Lisa Wang',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=150',
        role: 'UI/UX Designer',
        joinedAt: new Date('2024-01-10'),
        contributions: 15
      },
      {
        id: '5',
        name: 'Tom Wilson',
        avatar: 'https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?w=150',
        role: 'Backend Developer',
        joinedAt: new Date('2024-01-18'),
        contributions: 12
      }
    ],
    owner: {
      id: '3',
      name: 'Maria Gonzalez',
      email: 'maria@example.com',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=150',
      role: 'owner',
      skills: ['Vue.js', 'Community Building', 'Product Management'],
      projects: ['3']
    },
    githubUrl: 'https://github.com/mariag/localhero',
    demoUrl: 'https://localhero-demo.com',
    createdAt: new Date('2024-01-05'),
    lastActivity: new Date('2024-01-25'),
    adopted: true,
    category: 'Social Impact',
    tags: ['community', 'location-based', 'social'],
    milestones: [
      {
        id: '6',
        title: 'User Registration',
        description: 'Complete user auth and profiles',
        completed: true,
        completedAt: new Date('2024-01-12')
      },
      {
        id: '7',
        title: 'Service Matching',
        description: 'Algorithm for matching service requests',
        completed: true,
        completedAt: new Date('2024-01-20')
      },
      {
        id: '8',
        title: 'Mobile App Launch',
        description: 'Release mobile app for iOS and Android',
        completed: false,
        dueDate: new Date('2024-02-10')
      }
    ]
  },
  {
    id: '4',
    title: 'CryptoPortfolio Tracker',
    shortDescription: 'Real-time cryptocurrency portfolio management and analytics',
    description: 'A comprehensive cryptocurrency portfolio tracker with real-time price updates, advanced analytics, profit/loss calculations, and DeFi protocol integration. Includes features for tax reporting and automated rebalancing.',
    techStack: ['React', 'Python', 'FastAPI', 'Redis', 'CoinGecko API'],
    difficulty: 'Advanced',
    progress: 30,
    contributors: [],
    owner: {
      id: '4',
      name: 'James Park',
      email: 'james@example.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
      role: 'owner',
      skills: ['Python', 'Blockchain', 'Financial Analysis'],
      projects: ['4']
    },
    githubUrl: 'https://github.com/jamespark/crypto-tracker',
    createdAt: new Date('2024-01-20'),
    lastActivity: new Date('2024-01-22'),
    adopted: false,
    category: 'FinTech',
    tags: ['cryptocurrency', 'analytics', 'portfolio'],
    milestones: [
      {
        id: '9',
        title: 'API Integration',
        description: 'Connect to major crypto exchanges',
        completed: true,
        completedAt: new Date('2024-01-21')
      },
      {
        id: '10',
        title: 'Portfolio Analytics',
        description: 'Build advanced analytics dashboard',
        completed: false,
        dueDate: new Date('2024-02-05')
      }
    ]
  }
];

export const mockUser: User = {
  id: 'current-user',
  name: 'Jordan Smith',
  email: 'jordan@example.com',
  avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?w=150',
  role: 'contributor',
  skills: ['React', 'TypeScript', 'Python', 'Machine Learning'],
  projects: ['3'],
  mentorProjects: []
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'project_adopted',
    title: 'Project Adopted!',
    message: 'You successfully adopted "LocalHero - Community Helper"',
    timestamp: new Date('2024-01-25T10:30:00'),
    read: false,
    projectId: '3'
  },
  {
    id: '2',
    type: 'milestone_completed',
    title: 'Milestone Completed',
    message: 'Service Matching milestone completed in LocalHero',
    timestamp: new Date('2024-01-24T15:45:00'),
    read: false,
    projectId: '3'
  },
  {
    id: '3',
    type: 'new_contributor',
    title: 'New Contributor',
    message: 'Tom Wilson joined your LocalHero project',
    timestamp: new Date('2024-01-23T09:15:00'),
    read: true,
    projectId: '3'
  }
];