import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Parse arguments (version tag)
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Usage: node scripts/github_release.mjs <version_tag>");
    console.error("Example: node scripts/github_release.mjs v0.1.2");
    process.exit(1);
}

const versionTag = args[0];
const src = process.cwd();
const releaseDir = `F:\\AntiGravity\\Releases\\ysdms-nextgen_releases\\${versionTag}`;
const syncDir = `F:\\AntiGravity\\syncs\\ysdms-nextgen_syncs\\${versionTag}`;
const tempRepo = `F:\\AntiGravity\\syncs\\ysdms-nextgen_syncs\\temp_repo`;

function filterFunc(source, destination) {
    const basename = path.basename(source);
    if (['node_modules', '.git', '.next', 'out', 'source_data', '.vscode', '__pycache__'].includes(basename)) return false;
    if (basename.endsWith('.env.local')) return false;
    if (basename.endsWith('.log')) return false;
    return true;
}

try {
    console.log(`[1] Copying clean source to Releases: ${releaseDir}`);
    fs.mkdirSync(releaseDir, { recursive: true });
    fs.cpSync(src, releaseDir, { recursive: true, filter: filterFunc });

    console.log(`[2] Copying clean source to Syncs: ${syncDir}`);
    fs.mkdirSync(syncDir, { recursive: true });
    fs.cpSync(src, syncDir, { recursive: true, filter: filterFunc });

    console.log(`[3] Preparing Git Repository...`);
    if (fs.existsSync(tempRepo)) fs.rmSync(tempRepo, { recursive: true, force: true });
    
    // Clone history
    execSync('git clone https://github.com/toanysd/ysdms-next ' + tempRepo, { stdio: 'inherit' });
    
    // Move .git
    fs.renameSync(path.join(tempRepo, '.git'), path.join(syncDir, '.git'));
    fs.rmSync(tempRepo, { recursive: true, force: true });
    
    console.log(`[4] Committing and Pushing to GitHub...`);
    execSync('git add .', { cwd: syncDir, stdio: 'inherit' });
    
    try {
        execSync(`git commit -m "chore: release ${versionTag} - Planning UI Fixes & Stabilizations"`, { cwd: syncDir, stdio: 'inherit' });
    } catch (e) {
        console.log("No changes to commit.");
    }
    
    try {
        execSync(`git tag ${versionTag}`, { cwd: syncDir, stdio: 'inherit' });
    } catch (e) {
        console.log(`Tag ${versionTag} may already exist.`);
    }
    
    execSync('git push origin main', { cwd: syncDir, stdio: 'inherit' });
    execSync('git push --tags', { cwd: syncDir, stdio: 'inherit' });

    console.log(`✅ Successfully released ${versionTag} to GitHub!`);
} catch (e) {
    console.error('❌ Error during release:', e.message);
    process.exit(1);
}
