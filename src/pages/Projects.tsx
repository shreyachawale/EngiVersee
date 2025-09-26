import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, SortAsc } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/UI/ProjectCard';

const Projects: React.FC = () => {
  const { projects, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'contributors'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique filter options
  const allTechStack = useMemo(() => {
    const techs = projects.flatMap(p => p.techStack);
    return [...new Set(techs)].sort();
  }, [projects]);

  const allCategories = useMemo(() => {
    return [...new Set(projects.map(p => p.category))].sort();
  }, [projects]);

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech = !selectedTech || project.techStack.includes(selectedTech);
      const matchesDifficulty = !selectedDifficulty || project.difficulty === selectedDifficulty;
      const matchesCategory = !selectedCategory || project.category === selectedCategory;

      return matchesSearch && matchesTech && matchesDifficulty && matchesCategory;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        case 'progress':
          return b.progress - a.progress;
        case 'contributors':
          return b.contributors.length - a.contributors.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, selectedTech, selectedDifficulty, selectedCategory, sortBy]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Project Marketplace
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Discover and adopt engineering side projects from our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`mb-8 p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="">All Technologies</option>
              {allTechStack.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'progress' | 'contributors')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="recent">Most Recent</option>
              <option value="progress">Highest Progress</option>
              <option value="contributors">Most Contributors</option>
            </select>

            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                  viewMode === 'grid'
                    ? isDarkMode 
                      ? 'bg-blue-900 text-blue-400' 
                      : 'bg-blue-50 text-blue-600'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-2 flex items-center justify-center transition-colors ${
                  viewMode === 'list'
                    ? isDarkMode 
                      ? 'bg-blue-900 text-blue-400' 
                      : 'bg-blue-50 text-blue-600'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTech('');
                setSelectedDifficulty('');
                setSelectedCategory('');
                setSortBy('recent');
              }}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-400 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Clear Filters
            </button>
          </div>

          {/* Results Count */}
          <div className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className={`text-center py-12 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                showAdoptButton={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;