// import React, { useState, useMemo } from 'react';
// // import Header from '../components/Layout/Navbar';
// import ProjectCard from '../components/UI/ProjectCard';
// import ProjectModal from '../components/UI/ProjectModal';
// import { mockProjects } from '../data/mockProjects';
// import { Project, Feedback } from '../types/mentor';

// const Mentor: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>(mockProjects);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');

//   const filteredProjects = useMemo(() => {
//     return projects.filter(project => {
//       const matchesSearch = searchTerm === '' || 
//         project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
//       const matchesStatus = statusFilter === '' || project.status === statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });
//   }, [projects, searchTerm, statusFilter]);

//   const promisingProjects = projects.filter(p => p.isPromising).length;

//   const handleTogglePromising = (projectId: string) => {
//     setProjects(projects.map(project => 
//       project.id === projectId 
//         ? { ...project, isPromising: !project.isPromising }
//         : project
//     ));

//     if (selectedProject?.id === projectId) {
//       setSelectedProject({
//         ...selectedProject,
//         isPromising: !selectedProject.isPromising
//       });
//     }
//   };

//   const handleSubmitFeedback = (projectId: string, feedbackText: string, rating: number) => {
//     const newFeedback: Feedback = {
//       id: Date.now().toString(),
//       mentorName: 'Anonymous Mentor',
//       message: feedbackText,
//       timestamp: new Date().toISOString(),
//       rating
//     };

//     setProjects(projects.map(project => 
//       project.id === projectId 
//         ? { ...project, feedback: [...project.feedback, newFeedback] }
//         : project
//     ));

//     if (selectedProject?.id === projectId) {
//       setSelectedProject({
//         ...selectedProject,
//         feedback: [...selectedProject.feedback, newFeedback]
//       });
//     }
//   };

//   const handlePledgeFunding = (projectId: string, amount: number) => {
//     setProjects(projects.map(project => 
//       project.id === projectId 
//         ? { ...project, totalFunding: project.totalFunding + amount }
//         : project
//     ));

//     if (selectedProject?.id === projectId) {
//       setSelectedProject({
//         ...selectedProject,
//         totalFunding: selectedProject.totalFunding + amount
//       });
//     }

//     alert(`Successfully pledged ₹${amount.toLocaleString()} to ${projects.find(p => p.id === projectId)?.title}!`);
//   };

//   const handleViewDetails = (project: Project) => {
//     setSelectedProject(project);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredProjects.map((project) => (
//             <ProjectCard
//               key={project.id}
//               project={project}
//               onViewDetails={handleViewDetails}
//               onTogglePromising={handleTogglePromising}
//             />
//           ))}
//         </div>

//         {filteredProjects.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-gray-400 text-lg mb-2">No projects found</div>
//             <p className="text-gray-500">Try adjusting your search criteria or filters</p>
//           </div>
//         )}
//       </main>

//       {selectedProject && (
//         <ProjectModal
//           project={selectedProject}
//           onClose={() => setSelectedProject(null)}
//           onTogglePromising={handleTogglePromising}
//           onSubmitFeedback={handleSubmitFeedback}
//           onPledgeFunding={handlePledgeFunding}
//         />
//       )}
//     </div>
//   );
// };

// export default Mentor;


import React, { useState } from 'react';
import ProjectCard from '../components/UI/ProjectCard';
import ProjectModal from '../components/UI/ProjectModal';
import { mockProjects } from '../data/mockProjects';
import { Project } from '../types/mentor';

const Mentor: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handleTogglePromising = (projectId: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId ? { ...proj, isPromising: !proj.isPromising } : proj
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, isPromising: !selectedProject.isPromising });
    }
  };

  const handleSubmitFeedback = (projectId: string, message: string, rating: number) => {
    const newFeedback = {
      id: Date.now().toString(),
      mentorName: 'Demo Mentor', // Replace with actual mentor
      message,
      rating,
      timestamp: new Date().toISOString()
    };
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? { ...proj, feedback: [...proj.feedback, newFeedback] }
          : proj
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        feedback: [...selectedProject.feedback, newFeedback]
      });
    }
  };

  const handlePledgeFunding = async (projectId: string, amount: number) => {
    // Find the project to extract title (and optionally other metadata)
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      alert('Project not found');
      return;
    }

    // Optimistically update local state so user sees immediate feedback
    setProjects((prev) => prev.map((proj) => (proj.id === projectId ? { ...proj, totalFunding: proj.totalFunding + amount } : proj)));
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, totalFunding: selectedProject.totalFunding + amount });
    }

    // Prepare payload expected by backend
    const payload = {
      projectId: project.id,
      userId: 'demo-mentor-1', // demo user id; replace with actual auth user id when available
      projectTitle: project.title,
      ticketPrice: amount,
    } as const;

    try {
      console.debug('Creating checkout session with payload:', payload);
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.debug('Create-checkout-session response status:', response.status);
      const data = await response.json().catch((e) => {
        console.error('Failed to parse JSON from create-checkout-session:', e);
        throw e;
      });
      console.debug('create-checkout-session response body:', data);

      if (response.ok && data?.url) {
        console.info('Redirecting to Stripe Checkout:', data.url);
        // Use assign to keep history entry for Back button
        window.location.assign(data.url);
        return;
      }

      console.error('Stripe session error:', data);
      alert(data?.error || 'Failed to create Stripe session');
      // throw so caller (modal) can handle spinner/cleanup
      throw new Error(data?.error || 'Failed to create Stripe session');
    } catch (err) {
      console.error('Network error creating Stripe session', err);
      alert('Error connecting to payment server');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Mentor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={handleViewDetails}
            onTogglePromising={handleTogglePromising}
          />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onTogglePromising={handleTogglePromising}
          onSubmitFeedback={handleSubmitFeedback}
          onPledgeFunding={handlePledgeFunding}
        />
      )}
    </div>
  );
};

export default Mentor;
