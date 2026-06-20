#!/usr/bin/env node
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const cliEntry = resolve(root, 'packages/cli/dist/index.js')
const cliNodeModules = resolve(root, 'packages/cli/node_modules')

process.stderr.write(`[coursesmith] root=${root}\n`)
process.stderr.write(`[coursesmith] cliEntry=${cliEntry}\n`)

const depsOk = existsSync(resolve(cliNodeModules, 'commander'))
process.stderr.write(`[coursesmith] depsOk=${depsOk}\n`)

if (!depsOk) {
  process.stderr.write('[coursesmith] Installing workspace dependencies...\n')
  execSync('npm install --no-audit --no-fund', { cwd: root, stdio: 'inherit' })
}

const built = existsSync(cliEntry)
process.stderr.write(`[coursesmith] built=${built}\n`)

if (!built) {
  process.stderr.write('[coursesmith] Building packages...\n')
  execSync('npm run build --workspaces', { cwd: root, stdio: 'inherit' })
  process.stderr.write('[coursesmith] Build complete\n')
}

process.stderr.write('[coursesmith] Starting CLI...\n')

import(pathToFileURL(cliEntry).href)
