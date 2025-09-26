import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  DollarSign, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  Filter,
  Search,
  Award,
  TrendingUp,
  Target,
  Heart,
  Send,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/UI/ProjectCard';
import Modal from '../components/UI/Modal';
import { toast } from 'react-toastify';

const Mentor: React.FC = () => {
  const { projects, isDarkMode, addNotification, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  
  // Mock mentor stats
  const mentorStats = {
    projectsReviewed: 12,
    fundsProvided: 5400,
    menteesMentored: 8,
    averageRating: 4.8
  };

  // Filter projects that could use mentoring (not adopted or low progress)
  const projectsNeedingMentor = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const needsMentoring = !project.adopted || project.progress < 50;
    
    return matchesSearch && matchesCategory && needsMentoring;
  });

  const categories = [...new Set(projects.map(p => p.category))].sort();

  const handleApproveProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      addNotification({
        type: 'mentor_feedback',
        title: 'Project Approved by Mentor',
        message: `Your project "${project.title}" has been approved by a mentor!`,
        read: false,
        projectId
      });
      toast.success(`Approved "${project.title}" successfully!`);
    }
  };

  const handleFundProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project && fundingAmount) {
      addNotification({
        type: 'mentor_feedback',
        title: 'Funding Received',
        message: `You received $${fundingAmount} funding for "${project.title}"!`,
        read: false,
        projectId
      });
      toast.success(`Funded "${project.title}" with $${fundingAmount}!`);
      setFundingAmount('');
    }
  };

  const handleSubmitFeedback = () => {
    const project = projects.find(p => p.id === selectedProject);
    if (project && feedback.trim()) {
      addNotification({
        type: 'mentor_feedback',
        title: 'Mentor Feedback Received',
        message: `New feedback on "${project.title}": ${feedback.substring(0, 50)}${feedback.length > 50 ? '...' : ''}`,
        read: false,
        projectId: selectedProject!
      });
      toast.success('Feedback submitted successfully!');
      setFeedback('');
      setSelectedProject(null);
      setShowFeedbackModal(false);
    }
  };

  const openFeedbackModal = (projectId: string) => {
    setSelectedProject(projectId);
    setShowFeedbackModal(true);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Mentor Dashboard
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Guide the next generation of engineers by mentoring promising projects
          </p>
        </div>

        {/* Mentor Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Projects Reviewed
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {mentorStats.projectsReviewed}
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
                  Funds Provided
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ${mentorStats.fundsProvided.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
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
                  Mentees Guided
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {mentorStats.menteesMentored}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
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
                  Average Rating
                </p>
                <p className={`text-2xl font-bold flex items-center space-x-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span>{mentorStats.averageRating}</span>
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`mb-8 p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search projects to mentor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className={`px-4 py-3 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-400 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Clear Filters
            </button>
          </div>

          <div className={`mt-4 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Found {projectsNeedingMentor.length} projects that could use mentoring
          </div>
        </div>

        {/* Projects Needing Mentoring */}
        <div className={`rounded-xl p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 flex items-center space-x-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Target className="h-6 w-6" />
            <span>Projects Needing Mentoring</span>
          </h2>

          {projectsNeedingMentor.length === 0 ? (
            <div className="text-center py-12">
              <Heart className={`h-12 w-12 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                No projects match your criteria
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsNeedingMentor.map((project) => (
                <div key={project.id} className="space-y-4">
                  <ProjectCard project={project} showAdoptButton={false} />
                  
                  {/* Mentor Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveProject(project.id)}
                      className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    
                    <button
                      onClick={() => openFeedbackModal(project.id)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Feedback</span>
                    </button>
                  </div>

                  {/* Funding Section */}
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button
                      onClick={() => handleFundProject(project.id)}
                      disabled={!fundingAmount}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Fund</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentoring Impact */}
        <div className={`rounded-xl p-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 flex items-center space-x-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <TrendingUp className="h-6 w-6" />
            <span>Your Mentoring Impact</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className={`font-medium mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Recent Success Stories
              </h3>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className={`font-medium text-sm ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {project.title}
                        </p>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Progress increased by {Math.floor(Math.random() * 30 + 10)}% after your mentoring
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`font-medium mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Mentoring Guidelines
              </h3>
              <div className="space-y-3">
                {[
                  'Provide constructive and actionable feedback',
                  'Focus on code quality and best practices',
                  'Guide project structure and architecture decisions',
                  'Help with technology stack recommendations',
                  'Encourage collaboration and documentation'
                ].map((guideline, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Target className={`h-4 w-4 mt-0.5 text-blue-500`} />
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {guideline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setFeedback('');
          setSelectedProject(null);
        }}
        title="Provide Mentor Feedback"
        size="lg"
      >
        <div className="space-y-4">
          {selectedProject && (
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {projects.find(p => p.id === selectedProject)?.title}
              </h3>
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Share your insights and guidance to help this project succeed
              </p>
            </div>
          )}

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            placeholder="Share your feedback, suggestions for improvement, or guidance..."
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />

          <div className="flex space-x-4">
            <button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim()}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Feedback</span>
            </button>
            <button
              onClick={() => {
                setShowFeedbackModal(false);
                setFeedback('');
                setSelectedProject(null);
              }}
              className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Mentor;