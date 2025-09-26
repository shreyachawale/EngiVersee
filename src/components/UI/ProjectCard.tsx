import React from 'react';
import { Star, Clock, CheckCircle, AlertCircle, Users, Tag } from 'lucide-react';
import { Project } from '../../types/mentor';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onTogglePromising: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onViewDetails, 
  onTogglePromising 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePromising(project.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              project.isPromising 
                ? 'bg-yellow-400 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-yellow-400 hover:text-white'
            }`}
          >
            <Star className={`w-4 h-4 ${project.isPromising ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            {project.status.replace('-', ' ')}
          </span>
        </div>
      </div>
      
      <div className="p-6" onClick={() => onViewDetails(project)}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <div className="text-right text-sm text-gray-500">
            <div className="font-medium text-emerald-600">₹{project.totalFunding.toLocaleString()}</div>
            <div className="text-xs">funded</div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 font-medium">{project.author}</span>
          {project.team.length > 1 && (
            <span className="text-xs text-gray-500">+{project.team.length - 1} others</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 mb-4">
          <Tag className="w-3 h-3 text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <span>{project.feedback.length} feedback</span>
          </div>
          <span className="text-blue-600 font-medium group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;