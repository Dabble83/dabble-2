const fs = require('fs')
const path = require('path')

const clientPath = path.join(process.cwd(), 'node_modules/.prisma/client')
const defaultJsPath = path.join(clientPath, 'default.js')

// Ensure .prisma symlink exists
const prismaSymlink = path.join(process.cwd(), '.prisma')
if (!fs.existsSync(prismaSymlink)) {
  try {
    fs.symlinkSync('node_modules/.prisma', prismaSymlink, 'dir')
  } catch (e) {
    // Symlink might already exist or permission issue
  }
}

// Create default.js file that properly exports the Prisma client
// Prisma generates client.ts, but we need to require it correctly
if (fs.existsSync(clientPath)) {
  // Check if client.ts exists (TypeScript source)
  const clientTsPath = path.join(clientPath, 'client.ts')
  const clientJsPath = path.join(clientPath, 'index.js')
  
  // Prisma Client should be imported from the index, not directly
  // The default.js should re-export from @prisma/client
  const defaultJsContent = `module.exports = require('@prisma/client')\n`
  fs.writeFileSync(defaultJsPath, defaultJsContent)
}

