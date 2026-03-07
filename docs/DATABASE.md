# Database: Reset remote DB, migrations & seed

Use this workflow to reset the **linked** remote Supabase database, apply the consolidated migration, and run seed data (including admin seeder).

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Project linked to remote: `supabase link --project-ref <your-project-ref>`

## 1. Link remote project (one-time)

```bash
supabase link --project-ref <PROJECT_REF>
```

Get `PROJECT_REF` from the Supabase dashboard URL: `https://supabase.com/dashboard/project/<PROJECT_REF>`.

## 2. Reset remote database

Resets the linked remote database and reapplies all migrations from `supabase/migrations/`:

```bash
supabase db reset --linked
```

**Warning:** This **destroys all data** on the remote DB and re-runs migrations. Use only for staging or when you intend to reseed.

## 3. Run migrations only (no reset)

If you only want to apply new migrations without wiping data:

```bash
supabase db push --linked
```

## 4. Run seed (categories, properties, leads, admin)

After reset (or on a fresh DB), run the seed file. The seed includes:

- **10 categories** (all fields)
- **10 properties** (all fields, `cover_image_url` required)
- **10 leads** (all fields)
- **1 admin_settings row** (admin seeder: `admin@therealbusiness.com`)

**Option A – Reset already runs seed (local):**  
If you use `supabase db reset` **locally** (without `--linked`), the CLI runs `supabase/seed.sql` automatically after migrations.

**Option B – Remote: run seed manually**

Using the Supabase SQL Editor or CLI:

```bash
# With connection string (get from Dashboard → Settings → Database)
psql "<DATABASE_URL>" -f supabase/seed.sql
```

Or in Supabase Dashboard: **SQL Editor** → paste contents of `supabase/seed.sql` → Run.

**Option C – Supabase CLI (if your CLI version runs seed on remote)**

```bash
supabase db reset --linked
# Then run seed via SQL Editor or psql as in Option B
```

(Some CLI versions run seed only for local reset; for remote, use Option B.)

## 5. Summary: full reset + migration + seed

```bash
# 1. Link (once)
supabase link --project-ref <PROJECT_REF>

# 2. Reset remote DB (applies migrations from supabase/migrations/)
supabase db reset --linked

# 3. Run seed (if not auto-run): use Dashboard SQL Editor or
psql "<DATABASE_URL>" -f supabase/seed.sql
```

## Schema: single migration

All schema is in one migration:

- `supabase/migrations/20250312000000_consolidated_schema.sql`

It includes: `categories`, `properties`, `leads`, `amenities`, `admin_settings`, RLS, storage bucket for property images, and seed data for amenities.

## Admin seeder

The seed file inserts one `admin_settings` row with email `admin@therealbusiness.com`. Update this in `supabase/seed.sql` to match your admin login email, or create the user in Supabase Auth and set the same email in `admin_settings`.
