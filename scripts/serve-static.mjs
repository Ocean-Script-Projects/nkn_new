/**
 * Static export (`output: 'export'`) → folder `out/`. `next start` is not supported.
 * DigitalOcean App Platform (and similar) set PORT for the HTTP listener / health checks.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(fileURLToPath(new URL('.', import.meta.url)), '..');
const port = process.env.PORT || '8080';
const serveMain = path.join(root, 'node_modules', 'serve', 'build', 'main.js');

const child = spawn(
  process.execPath,
  [serveMain, 'out', '-l', `tcp://0.0.0.0:${port}`],
  { stdio: 'inherit', cwd: root, env: process.env }
);

child.on('exit', (code) => process.exit(code ?? 0));
