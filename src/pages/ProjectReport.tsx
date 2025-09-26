// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Brain, ArrowLeft } from 'lucide-react';

// const ProjectReport: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [report, setReport] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     fetch(`http://localhost:5000/project-report/${id}`)
//       .then(async res => {
//         if (res.ok) return res.json();
//         const errBody = await res.json().catch(() => ({}));
//         return Promise.reject(errBody.error || 'Not found');
//       })
//       .then(data => {
//         setReport(data);
//         setLoading(false);
//       })
//       .catch((err: any) => {
//         setError(typeof err === 'string' ? err : 'Could not load report.');
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div className="p-8 text-center">Loading...</div>;
//   if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
//   if (!report) return null;

//   const { repoStats = {}, branchStats = {}, projectReport = {}, roadmap = [], healthScore = 0 } = report;

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
//       >
//         <ArrowLeft className="h-5 w-5" />
//         <span>Back</span>
//       </button>
//       <div className="rounded-xl p-6 bg-white border border-gray-200 mb-8">
//         <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
//           <Brain className="h-6 w-6 text-purple-500" />
//           <span>AI Project Report</span>
//         </h2>
//         <div className="mb-4">
//           <span className="font-semibold">Health Score:</span> <span className="text-blue-600 font-bold">{healthScore}/100</span>
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1">Summary</h3>
//           <p>{projectReport.summary || 'No summary available.'}</p>
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1">Quality Report</h3>
//           <ul className="list-disc pl-5">
//             <li>Unit Tests: {projectReport.qualityReport?.hasUnitTests ?? 'Unknown'}</li>
//             <li>Documentation: {projectReport.qualityReport?.hasDocumentation ?? 'Unknown'}</li>
//             <li>Complexity: {projectReport.qualityReport?.complexityRating ?? 'Unknown'}</li>
//           </ul>
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1 text-red-500">Critical Issues</h3>
//           <ul className="list-disc pl-5">
//             {(projectReport.criticalIssues || ['No critical issues found']).map((issue: string, idx: number) => (
//                 <li key={idx}>{issue}</li>
//               ))}
//           </ul>
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1 text-blue-500">Suggested Features</h3>
//           <ul className="list-disc pl-5">
//             {(projectReport.suggestedFeatures || []).map((feature: string, idx: number) => (
//               <li key={idx}>{feature}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1">Roadmap</h3>
//           <ul className="list-disc pl-5">
//             {(roadmap || []).map((step: string, idx: number) => (
//               <li key={idx}>{step}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1">Repo Stats</h3>
//           <ul className="list-disc pl-5">
//             <li>Total Commits: {repoStats.totalCommits}</li>
//             <li>Contributors: {repoStats.contributors}</li>
//             <li>Last Commit: {repoStats.lastCommitDate ? new Date(repoStats.lastCommitDate).toLocaleDateString() : 'N/A'}</li>
//             <li>Latest Commit Message: {repoStats.latestCommitMsg}</li>
//             <li>Days Since Last Commit: {repoStats.daysSinceLastCommit}</li>
//             <li>Active: {repoStats.active ? 'Yes' : 'No'}</li>
//           </ul>
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-1">Branch Stats</h3>
//           <ul className="list-disc pl-5">
//             <li>Total Branches: {branchStats.totalBranches}</li>
//             <li>Merged: {branchStats.merged}</li>
//             <li>Unmerged: {branchStats.unmerged}</li>
//             <li>Active Branches: {Array.isArray(branchStats.activeBranches) ? branchStats.activeBranches.join(', ') : (branchStats.active ? 'Yes' : 'No')}</li>
//             <li>Stale Branches: {branchStats.stale}</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectReport;



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';

const ProjectReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Using 'any' type for simplicity, but ideally this would use a defined Report interface.
  const [report, setReport] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Assuming this endpoint returns the object matching the 'fullReport' structure
    fetch(`http://localhost:5000/project-report/${id}`) 
      .then(async res => {
        if (res.ok) return res.json();
        const errBody = await res.json().catch(() => ({}));
        return Promise.reject(errBody.error || 'Report not found');
      })
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(typeof err === 'string' ? err : 'Could not load project report.');
        setLoading(false);
      });
  }, [id]); // Dependency array includes 'id'

  if (loading) return <div className="p-8 text-center text-gray-600">Loading AI Report...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">Error: {error}</div>;
  if (!report) return null;

  // Destructure with default empty objects/arrays for safety
  const { 
    repoStats = {}, 
    branchStats = {}, 
    projectReport = {}, 
    roadmap = [], 
    healthScore = 0 
  } = report;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>
      <div className="rounded-xl p-6 bg-white border border-gray-200 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3 text-gray-900">
          <Brain className="h-7 w-7 text-purple-600" />
          <span>AI Project Report</span>
        </h2>
        
        {/* Health Score */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="font-semibold text-lg text-gray-700">Health Score:</span> 
          <span className="text-blue-600 text-xl font-extrabold ml-2">{healthScore}/100</span>
        </div>

        {/* Project Analysis */}
        <div className="space-y-6">
          <div className="pb-4 border-b">
            <h3 className="font-semibold text-xl mb-2">Summary</h3>
            <p className="text-gray-700">{projectReport.summary || 'No summary available.'}</p>
          </div>

          <div className="pb-4 border-b">
            <h3 className="font-semibold text-xl mb-2">Quality Report</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Unit Tests: <span className="font-medium">{projectReport.qualityReport?.hasUnitTests ?? 'Unknown'}</span></li>
              <li>Documentation: <span className="font-medium">{projectReport.qualityReport?.hasDocumentation ?? 'Unknown'}</span></li>
              <li>Complexity: <span className="font-medium">{projectReport.qualityReport?.complexityRating ?? 'Unknown'}</span></li>
            </ul>
          </div>

          <div className="pb-4 border-b">
            <h3 className="font-semibold text-xl mb-2 text-red-600">Critical Issues</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {(projectReport.criticalIssues || ['No critical issues found']).map((issue: string, idx: number) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>

          <div className="pb-4 border-b">
            <h3 className="font-semibold text-xl mb-2 text-blue-600">Suggested Features</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {(projectReport.suggestedFeatures || ['No suggestions at this time.']).map((feature: string, idx: number) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="pb-4 border-b">
            <h3 className="font-semibold text-xl mb-2">Roadmap (Next Steps)</h3>
            <ul className="list-decimal pl-5 text-gray-700 space-y-1">
              {(roadmap || ['No immediate roadmap steps provided.']).map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Repository Stats */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-lg mb-2 text-gray-800">Repository Statistics</h3>
          
          <h4 className="font-semibold text-base mt-3">Commit History</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Total Commits: <span className="font-medium">{repoStats.totalCommits || 0}</span></li>
            <li>Contributors: <span className="font-medium">{repoStats.contributors || 0}</span></li>
            <li>Last Commit Date: <span className="font-medium">{repoStats.lastCommitDate ? new Date(repoStats.lastCommitDate).toLocaleDateString() : 'N/A'}</span></li>
            <li>Days Since Last Commit: <span className="font-medium">{repoStats.daysSinceLastCommit ?? 'N/A'}</span></li>
            <li>Latest Commit Message: <span className="italic">{repoStats.latestCommitMsg || 'N/A'}</span></li>
            <li>Repo Active: <span className="font-medium">{repoStats.active ? 'Yes' : 'No'}</span></li>
          </ul>

          <h4 className="font-semibold text-base mt-3">Branch Health</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Total Branches: <span className="font-medium">{branchStats.totalBranches || 0}</span></li>
            <li>Merged Branches: <span className="font-medium">{branchStats.merged || 0}</span></li>
            <li>Unmerged Branches: <span className="font-medium">{branchStats.unmerged || 0}</span></li>
            <li>Stale Branches: <span className="font-medium">{branchStats.stale || 0}</span></li>
            <li>Active Branches: 
              <span className="font-medium">
                {Array.isArray(branchStats.activeBranches) && branchStats.activeBranches.length > 0
                  ? branchStats.activeBranches.join(', ')
                  : 'None'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectReport;