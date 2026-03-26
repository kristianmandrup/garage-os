// Load env vars from .env.local for testing
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const envPath = join(__dirname, '../../.env.local');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}
