#!/usr/bin/env node
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const cliEntry = resolve(root, 'packages/cli/dist/index.js')
const rootModules = resolve(root, 'node_modules')

if (!existsSync(resolve(rootModules, 'typescript'))) {
  execSync('npm install --no-audit --no-fund', { cwd: root, stdio: 'inherit' })
}

if (!existsSync(cliEntry)) {
  execSync('npm run build --workspaces', { cwd: root, stdio: 'inherit' })
}

import(pathToFileURL(cliEntry).href)
