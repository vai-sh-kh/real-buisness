#!/usr/bin/env node
/**
 * Creates Supabase tables via the Management API.
 * Usage: SUPABASE_ACCESS_TOKEN=your_pat node scripts/create-tables.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Load .env.local
const envContent = readFileSync(join(ROOT, '.env.local'), 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
);

const PROJECT_REF = env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.log('\n❌ SUPABASE_ACCESS_TOKEN is required.\n');
  console.log('Get your Personal Access Token from:');
  console.log('  https://app.supabase.com/account/tokens\n');
  console.log('Then run:');
  console.log(`  SUPABASE_ACCESS_TOKEN=<your-token> node scripts/create-tables.mjs\n`);
  console.log('OR run the SQL manually in the Supabase Dashboard SQL Editor:');
  console.log(`  https://app.supabase.com/project/${PROJECT_REF}/sql/new\n`);
  process.exit(0);
}

const SQL_FILE = readFileSync(join(ROOT, 'supabase/migrations/20250303000000_initial.sql'), 'utf-8');

async function executeSQL(query) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    const msg = data.message || data.error || JSON.stringify(data);
    if (msg.includes('already exists') || msg.includes('duplicate')) {
      return { skipped: true, message: msg };
    }
    throw new Error(msg);
  }
  return data;
}

async function main() {
  console.log(`\n🗄️  Setting up database for project: ${PROJECT_REF}\n`);

  try {
    await executeSQL(SQL_FILE);
    console.log('✅ All tables created and sample data seeded!');
  } catch (err) {
    // Try statement by statement
    console.log('Running statement by statement...');
    const statements = SQL_FILE
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 5);

    let ok = 0, skip = 0, fail = 0;
    for (const stmt of statements) {
      try {
        const result = await executeSQL(stmt);
        if (result.skipped) {
          skip++;
        } else {
          ok++;
        }
      } catch (e) {
        const msg = e.message || '';
        if (msg.includes('already exists') || msg.includes('duplicate')) {
          skip++;
        } else {
          console.warn(`  ⚠️  ${msg.slice(0, 80)}`);
          fail++;
        }
      }
    }

    console.log(`\n✅ Done: ${ok} executed, ${skip} skipped, ${fail} failed`);
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
