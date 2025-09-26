const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

// =========================================================================================
// ⚠️ MOCK AI FUNCTION
// Simulates the structured analysis from a model like Gemini 1.5 Flash.
// =========================================================================================
async function mock_call_gemini_analysis(fileContents) {
  // Example logic to generate dynamic, AI-like insights
  const numFiles = Object.keys(fileContents).length;
  let hasTests = Object.keys(fileContents).some(f => f.includes('test'));
  let hasDocs = Object.keys(fileContents).some(f => f.includes('README.md'));
  
  let keyIssue = "High risk of breaking changes due to poor variable naming in core logic.";
  let keyFeature = "REST API implementation for user management is robust.";

  if (fileContents['src/auth.js'] && fileContents['src/auth.js'].includes('TODO')) {
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
    suggestedFeatures: ["Implement a rate-limiter for API endpoints.", "Migrate to TypeScript for better type safety."],
  };
}


// Helper: Recursively get all files, ignoring node_modules, .git, etc.
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'temp') return; 

    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// ========================
// 1️⃣ Clone Repository
// ========================
async function cloneRepo(repoUrl, targetDir) {
  if (!repoUrl) return null;
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const git = simpleGit();
  try {
    await git.clone(repoUrl, targetDir);
    console.log('✅ Repo cloned successfully');
    return true;
  } catch (err) {
    if (err.message.includes("already exists")) {
      console.log("ℹ️ Repo already exists, skipping clone.");
      return true;
    }
    console.error('❌ git clone failed', err.message);
    return false;
  }
}

// ========================
// 2️⃣ Analyze Repo Health (FIXED for 'no commits' error)
// ========================
async function analyzeRepoHealth(targetDir) {
  const git = simpleGit(targetDir);
  let commits = [];

  try {
    const log = await git.log();
    commits = log.all;
  } catch (err) {
    // ⚠️ FIX: Gracefully handle the 'fatal: does not have any commits yet' error
    if (err.message.includes("does not have any commits yet")) {
      console.log("⚠️ Repository branch is empty (no commits found).");
    } else {
      // Re-throw if it's an unexpected git error
      console.error("❌ An unexpected error occurred during git log:", err.message);
      throw err; 
    }
  }

  if (commits.length === 0) {
    return {
      totalCommits: 0,
      contributors: 0,
      lastCommitDate: new Date(0), // Use epoch for placeholder
      latestCommitMsg: "N/A (No commits)",
      daysSinceLastCommit: Infinity,
      active: false,
    };
  }

  const contributors = [...new Set(commits.map(c => c.author_email))];
  const lastCommit = commits[0];
  const lastCommitDate = new Date(lastCommit.date);
  const daysSinceLastCommit = Math.floor((Date.now() - lastCommitDate) / (1000 * 60 * 60 * 24));

  return {
    totalCommits: commits.length,
    contributors: contributors.length,
    lastCommitDate,
    latestCommitMsg: lastCommit.message,
    daysSinceLastCommit,
    active: daysSinceLastCommit < 30,
  };
}


// ========================
// 3️⃣ Analyze Branch Health
// ========================
async function analyzeBranchHealth(targetDir, baseBranch = 'main') {
  const git = simpleGit(targetDir);
  await git.fetch();

  // Handle case where fetch might fail or base branch might not exist
  try {
    const branches = await git.branch(['-r']);
    const branchNames = Object.keys(branches.branches);

    const mergedBranches = (await git.branch(['--merged', baseBranch])).all;
    const unmergedBranches = (await git.branch(['--no-merged', baseBranch])).all;

    const staleBranches = [];
    const activeBranches = [];

    for (const branch of branchNames) {
      try {
        const log = await git.log([branch]);
        if (log.all.length === 0) continue;
        const lastCommitDate = new Date(log.latest.date);
        const daysSince = Math.floor((Date.now() - lastCommitDate) / (1000 * 60 * 60 * 24));

        if (daysSince > 90) {
          staleBranches.push({ branch, lastCommitDate });
        } else {
          activeBranches.push({ branch, lastCommitDate });
        }
      } catch (err) {
        // This is necessary if a remote branch exists but its history cannot be read (e.g., deleted force-pushed)
        console.warn(`⚠️ Could not read branch ${branch}:`, err.message);
      }
    }

    return {
      totalBranches: branchNames.length,
      merged: mergedBranches.length,
      unmerged: unmergedBranches.length,
      active: activeBranches.length,
      stale: staleBranches.length,
      activeBranches,
      staleBranches,
    };
  } catch (err) {
    console.error(`❌ Error analyzing branch health. Is base branch '${baseBranch}' correct?`, err.message);
    return { totalBranches: 0, merged: 0, unmerged: 0, active: 0, stale: 0, activeBranches: [], staleBranches: [] };
  }
}

// ========================
// 4️⃣ Analyze Project Files (AI-POWERED)
// ========================
async function analyzeCodebaseAI(targetDir) {
  const allFiles = getAllFiles(targetDir);
  const fileContents = {};
  
  // 1. Basic Static Analysis
  const report = {
    missingModules: [],
    potentialBugs: [],
    completionStatus: fs.existsSync(path.join(targetDir, 'index.js')) ? 'Partially Complete' : 'Incomplete',
  };

  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const deps = pkg.dependencies || {};
    Object.keys(deps).forEach(dep => {
      const depPath = path.join(targetDir, 'node_modules', dep);
      if (!fs.existsSync(depPath)) report.missingModules.push(dep);
    });
  }

  // 2. Prepare files for AI Analysis
  for (const file of allFiles) {
    const relativePath = path.relative(targetDir, file);
    if (fs.statSync(file).size < 1024 * 50) { // Limit file size
      fileContents[relativePath] = fs.readFileSync(file, 'utf-8');
    }
    // Also scan for TODO/FIXME tags
    if (fileContents[relativePath] && /TODO|FIXME/.test(fileContents[relativePath])) {
        report.potentialBugs.push(relativePath);
    }
  }

  // 3. AI Analysis
  console.log("... Running AI Code Analysis (Mock) ...");
  const aiResults = await mock_call_gemini_analysis(fileContents);
  
  return { ...report, ...aiResults };
}


// ========================
// 5️⃣ Generate Next Steps Roadmap (DYNAMIC)
// ========================
function generateNextSteps(projectReport) {
  const steps = [];

  // 1. Critical Fixes (from AI Analysis)
  if (projectReport.criticalIssues && projectReport.criticalIssues.length > 0) {
      steps.push("🚨 **CRITICAL ISSUES (AI-IDENTIFIED):**");
      projectReport.criticalIssues.forEach(issue => steps.push(`- Fix: ${issue}`));
  }
  
  // 2. Static Issues
  if (projectReport.missingModules.length) {
    steps.push(`- Install missing modules: ${projectReport.missingModules.join(', ')}`);
  }
  if (projectReport.potentialBugs.length) {
    steps.push(`- Review files with TODO/FIXME tags: ${projectReport.potentialBugs.join(', ')}`);
  }

  // 3. Completeness
  if (projectReport.completionStatus === 'Incomplete') {
    steps.push('- Implement main entry point (index.js/app.js) to mark project as runnable.');
  }

  // 4. Quality & Feature Improvement (from AI Analysis)
  if (projectReport.qualityReport && projectReport.qualityReport.hasUnitTests !== 'Yes') {
      steps.push(`- Write unit tests to cover critical modules (Currently: ${projectReport.qualityReport.hasUnitTests})`);
  }
  if (projectReport.qualityReport && projectReport.qualityReport.hasDocumentation !== 'Yes') {
      steps.push(`- Improve documentation for setup and API usage (Currently: ${projectReport.qualityReport.hasDocumentation})`);
  }
  if (projectReport.suggestedFeatures && projectReport.suggestedFeatures.length > 0) {
      steps.push("✨ **FEATURE/REFACTOR SUGGESTIONS (AI-IDENTIFIED):**");
      projectReport.suggestedFeatures.forEach(feature => steps.push(`- Refactor: ${feature}`));
  }

  return steps;
}

// ========================
// 6️⃣ Calculate Health Score (Updated with AI Factors)
// ========================
function calculateHealthScore(repoStats, branchStats, projectReport) {
  let score = 0;

  // Commit activity (Max 30)
  if (repoStats.daysSinceLastCommit < 7) score += 30;
  else if (repoStats.daysSinceLastCommit < 30) score += 20;
  else if (repoStats.daysSinceLastCommit < 90) score += 10;

  // Contributors (Max 20)
  if (repoStats.contributors > 5) score += 20;
  else if (repoStats.contributors >= 3) score += 15;
  else if (repoStats.contributors === 2) score += 10;
  else if (repoStats.contributors === 1) score += 5;

  // Commit volume (Max 10)
  if (repoStats.totalCommits > 100) score += 10;
  else if (repoStats.totalCommits >= 20) score += 5;
  else if (repoStats.totalCommits >= 5) score += 2;

  // Branch health (Max 15 - Min -10)
  score += branchStats.merged > branchStats.unmerged ? 10 : 0;
  score += branchStats.stale === 0 ? 5 : 0;
  score -= Math.min(branchStats.stale * 2, 15);

  // Maintenance activity (Max 15)
  if (repoStats.daysSinceLastCommit < 30) score += 15;
  else if (repoStats.daysSinceLastCommit < 90) score += 10;

  // Project completeness (Max 5, Min -10)
  if (projectReport.completionStatus === 'Incomplete') score -= 10;
  else if (projectReport.completionStatus === 'Partially Complete') score += 5;

  // --- NEW AI-BASED SCORING ---
  // Penalize based on AI-identified critical issues (Max -20 penalty)
  if (projectReport.criticalIssues && projectReport.criticalIssues.length > 0) {
      score -= Math.min(projectReport.criticalIssues.length * 5, 20); 
  }
  // Reward for good quality (Max +10 reward)
  if (projectReport.qualityReport && projectReport.qualityReport.hasUnitTests !== 'No') {
      score += 5;
  }
  if (projectReport.qualityReport && projectReport.qualityReport.hasDocumentation !== 'Missing') {
      score += 5;
  }
  
  // Clamp 0–100
  score = Math.max(0, Math.min(100, score));

  return score;
}


// ========================
// 7️⃣ Master Function
// ========================
async function generateFullProjectReport( targetDir, baseBranch = 'main') {
//   const cloned = await cloneRepo(repoUrl, targetDir);
//   if (!cloned) return;

  console.log("\n📊 Analyzing Repository & Project Health...\n");

  const repoStats = await analyzeRepoHealth(targetDir);
  const branchStats = await analyzeBranchHealth(targetDir, baseBranch);
  const projectReport = await analyzeCodebaseAI(targetDir);
  const roadmap = generateNextSteps(projectReport);
  const healthScore = calculateHealthScore(repoStats, branchStats, projectReport);

  // ======= Output =======
  console.log("====== Project Health Report ======");
  console.log(`⭐ Overall Health Score: ${healthScore}/100`);
  console.log("===================================");

  console.log("\n💾 Repository Health");
  console.log("-------------------");
  console.log(`Total commits   : ${repoStats.totalCommits}`);
  console.log(`Contributors    : ${repoStats.contributors}`);
  console.log(`Last commit     : ${repoStats.lastCommitDate.toLocaleDateString()}`);
  console.log(`Days since      : ${isFinite(repoStats.daysSinceLastCommit) ? repoStats.daysSinceLastCommit : "N/A"}`);
  console.log(`Latest msg      : ${repoStats.latestCommitMsg}`);
  console.log(`Active?         : ${repoStats.active ? "✅ Yes" : "❌ No"}`);

  console.log("\n🌿 Branch Health Report");
  console.log("--------------------------");
  console.log(`Total branches  : ${branchStats.totalBranches}`);
  console.log(`Merged          : ${branchStats.merged}`);
  console.log(`Unmerged        : ${branchStats.unmerged}`);
  console.log(`Active branches : ${branchStats.active}`);
  console.log(`Stale branches  : ${branchStats.stale}`);

  console.log("\n🤖 AI-Powered Project Analysis");
  console.log("-------------------------------");
  console.log(`AI Summary        : ${projectReport.summary}`);
  console.log(`Completion Status : ${projectReport.completionStatus}`);
  console.log(`Code Quality      : Tests: ${projectReport.qualityReport.hasUnitTests}, Docs: ${projectReport.qualityReport.hasDocumentation}`);
  console.log(`Complexity        : ${projectReport.qualityReport.complexityRating}`);
  console.log(`Missing Modules   : ${projectReport.missingModules.join(', ') || "None"}`);
  console.log(`Potential Bugs    : ${projectReport.potentialBugs.join(', ') || "None"}`);

  console.log("\n🚀 AI-Driven Next Steps Roadmap");
  console.log("-------------------------------");
  roadmap.forEach((step, i) => console.log(`${i+1}. ${step}`));
  console.log("===================================");

  return { repoStats, branchStats, projectReport, roadmap, healthScore };
}

// ========================
// 8️⃣ Run
// ========================
// (async () => {
//  const repoUrl = "https://github.com/Vedant-H/codebase.git"; // Replace with your repo URL
//  const targetDir = path.resolve("./temp");
//  const baseBranch = "main"; // or "master"

//  await generateFullProjectReport(repoUrl, targetDir, baseBranch);
// })();

generateFullProjectReport("./temp");