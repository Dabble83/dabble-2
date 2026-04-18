#!/usr/bin/env node
/**
 * copy-guard.js — prevent accidental copy of sensitive env vars into committed files.
 *
 * Run as a pre-commit hook or manually: node scripts/copy-guard.js
 *
 * Scans staged .ts/.tsx/.js/.jsx files for patterns that look like exposed secrets.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const FORBIDDEN_PATTERNS = [
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*["'][^"']{20,}/,
  /sk-[a-zA-Z0-9]{32,}/,         // OpenAI keys
  /eyJ[a-zA-Z0-9_-]{20,}\./,     // JWT secrets embedded in source
  /postgres:\/\/[^"'\s]{10,}/,    // Database URLs
]

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    return output.split('\n').filter(Boolean).filter(f =>
      /\.(ts|tsx|js|jsx)$/.test(f) && !f.includes('node_modules')
    )
  } catch {
    return []
  }
}

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, 'utf8')
  const violations = []
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      violations.push({ file: filePath, pattern: pattern.toString() })
    }
  }
  return violations
}

const staged = getStagedFiles()
const allViolations = staged.flatMap(checkFile)

if (allViolations.length > 0) {
  console.error('\n❌ copy-guard: potential secrets detected in staged files:\n')
  for (const v of allViolations) {
    console.error(`  ${v.file}\n  matched: ${v.pattern}\n`)
  }
  console.error('Remove the secret before committing.\n')
  process.exit(1)
} else {
  console.log('✓ copy-guard: no secrets detected in staged files.')
  process.exit(0)
}
