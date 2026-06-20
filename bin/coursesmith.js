#!/usr/bin/env node
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const cliEntry = resolve(root, 'packages/cli/dist/index.js')

if (!existsSync(cliEntry)) {
  process.stderr.write('Building packages...\n')
  execSync('npm run build --workspaces', { cwd: root, stdio: 'inherit' })
}

import(pathToFileURL(cliEntry).href)
