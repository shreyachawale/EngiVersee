import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Calendar, 
  Bell, 
  CheckCircle,
  Clock,
  Target,
  Code2,
  Award,
  Activity,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/UI/ProjectCard';
import Modal from '../components/UI/Modal';

const Dashboard: React.FC = () => {
  const { projects, user, notifications, isDarkMode, markNotificationRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get user's adopted projects
  const adoptedProjects = projects.filter(p => user.projects.includes(p.id));
  
  // Calculate stats
  const totalContributions = adoptedProjects.reduce((total, project) => 
    total + project.contributors.find(c => c.name === user.name)?.contributions || 0, 0
  );
  
  const completedMilestones = adoptedProjects.reduce((total, project) => 
    total + project.milestones.filter(m => m.completed).length, 0
  );

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  // Mock skill data
  const skills = [
    { name: 'React', level: 90, color: 'bg-blue-500' },
    { name: 'TypeScript', level: 85, color: 'bg-blue-600' },
    { name: 'Python', level: 75, color: 'bg-green-500' },
    { name: 'Machine Learning', level: 60, color: 'bg-purple-500' }
  ];

  // Mock activity data for the last 7 days
  const activityData = [
    { day: 'Mon', commits: 5 },
    { day: 'Tue', commits: 3 },
    { day: 'Wed', commits: 8 },
    { day: 'Thu', commits: 2 },
    { day: 'Fri', commits: 6 },
    { day: 'Sat', commits: 4 },
    { day: 'Sun', commits: 1 }
  ];

  const maxCommits = Math.max(...activityData.map(d => d.commits));

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back, {user.name}!
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Here's your project activity and progress
            </p>
          </div>

          <button
            onClick={() => setShowNotifications(true)}
            className={`relative p-3 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <Bell className="h-6 w-6" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Adopted Projects
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {adoptedProjects.length}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Contributions
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {totalContributions}
                </p>
              </div>
              <Code2 className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Completed Milestones
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {completedMilestones}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Skill Level
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Advanced
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Adopted Projects */}
            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  My Adopted Projects
                </h2>
                <Link
                  to="/projects"
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Browse More
                </Link>
              </div>

              {adoptedProjects.length === 0 ? (
                <div className="text-center py-12">
                  <Star className={`h-12 w-12 mx-auto mb-4 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    No adopted projects yet
                  </h3>
                  <p className={`mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Start by adopting your first project from the marketplace
                  </p>
                  <Link
                    to="/projects"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Browse Projects
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {adoptedProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      showAdoptButton={false}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Activity Chart */}
            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 flex items-center space-x-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <BarChart3 className="h-6 w-6" />
                <span>This Week's Activity</span>
              </h2>
              
              <div className="flex items-end justify-between space-x-2 h-32">
                {activityData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{ 
                        height: `${(day.commits / maxCommits) * 100}%`,
                        minHeight: day.commits > 0 ? '8px' : '2px'
                      }}
                    />
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {day.day}
                    </span>
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {day.commits}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skill Progress */}
            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Skill Progress
              </h2>
              
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {skill.name}
                      </span>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${skill.color}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activity
                </h2>
                {unreadNotifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadNotifications.length} new
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                      !notification.read
                        ? isDarkMode
                          ? 'bg-blue-900/20 border-blue-800'
                          : 'bg-blue-50 border-blue-200'
                        : isDarkMode
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${
                        notification.type === 'project_adopted' ? 'text-green-500' :
                        notification.type === 'milestone_completed' ? 'text-blue-500' :
                        notification.type === 'new_contributor' ? 'text-purple-500' : 'text-orange-500'
                      }`}>
                        {notification.type === 'project_adopted' && <Star className="h-4 w-4" />}
                        {notification.type === 'milestone_completed' && <CheckCircle className="h-4 w-4" />}
                        {notification.type === 'new_contributor' && <Users className="h-4 w-4" />}
                        {notification.type === 'mentor_feedback' && <Target className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link
                  to="/upload"
                  className={`w-full p-3 rounded-lg border transition-colors hover:scale-105 flex items-center space-x-3 ${
                    isDarkMode 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Upload New Project
                  </span>
                </Link>
                
                <Link
                  to="/projects"
                  className={`w-full p-3 rounded-lg border transition-colors hover:scale-105 flex items-center space-x-3 ${
                    isDarkMode 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Star className="h-5 w-5 text-emerald-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Browse Projects
                  </span>
                </Link>
                
                <Link
                  to="/mentor"
                  className={`w-full p-3 rounded-lg border transition-colors hover:scale-105 flex items-center space-x-3 ${
                    isDarkMode 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Become a Mentor
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="All Notifications"
        size="lg"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className={`h-12 w-12 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  !notification.read
                    ? isDarkMode
                      ? 'bg-blue-900/20 border-blue-800'
                      : 'bg-blue-50 border-blue-200'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${
                      notification.type === 'project_adopted' ? 'text-green-500' :
                      notification.type === 'milestone_completed' ? 'text-blue-500' :
                      notification.type === 'new_contributor' ? 'text-purple-500' : 'text-orange-500'
                    }`}>
                      {notification.type === 'project_adopted' && <Star className="h-4 w-4" />}
                      {notification.type === 'milestone_completed' && <CheckCircle className="h-4 w-4" />}
                      {notification.type === 'new_contributor' && <Users className="h-4 w-4" />}
                      {notification.type === 'mentor_feedback' && <Target className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-2 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleNotificationClick(notification.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;