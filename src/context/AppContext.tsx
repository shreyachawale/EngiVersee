import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, User, Notification } from '../types';
import { mockProjects, mockUser, mockNotifications } from '../data/mockData';

interface AppContextType {
  projects: Project[];
  user: User;
  notifications: Notification[];
  isDarkMode: boolean;
  adoptProject: (projectId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastActivity'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  toggleDarkMode: () => void;
  markNotificationRead: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [user, setUser] = useState<User>(mockUser);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const adoptProject = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, adopted: true }
          : project
      )
    );
    
    setUser(prev => ({
      ...prev,
      projects: [...prev.projects, projectId]
    }));

    addNotification({
      type: 'project_adopted',
      title: 'Project Adopted!',
      message: `You successfully adopted "${projects.find(p => p.id === projectId)?.title}"`,
      read: false,
      projectId
    });
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'lastActivity'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, ...updates, lastActivity: new Date() }
          : project
      )
    );
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      projects,
      user,
      notifications,
      isDarkMode,
      adoptProject,
      addProject,
      updateProject,
      toggleDarkMode,
      markNotificationRead,
      addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};