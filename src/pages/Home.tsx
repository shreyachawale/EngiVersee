import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Users, Lightbulb, TrendingUp, Star, PlayCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/UI/ProjectCard';

const Home: React.FC = () => {
  const { projects, isDarkMode } = useApp();
  
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Where Engineering 
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                {' '}Ideas Come to Life
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover, adopt, and contribute to innovative engineering side projects. 
              Connect with fellow developers and bring abandoned projects back to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/projects"
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
              >
                <span>Explore Projects</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/upload"
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                }`}
              >
                Upload Your Project
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-emerald-500 rounded-full opacity-10 animate-pulse delay-300" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-orange-500 rounded-full opacity-10 animate-pulse delay-700" />
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-24 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why EngiVerse?
            </h2>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              The perfect platform for engineering collaboration and project revival
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code2,
                title: 'Quality Projects',
                description: 'Discover well-documented engineering projects ready for contribution'
              },
              {
                icon: Users,
                title: 'Active Community',
                description: 'Connect with passionate developers and experienced mentors'
              },
              {
                icon: Lightbulb,
                title: 'AI-Powered Insights',
                description: 'Get intelligent recommendations and project health analysis'
              },
              {
                icon: TrendingUp,
                title: 'Track Progress',
                description: 'Monitor your contributions and project milestones in real-time'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-700 hover:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <feature.icon className={`h-12 w-12 mb-4 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Featured Projects
              </h2>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Discover trending projects in our community
              </p>
            </div>
            <Link
              to="/projects"
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-blue-900 hover:bg-blue-800 text-blue-400' 
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
              }`}
            >
              View All Projects
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-24 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '150+', label: 'Active Projects' },
              { number: '500+', label: 'Developers' },
              { number: '50+', label: 'Mentors' },
              { number: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className={`text-3xl font-bold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {stat.number}
                </div>
                <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Start Your Journey?
          </h2>
          <p className={`text-lg mb-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Join thousands of developers bringing engineering projects to life. 
            Start contributing today and make your mark on the future of technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Star className="h-5 w-5" />
              <span>Find Your Next Project</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;