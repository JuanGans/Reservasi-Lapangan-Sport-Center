import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const projectRoot = process.cwd();

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !["node_modules", ".next", ".git", "public", "out"].includes(file)
    ) {
      getAllFiles(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function cleanupFiles(files: string[]) {
  for (const file of files) {
    try {
      console.log(`✨ Cleaning ${file}`);
      execSync(`npx eslint --fix "${file}"`, { stdio: "inherit" });
      execSync(`npx prettier --write "${file}"`, { stdio: "inherit" });
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error);
    }
  }
}

function runCleanup() {
  console.log("🔍 Searching for source files...");
  const files = getAllFiles(projectRoot);
  console.log(`📦 Found ${files.length} source files.`);
  cleanupFiles(files);
  console.log("✅ Cleanup finished.");
}

runCleanup();
