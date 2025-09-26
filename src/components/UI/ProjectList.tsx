import React, { useState } from 'react';
import { mockProjects } from '../../data/mockProjects';
import ProjectCard from './ProjectCard';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState(mockProjects);

  const handleTogglePromising = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, isPromising: !p.isPromising } : p
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">All Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={() => {}}
            onTogglePromising={handleTogglePromising}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
