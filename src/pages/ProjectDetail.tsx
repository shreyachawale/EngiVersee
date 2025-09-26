import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  Star, 
  Users, 
  Calendar, 
  TrendingUp,
  Brain,
  FileText,
  Target,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/UI/Modal';
import { toast } from 'react-toastify';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, adoptProject, isDarkMode, user } = useApp();
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [selectedAIInsight, setSelectedAIInsight] = useState<'health' | 'steps' | 'pitch' | null>(null);

  const project = projects.find(p => p.id === id);
  // Support both aiInsights (old) and aiAnalysis (new)
  const ai = project?.aiAnalysis || project?.aiInsights;

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const isAdopted = user.projects.includes(project.id);

  const handleAdopt = () => {
    adoptProject(project.id);
    setShowAdoptModal(false);
    toast.success(`Successfully adopted ${project.title}!`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return isDarkMode ? 'text-green-400 bg-green-900/20' : 'text-green-700 bg-green-100';
      case 'Intermediate': return isDarkMode ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-700 bg-yellow-100';
      case 'Advanced': return isDarkMode ? 'text-red-400 bg-red-900/20' : 'text-red-700 bg-red-100';
      default: return isDarkMode ? 'text-gray-400 bg-gray-900/20' : 'text-gray-700 bg-gray-100';
    }
  };

  // Provide default empty arrays to avoid undefined.map errors
  const techStack = project.techStack || [];
  const milestones = project.milestones || [];
  const contributors = project.contributors || [];
  const tags = project.tags || [];
  const nextSteps = project.aiInsights?.nextSteps || [];
  const pitchDeck = project.aiInsights?.pitchDeck || [];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Projects</span>
        </button>

        {/* Header */}
        <div className={`rounded-xl p-8 mb-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.title}
                </h1>
                {isAdopted && <CheckCircle className="h-6 w-6 text-green-500" />}
              </div>
              
              <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {project.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {contributors.length} contributors
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <div className="flex items-center space-x-2">
                  <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Last updated {new Date(project.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 lg:items-end">
              {!isAdopted && (
                <button
                  onClick={() => setShowAdoptModal(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Star className="h-5 w-5" />
                  <span>Adopt Project</span>
                </button>
              )}

              <div className="flex space-x-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
                {/* View full AI report */}
                <button
                  onClick={() => navigate(`/project-report/${project.id}`)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    isDarkMode
                      ? 'bg-purple-700 hover:bg-purple-600 text-white'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  <Brain className="h-4 w-4" />
                  <span className="text-sm">View Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Project Progress
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {project.progress}%
              </span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-gradient-to-r from-blue-600 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tech Stack */}
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isDarkMode 
                        ? 'bg-blue-900/20 text-blue-400 border border-blue-800' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo Video */}
            {project.videoUrl && (
              <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Demo Video
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={project.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title="Project Demo"
                  />
                </div>
              </div>
            )}

            {/* Project Timeline */}
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Project Timeline
              </h2>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start space-x-4">
                    <div className={`mt-1 ${milestone.completed ? 'text-green-500' : isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {milestone.completed ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {milestone.title}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {milestone.description}
                      </p>
                      {milestone.completedAt && (
                        <p className="text-xs text-green-500 mt-1">
                          Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                        </p>
                      )}
                      {milestone.dueDate && !milestone.completed && (
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contributors */}
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Contributors
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={project.owner.avatar}
                    alt={project.owner.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.owner.name}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Project Owner
                    </p>
                  </div>
                </div>
                {contributors.map((contributor) => (
                  <div key={contributor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {contributor.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {contributor.role}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {contributor.contributions} commits
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Project Analysis */}
            {ai && (
              <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h2 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Brain className="h-6 w-6 text-purple-500" />
                  <span>AI Project Analysis</span>
                </h2>
                <div className="space-y-3">
                  {ai.summary && (
                    <div>
                      <h4 className="font-semibold mb-1">Summary</h4>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{ai.summary}</p>
                    </div>
                  )}
                  {ai.qualityReport && (
                    <div>
                      <h4 className="font-semibold mb-1">Quality Report</h4>
                      <ul className="list-disc pl-5">
                        <li>Unit Tests: {ai.qualityReport.hasUnitTests}</li>
                        <li>Documentation: {ai.qualityReport.hasDocumentation}</li>
                        <li>Complexity: {ai.qualityReport.complexityRating}</li>
                      </ul>
                    </div>
                  )}
                  {ai.criticalIssues && ai.criticalIssues.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1 text-red-500">Critical Issues</h4>
                      <ul className="list-disc pl-5">
                        {ai.criticalIssues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {ai.suggestedFeatures && ai.suggestedFeatures.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1 text-blue-500">Suggested Features</h4>
                      <ul className="list-disc pl-5">
                        {ai.suggestedFeatures.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adopt Confirmation Modal */}
      <Modal
        isOpen={showAdoptModal}
        onClose={() => setShowAdoptModal(false)}
        title="Confirm Adoption"
      >
        <div className="space-y-4">
          <p>Are you sure you want to adopt <strong>{project.title}</strong>?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAdoptModal(false)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdopt}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* AI Insight Modal */}
      <Modal
        isOpen={!!selectedAIInsight}
        onClose={() => setSelectedAIInsight(null)}
        title={
          selectedAIInsight === 'health' ? 'Health Report' :
          selectedAIInsight === 'steps' ? 'Next Steps' :
          'Pitch Deck'
        }
      >
        <div className="space-y-3">
          {selectedAIInsight === 'health' && (
            <p>
              Health Score: {project.aiInsights?.healthScore || 0}/100
            </p>
          )}
          {selectedAIInsight === 'steps' && (
            <ul className="list-disc pl-5">
              {nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          )}
          {selectedAIInsight === 'pitch' && (
            <ul className="list-disc pl-5">
              {pitchDeck.map((slide, index) => (
                <li key={index}>{slide}</li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
