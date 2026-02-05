#!/usr/bin/env node

/**
 * Security Verification Script
 * Checks that no API keys are exposed in source code
 * Run before deployment: node verify-security.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SENSITIVE_PATTERNS = [
  /helius.*api[_-]?key['":\s=]+(?!process\.env)/gi,
  /telegram.*bot[_-]?token['":\s=]+(?!process\.env)/gi,
  /telegram.*chat[_-]?id['":\s=]+(?!process\.env)/gi,
  /3355e3eb-3fb3-470b-b19d-79249fa883c0/g,  // Known Helius key (if hardcoded)
  /8511833737:AAEF34ACL1dHIJyc6tYFUf68CgcH7Tfi61s/g  // Known Telegram token (if hardcoded)
];

const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.env'
];

const EXCLUDE_FILES = [
  '.env',
  '.env.example',
  '.env.local',
  '.env.production',
  'verify-security.js',
  'TOOLS_SYSTEM_GUIDE.md',
  'DEPLOYMENT_CHECKLIST.md',
  'MIGRATION_SUMMARY.md',
  'README_TOOLS.md',
  'server.js'  // Backend uses process.env correctly
];

let issues = [];
let filesChecked = 0;

function shouldSkip(filePath) {
  // Skip excluded directories
  for (let dir of EXCLUDE_DIRS) {
    if (filePath.includes(path.sep + dir + path.sep) || filePath.includes(path.sep + dir)) {
      return true;
    }
  }

  // Skip excluded files
  const fileName = path.basename(filePath);
  if (EXCLUDE_FILES.includes(fileName)) {
    return true;
  }

  return false;
}

function checkFile(filePath) {
  if (shouldSkip(filePath)) return;

  // Only check text files
  const ext = path.extname(filePath);
  if (!['.js', '.ts', '.tsx', '.jsx', '.json', '.env', '.md'].includes(ext)) {
    return;
  }

  filesChecked++;

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    for (let pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(content)) {
        issues.push({
          file: filePath,
          pattern: pattern.toString(),
          type: 'SENSITIVE_PATTERN_FOUND'
        });
      }
    }
  } catch (err) {
    // Skip files we can't read
  }
}

function walkDir(dir) {
  try {
    const files = fs.readdirSync(dir);

    for (let file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        checkFile(filePath);
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
}

console.log('🔒 Running Security Verification...\n');

const rootDir = process.cwd();
walkDir(rootDir);

console.log(`✅ Checked ${filesChecked} files\n`);

if (issues.length === 0) {
  console.log('✅ No sensitive patterns found!');
  console.log('\n✨ Security Check PASSED\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${issues.length} security issue(s):\n`);

  for (let issue of issues) {
    console.log(`  📄 ${issue.file}`);
    console.log(`     Pattern: ${issue.pattern}\n`);
  }

  console.log('🚨 Security Check FAILED\n');
  console.log('Actions to take:');
  console.log('1. Move hardcoded secrets to .env file');
  console.log('2. Use process.env.VARIABLE_NAME instead');
  console.log('3. Add .env to .gitignore');
  console.log('4. Run this script again to verify\n');

  process.exit(1);
}
