// // project/server/index.js
// import simpleGit from 'simple-git';
// import fs, { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
// import path from 'path';
// import express from 'express';
// import cors from 'cors';
// import multer from 'multer';
// import { fileURLToPath } from 'url';

// // --- ES Module setup ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const PROJECTS_PATH = path.join(__dirname, 'projects.json');
// const TEMP_REPO_DIR = path.join(__dirname, 'temp_repos');

// // Ensure temp folder exists
// if (!existsSync(TEMP_REPO_DIR)) fs.mkdirSync(TEMP_REPO_DIR, { recursive: true });

// const app = express();
// const upload = multer({ dest: 'uploads/' });

// app.use(cors());
// app.use(express.json());

// // ========================
// // Helper Functions
// // ========================

// // Mock AI analysis
// async function mock_call_gemini_analysis(fileContents) {
//   const numFiles = Object.keys(fileContents).length;
//   const hasTests = Object.keys(fileContents).some(f => f.includes('test'));
//   const hasDocs = Object.keys(fileContents).some(f => f.toLowerCase().includes('readme'));
//   let keyIssue = "High risk of breaking changes due to poor variable naming in core logic.";
//   if (fileContents['src/auth.js']?.includes('TODO')) {
//     keyIssue = "Authentication module (src/auth.js) contains unhandled error cases and TODOs for token refresh.";
//   }
//   return {
//     summary: `The project contains ${numFiles} files. It appears to be a basic Node.js service focusing on API endpoints.`,
//     qualityReport: {
//       hasUnitTests: hasTests ? "Partial" : "No",
//       hasDocumentation: hasDocs ? "Basic" : "Missing",
//       complexityRating: "Medium",
//     },
//     criticalIssues: [keyIssue, "Logging mechanism is inconsistent across files."],
//     suggestedFeatures: ["Implement a rate-limiter for API endpoints.", "Migrate to TypeScript for better type safety."]
//   };
// }

// // Recursively get all files
// function getAllFiles(dir, fileList = []) {
//   if (!existsSync(dir)) return fileList;
//   const files = readdirSync(dir);
//   for (const file of files) {
//     const fullPath = path.join(dir, file);
//     if (['node_modules', '.git'].includes(file)) continue;
//     if (statSync(fullPath).isDirectory()) getAllFiles(fullPath, fileList);
//     else fileList.push(fullPath);
//   }
//   return fileList;
// }

// /**
//  * Clones repository if it doesn't exist, otherwise does nothing.
//  * @param {string} repoUrl - The URL of the Git repository.
//  * @param {string} targetDir - The local directory path for the clone.
//  * @returns {Promise<boolean>} - True if a new clone happened, false otherwise.
//  */
// async function cloneRepoOnce(repoUrl, targetDir) {
//   if (existsSync(targetDir)) {
//     console.log(`Repository already cloned to ${targetDir}. Skipping clone.`);
//     return false;
//   }
  
//   const git = simpleGit();
//   fs.mkdirSync(targetDir, { recursive: true });
//   await git.clone(repoUrl, targetDir);
//   console.log(`Successfully cloned repository to ${targetDir}.`);
//   return true;
// }

// // Analyze repo health
// async function analyzeRepoHealth(targetDir) {
//   const git = simpleGit(targetDir);
//   try {
//     const log = await git.log();
//     return {
//       totalCommits: log.total || 0,
//       contributors: log.all ? [...new Set(log.all.map(c => c.author_name))].length : 0,
//       lastCommitDate: log.latest?.date || null,
//       latestCommitMsg: log.latest?.message || 'No commits',
//       daysSinceLastCommit: log.latest ? Math.floor((Date.now() - new Date(log.latest.date)) / (1000*60*60*24)) : null,
//       active: (log.total || 0) > 0
//     };
//   } catch (e) {
//     return {
//       totalCommits: 0, contributors: 0, lastCommitDate: null,
//       latestCommitMsg: 'No commits', daysSinceLastCommit: null, active: false
//     };
//   }
// }

// // Analyze branch health
// async function analyzeBranchHealth(targetDir) {
//   const git = simpleGit(targetDir);
//   try {
//     const branches = await git.branch();
//     const allBranches = Array.isArray(branches.all) ? branches.all : Object.values(branches.all || []);
//     const mergedArr = Array.isArray(branches.merged) ? branches.merged : [];
//     const mergedCount = allBranches.filter(b => mergedArr.includes(b)).length;
//     return {
//       totalBranches: allBranches.length,
//       merged: mergedCount,
//       unmerged: Math.max(0, allBranches.length - mergedCount),
//       active: allBranches.length > 0,
//       stale: 0,
//       activeBranches: allBranches,
//       staleBranches: []
//     };
//   } catch (e) {
//     return { totalBranches: 0, merged: 0, unmerged: 0, active: false, stale: 0, activeBranches: [], staleBranches: [] };
//   }
// }

// // Analyze code files (AI)
// async function analyzeCodebaseAI(targetDir) {
//   const files = getAllFiles(targetDir);
//   const fileContents = {};
//   files.forEach(f => {
//     try { fileContents[path.relative(targetDir, f)] = readFileSync(f, 'utf-8'); }
//     catch(e){ fileContents[path.relative(targetDir, f)] = ''; }
//   });
//   return await mock_call_gemini_analysis(fileContents);
// }

// // Generate next steps roadmap
// function generateNextSteps(projectReport) {
//   return projectReport.suggestedFeatures || [];
// }

// // Calculate health score
// function calculateHealthScore(repoStats, branchStats, projectReport) {
//   let score = 50;
//   if (projectReport.qualityReport.hasUnitTests !== "No") score += 10;
//   if (projectReport.qualityReport.hasDocumentation !== "Missing") score += 10;
//   if (branchStats.active > 0) score += 10;
//   return Math.min(score, 100);
// }

// // Master function
// async function generateFullProjectReport(targetDir) {
//   const repoStats = await analyzeRepoHealth(targetDir);
//   const branchStats = await analyzeBranchHealth(targetDir);
//   const projectReport = await analyzeCodebaseAI(targetDir);
//   const roadmap = generateNextSteps(projectReport);
//   const healthScore = calculateHealthScore(repoStats, branchStats, projectReport);
//   return { repoStats, branchStats, projectReport, roadmap, healthScore };
// }

// // ========================
// // Routes
// // ========================

// // GET all projects
// app.get('/projects', (req, res) => {
//   let projects = [];
//   if (existsSync(PROJECTS_PATH)) projects = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
//   res.json(projects);
// });

// // POST /analyze (upload files + formData)
// app.post('/analyze', upload.array('files'), async (req, res) => {
//   try {
//     const formData = req.body.formData ? JSON.parse(req.body.formData) : {};
//     const files = req.files || [];

//     const project = {
//       ...formData,
//       files: files.map(f => ({
//         originalname: f.originalname,
//         filename: f.filename,
//         mimetype: f.mimetype,
//         size: f.size
//       })),
//       createdAt: new Date().toISOString(),
//       id: Date.now().toString(),
//     };

//     let projects = [];
//     if (existsSync(PROJECTS_PATH)) projects = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
//     projects.push(project);
//     writeFileSync(PROJECTS_PATH, JSON.stringify(projects, null, 2));

//     res.json({ success: true, project });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /project-report/:id
// app.get('/project-report/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!existsSync(PROJECTS_PATH)) return res.status(404).json({ error: 'No projects found' });

//     const projects = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
//     const project = projects.find(p => p.id === id);
//     if (!project) return res.status(404).json({ error: 'Project not found' });

//     let fullReport;
//     const githubUrl = project.githubUrl || null;
//     console.log('Generating report for project id:', id, 'githubUrl:', githubUrl);

//     if (githubUrl) {
//       // 1. Create a stable, predictable tempDir name using only the project ID.
//       const tempDir = path.join(TEMP_REPO_DIR, project.id); 
      
//       try {
//         // 2. Use the new function that only clones if the directory doesn't exist.
//         await cloneRepoOnce(githubUrl, tempDir);
//         fullReport = await generateFullProjectReport(tempDir);
        
//       } catch (cloneErr) {
//         console.error('Git operation failed (clone/analysis), falling back to uploaded files:', cloneErr.message);

//         // Fallback logic remains the same for uploaded files
//         const uploadDir = path.join(__dirname, 'uploads', project.id);
//         if (!existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//         if (project.files && project.files.length > 0) {
//           for (const f of project.files) {
//             const src = path.join(__dirname, 'uploads', f.filename);
//             const dest = path.join(uploadDir, f.originalname);
//             if (existsSync(src)) fs.copyFileSync(src, dest);
//           }
//         }
//         fullReport = await generateFullProjectReport(uploadDir);
//       }
//       // NOTE: Removed the 'finally' block that deleted 'tempDir' to ensure the cloned repository persists for future requests.
//     } else {
//       // Logic for non-GitHub projects (uploaded files)
//       const uploadDir = path.join(__dirname, 'uploads', project.id);
//       fullReport = await generateFullProjectReport(uploadDir);
//     }

//     res.json(fullReport);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// app.listen(5000, () => console.log('Server started on port 5000'));



// project/server/index.js
import simpleGit from 'simple-git';
import fs, { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';

// --- ES Module setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECTS_PATH = path.join(__dirname, 'projects.json');
const TEMP_REPO_DIR = path.join(__dirname, 'temp_repos');

// Ensure temp folder exists
if (!existsSync(TEMP_REPO_DIR)) fs.mkdirSync(TEMP_REPO_DIR, { recursive: true });

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// ========================
// Helper Functions
// ========================

// Mock AI analysis
async function mock_call_gemini_analysis(fileContents) {
  const numFiles = Object.keys(fileContents).length;
  const hasTests = Object.keys(fileContents).some(f => f.includes('test'));
  const hasDocs = Object.keys(fileContents).some(f => f.toLowerCase().includes('readme'));
  let keyIssue = "High risk of breaking changes due to poor variable naming in core logic.";
  if (fileContents['src/auth.js']?.includes('TODO')) {
    keyIssue = "Authentication module (src/auth.js) contains unhandled error cases and TODOs for token refresh.";
  }
  return {
    summary: `The project contains ${numFiles} files. It appears to be a basic Node.js service focusing on API endpoints.`,
    qualityReport: {
      hasUnitTests: hasTests ? "Partial" : "No",
      hasDocumentation: hasDocs ? "Basic" : "Missing",
      complexityRating: "Medium",
    },
    criticalIssues: [keyIssue, "Logging mechanism is inconsistent across files."],
    suggestedFeatures: ["Implement a rate-limiter for API endpoints.", "Migrate to TypeScript for better type safety."]
  };
}

// Recursively get all files
function getAllFiles(dir, fileList = []) {
  if (!existsSync(dir)) return fileList;
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (['node_modules', '.git'].includes(file)) continue;
    if (statSync(fullPath).isDirectory()) getAllFiles(fullPath, fileList);
    else fileList.push(fullPath);
  }
  return fileList;
}

/**
 * Clones repository if it doesn't exist, otherwise does nothing (ONLY ONCE).
 * @param {string} repoUrl - The URL of the Git repository.
 * @param {string} targetDir - The local directory path for the clone.
 */
async function cloneRepoOnce(repoUrl, targetDir) {
  if (existsSync(targetDir)) {
    console.log(`ℹ️ Repository already cloned to ${targetDir}. Skipping clone.`);
    return true;
  }
  
  const git = simpleGit();
  fs.mkdirSync(targetDir, { recursive: true });
  await git.clone(repoUrl, targetDir);
  console.log(`✅ Successfully cloned repository to ${targetDir}.`);
  return true;
}

// Analyze repo health
async function analyzeRepoHealth(targetDir) {
  const git = simpleGit(targetDir);
  try {
    const log = await git.log();
    return {
      totalCommits: log.total || 0,
      contributors: log.all ? [...new Set(log.all.map(c => c.author_name))].length : 0,
      lastCommitDate: log.latest?.date || null,
      latestCommitMsg: log.latest?.message || 'No commits',
      daysSinceLastCommit: log.latest ? Math.floor((Date.now() - new Date(log.latest.date)) / (1000*60*60*24)) : null,
      active: (log.total || 0) > 0
    };
  } catch (e) {
    return {
      totalCommits: 0, contributors: 0, lastCommitDate: null,
      latestCommitMsg: 'No commits', daysSinceLastCommit: null, active: false
    };
  }
}

// ========================
// CORRECTED Branch Health Analysis
// ========================
async function analyzeBranchHealth(targetDir, baseBranch = 'main') {
  const git = simpleGit(targetDir);
  try {
    await git.fetch(); // Ensure local data is up-to-date

    // 1. Get all local branches
    const branchResult = await git.branchLocal();
    const allLocalBranches = branchResult.all || [];

    // 2. Get branches merged into the base branch
    const mergedResult = await git.branch(['--merged', baseBranch]);
    const mergedBranches = mergedResult.all || [];

    // 3. Get branches NOT merged into the base branch (unmerged)
    const unmergedBranches = allLocalBranches.filter(b => !mergedBranches.includes(b));
    
    // Determine active/stale status based on time (simplified approach)
    let staleCount = 0;
    const activeBranchesInfo = []; // List of unmerged branches for display

    for (const branchName of allLocalBranches) {
        if (branchName === branchResult.current) continue; // Skip current branch for stale check

        try {
            // Get last commit for the branch
            const log = await git.log({ from: branchName, to: branchName, n: 1 });
            if (log.latest) {
                const lastCommitDate = new Date(log.latest.date);
                const daysSince = Math.floor((Date.now() - lastCommitDate) / (1000 * 60 * 60 * 24));
                
                if (daysSince > 90) { // Definition of 'stale'
                    staleCount++;
                }
            }
        } catch (e) {
            // Can happen for remote-only or badly formed branches
        }
    }
    
    // Populate activeBranches for display (only showing unmerged names for relevance)
    unmergedBranches.forEach(branch => activeBranchesInfo.push(branch));

    return {
      totalBranches: allLocalBranches.length,
      merged: mergedBranches.length,
      unmerged: unmergedBranches.length,
      active: activeBranchesInfo.length,
      stale: staleCount,
      // For display on the client (using the names of unmerged branches as 'active')
      activeBranches: activeBranchesInfo.join(', '), 
      staleBranches: [], 
    };
  } catch (e) {
    console.error("Error analyzing branch health:", e.message);
    return { totalBranches: 0, merged: 0, unmerged: 0, active: 0, stale: 0, activeBranches: '', staleBranches: [] };
  }
}

// Analyze code files (AI)
async function analyzeCodebaseAI(targetDir) {
  const files = getAllFiles(targetDir);
  const fileContents = {};
  files.forEach(f => {
    try { fileContents[path.relative(targetDir, f)] = readFileSync(f, 'utf-8'); }
    catch(e){ fileContents[path.relative(targetDir, f)] = ''; }
  });
  return await mock_call_gemini_analysis(fileContents);
}

// Generate next steps roadmap
function generateNextSteps(projectReport) {
  return projectReport.suggestedFeatures || [];
}

// Calculate health score
function calculateHealthScore(repoStats, branchStats, projectReport) {
  let score = 50;
  if (projectReport.qualityReport.hasUnitTests !== "No") score += 10;
  if (projectReport.qualityReport.hasDocumentation !== "Missing") score += 10;
  if (branchStats.active > 0) score += 10;
  return Math.min(score, 100);
}

// Master function
async function generateFullProjectReport(targetDir) {
  const repoStats = await analyzeRepoHealth(targetDir);
  const branchStats = await analyzeBranchHealth(targetDir);
  const projectReport = await analyzeCodebaseAI(targetDir);
  const roadmap = generateNextSteps(projectReport);
  const healthScore = calculateHealthScore(repoStats, branchStats, projectReport);
  return { repoStats, branchStats, projectReport, roadmap, healthScore };
}

// ========================
// Routes
// ========================

// GET all projects
app.get('/projects', (req, res) => {
  let projects = [];
  if (existsSync(PROJECTS_PATH)) projects = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
  res.json(projects);
});

// POST /analyze (upload files + formData)
app.post('/analyze', upload.array('files'), async (req, res) => {
  try {
    const formData = req.body.formData ? JSON.parse(req.body.formData) : {};
    const files = req.files || [];

    const project = {
      ...formData,
      files: files.map(f => ({
        originalname: f.originalname,
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size
      })),
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
    };

    let projects = [];
    if (existsSync(PROJECTS_PATH)) projects = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
    projects.push(project);
    writeFileSync(PROJECTS_PATH, JSON.stringify(projects, null, 2));

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /project-report/:id
app.get('/project-report/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!existsSync(PROJECTS_PATH)) return res.status(404).json({ error: 'No projects found' });

    const projects = JSON.parse(readFileSync(PROJECTS_PATH, 'utf-8'));
    const project = projects.find(p => p.id === id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let fullReport;
    const githubUrl = project.githubUrl || null;
    console.log('Generating report for project id:', id, 'githubUrl:', githubUrl);

    if (githubUrl) {
      // Use stable directory name for "clone only once"
      const tempDir = path.join(TEMP_REPO_DIR, project.id); 

      try {
        // Use the cloneRepoOnce function to prevent re-cloning
        await cloneRepoOnce(githubUrl, tempDir);
        fullReport = await generateFullProjectReport(tempDir);
      } catch (cloneErr) {
        console.error('Git operation failed (clone/analysis), falling back to uploaded files:', cloneErr.message);

        // Fallback logic remains the same for uploaded files
        const uploadDir = path.join(__dirname, 'uploads', project.id);
        if (!existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        if (project.files && project.files.length > 0) {
          for (const f of project.files) {
            const src = path.join(__dirname, 'uploads', f.filename);
            const dest = path.join(uploadDir, f.originalname);
            if (existsSync(src)) fs.copyFileSync(src, dest);
          }
        }
        fullReport = await generateFullProjectReport(uploadDir);
      }
      // NO finally block to remove tempDir, ensuring the clone persists
    } else {
      // Logic for non-GitHub projects (uploaded files)
      const uploadDir = path.join(__dirname, 'uploads', project.id);
      fullReport = await generateFullProjectReport(uploadDir);
    }

    res.json(fullReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => console.log('Server started on port 5000'));