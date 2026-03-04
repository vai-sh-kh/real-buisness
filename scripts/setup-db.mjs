#!/usr/bin/env node
/**
 * Database Setup Script
 *
 * This script creates the database tables in your Supabase project.
 * Run: node scripts/setup-db.mjs
 *
 * It reads from .env.local and uses the Supabase Management API
 * (requires SUPABASE_ACCESS_TOKEN env var) OR directly via pg if DB_URL is set.
 *
 * Alternative: Paste supabase/migrations/20250303000000_initial.sql
 * directly in your Supabase Dashboard → SQL Editor.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Load .env.local
function loadEnv() {
  const envPath = join(ROOT, '.env.local');
  const env = {};
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length) {
        env[key.trim()] = rest.join('=').trim();
      }
    }
  } catch {
    console.error('Could not read .env.local');
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN; // Personal access token
const PROJECT_REF = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

// Read SQL file
const SQL = readFileSync(join(ROOT, 'supabase/migrations/20250303000000_initial.sql'), 'utf-8');

async function tryManagementAPI() {
  if (!ACCESS_TOKEN) return false;
  if (!PROJECT_REF) return false;

  console.log('Attempting via Supabase Management API...');

  // Split SQL into individual statements
  const statements = SQL.split(';').map(s => s.trim()).filter(s => s.length > 0);

  for (const statement of statements) {
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: statement }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      if (err.message && !err.message.includes('already exists')) {
        console.error('SQL error:', err.message);
      }
    }
  }
  return true;
}

async function tryDirectPg() {
  const DB_URL = process.env.DATABASE_URL || env.DATABASE_URL;
  if (!DB_URL) return false;

  try {
    const { default: pg } = await import('pg');
    const client = new pg.Client({ connectionString: DB_URL });
    await client.connect();

    console.log('Connected to PostgreSQL directly...');
    await client.query(SQL);
    await client.end();
    return true;
  } catch (err) {
    console.error('Direct PG error:', err.message);
    return false;
  }
}

async function main() {
  console.log('\n🗄️  TheRealBusiness — Database Setup\n');
  console.log('Project:', PROJECT_REF || 'Unknown');
  console.log('Supabase URL:', SUPABASE_URL || 'Not set');
  console.log('');

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  // Try Management API first
  if (await tryManagementAPI()) {
    console.log('✅ Database setup complete via Management API!');
    return;
  }

  // Try direct pg connection
  if (await tryDirectPg()) {
    console.log('✅ Database setup complete via direct PostgreSQL!');
    return;
  }

  // Fallback: Show instructions
  console.log('⚠️  Could not connect to database automatically.\n');
  console.log('Please run the migration manually:');
  console.log('');
  console.log('1. Go to your Supabase Dashboard: https://app.supabase.com');
  console.log('2. Select project:', PROJECT_REF);
  console.log('3. Go to SQL Editor');
  console.log('4. Paste and run: supabase/migrations/20250303000000_initial.sql');
  console.log('');
  console.log('OR provide a personal access token:');
  console.log('  SUPABASE_ACCESS_TOKEN=<your-token> node scripts/setup-db.mjs');
  console.log('  Get your token at: https://app.supabase.com/account/tokens');
  console.log('');
  console.log('OR provide DATABASE_URL:');
  console.log('  DATABASE_URL=postgresql://... node scripts/setup-db.mjs');
}

main().catch(console.error);
