#!/usr/bin/env node
/**
 * Seed script: 12 rows each in categories, amenities, properties, leads.
 * Full fields: images (Unsplash), gallery_images, latitude, longitude, map_embed_url (Google Maps),
 * meta_*, highlights, amenities, furnished, etc.
 *
 * Run: npm run seed   (or npx tsx scripts/seed.ts)
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * Ensure migrations are applied (e.g. supabase db reset) so is_featured exists on properties.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadEnv(): Record<string, string> {
  const envPath = join(ROOT, ".env.local");
  const env: Record<string, string> = {};
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        env[key] = value;
      }
    }
  }
  return env;
}

// Google Maps embed URL from lat/lng (no API key)
function mapEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
}

const ENV = { ...process.env, ...loadEnv() };
const SUPABASE_URL = ENV.NEXT_PUBLIC_SUPABASE_URL as string;
const SERVICE_ROLE_KEY = ENV.SUPABASE_SERVICE_ROLE_KEY as string;

if (!SUPABASE_URL?.trim() || !SERVICE_ROLE_KEY?.trim()) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CATEGORIES = [
  { name: "Villa", slug: "villa", description: "Luxury villas and standalone homes", icon: "home" },
  { name: "Apartment", slug: "apartment", description: "Apartments and flats", icon: "building" },
  { name: "Penthouse", slug: "penthouse", description: "Premium penthouses", icon: "layers" },
  { name: "Studio", slug: "studio", description: "Studio and 1BHK units", icon: "box" },
  { name: "Bungalow", slug: "bungalow", description: "Single-storey bungalows", icon: "home" },
  { name: "Duplex", slug: "duplex", description: "Duplex and triplex units", icon: "layers" },
  { name: "Farmhouse", slug: "farmhouse", description: "Farmhouses and country homes", icon: "tree-pine" },
  { name: "Plot", slug: "plot", description: "Residential and commercial plots", icon: "map" },
  { name: "Commercial", slug: "commercial", description: "Commercial spaces", icon: "briefcase" },
  { name: "Warehouse", slug: "warehouse", description: "Warehouses and godowns", icon: "warehouse" },
  { name: "Row House", slug: "row-house", description: "Row houses and townhomes", icon: "home" },
  { name: "Resort", slug: "resort", description: "Resort and holiday homes", icon: "palmtree" },
];

const AMENITIES = [
  { name: "Swimming Pool", slug: "swimming-pool", icon: "pool", sort_order: 1 },
  { name: "Gym", slug: "gym", icon: "dumbbell", sort_order: 2 },
  { name: "Parking", slug: "parking", icon: "car", sort_order: 3 },
  { name: "Security", slug: "security", icon: "shield", sort_order: 4 },
  { name: "Garden", slug: "garden", icon: "flower", sort_order: 5 },
  { name: "Power Backup", slug: "power-backup", icon: "zap", sort_order: 6 },
  { name: "Lift", slug: "lift", icon: "arrow-up-down", sort_order: 7 },
  { name: "Clubhouse", slug: "clubhouse", icon: "users", sort_order: 8 },
  { name: "Play Area", slug: "play-area", icon: "gamepad", sort_order: 9 },
  { name: "Concierge", slug: "concierge", icon: "concierge-bell", sort_order: 10 },
  { name: "WiFi", slug: "wifi", icon: "wifi", sort_order: 11 },
  { name: "AC", slug: "ac", icon: "snowflake", sort_order: 12 },
];

// 12 properties with full fields: lat/lng, map_embed_url, cover_image_url, gallery_images, etc.
function buildProperties(categoryIds: string[]) {
  const cities: { city: string; state: string; lat: number; lng: number; zip: string }[] = [
    { city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777, zip: "400001" },
    { city: "Mumbai", state: "Maharashtra", lat: 19.1136, lng: 72.8697, zip: "400049" },
    { city: "Mumbai", state: "Maharashtra", lat: 18.9388, lng: 72.8354, zip: "400005" },
    { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, zip: "411001" },
    { city: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946, zip: "560001" },
    { city: "Delhi", state: "Delhi", lat: 28.7041, lng: 77.1025, zip: "110001" },
    { city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, zip: "500001" },
    { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, zip: "600001" },
    { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, zip: "700001" },
    { city: "Goa", state: "Goa", lat: 15.2993, lng: 74.124, zip: "403001" },
    { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, zip: "302001" },
    { city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, zip: "682001" },
  ];

  const images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
  ];

  const titles = [
    "Skyline Heights Penthouse",
    "Azure Beach Villa",
    "Emerald Estate",
    "Sea-View Serenity",
    "Lakeview Luxury Residences",
    "Victorian Elegance Suite",
    "Garden Duplex",
    "Sunset Studio",
    "Green Valley Farmhouse",
    "Downtown Commercial Hub",
    "Royal Palm Bungalow",
    "Ocean Breeze Apartment",
  ];

  return titles.map((title, i) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const loc = cities[i];
    const categoryId = categoryIds[i % categoryIds.length];
    const isRent = i % 4 === 2 || i % 4 === 3;
    const price = isRent ? (i + 1) * 45000 : (i + 1) * 12000000;
    const area = 1200 + i * 280;
    const beds = i % 3 === 0 ? 1 : i % 3 === 1 ? 3 : 4;
    const baths = Math.max(1, beds - 1);
    const gallery = [images[i], images[(i + 1) % 12], images[(i + 2) % 12]];
    const mapUrl = mapEmbedUrl(loc.lat, loc.lng);
    return {
      title,
      slug: `${slug}-${i}`,
      description: `Stunning property in ${loc.city}. Full description with amenities and location benefits.`,
      short_description: `Premium ${isRent ? "rental" : "sale"} in ${loc.city}.`,
      type: isRent ? "rent" : "sale",
      status: "active",
      category_id: categoryId,
      price,
      price_label: isRent ? "Per month" : null,
      area_sqft: area,
      bedrooms: beds,
      bathrooms: baths,
      floors: i % 2 === 0 ? 1 : 2,
      facing: ["North", "South", "East", "West"][i % 4],
      age_years: 2 + (i % 10),
      furnished: (["furnished", "semi-furnished", "unfurnished"] as const)[i % 3],
      address: `${10 + i} Prime Street, ${loc.city}`,
      city: loc.city,
      state: loc.state,
      zip_code: loc.zip,
      country: "India",
      latitude: loc.lat,
      longitude: loc.lng,
      map_embed_url: mapUrl,
      cover_image_url: images[i],
      gallery_images: gallery,
      amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup"].slice(0, 3 + (i % 3)),
      highlights: ["Prime location", "Premium finish", "24/7 security", "Easy commute"].slice(0, 2 + (i % 2)),
      plot_number: i % 3 === 0 ? `PLOT-${1000 + i}` : null,
      plot_dimensions: i % 4 === 0 ? "50x80 ft" : null,
      views: 100 * (i + 1),
      meta_title: `${title} | The Real Business`,
      meta_description: `Buy or rent ${title} in ${loc.city}.`,
      meta_keywords: `${loc.city}, ${loc.state}, property, real estate`,
      og_image_url: images[i],
      is_featured: i < 4,
    };
  });
}

function buildLeads(propertyIds: string[], propertyTitles: string[]) {
  const names = [
    "Rahul Sharma",
    "Priya Mehta",
    "Amit Patel",
    "Sneha Reddy",
    "Vikram Singh",
    "Anita Desai",
    "Rajesh Kumar",
    "Kavita Nair",
    "Sanjay Gupta",
    "Deepa Iyer",
    "Arun Menon",
    "Meera Krishnan",
  ];
  const emails = names.map((n) => n.toLowerCase().replace(/\s+/, ".") + "@example.com");
  const sources = ["website", "meta_ads", "google_ads", "manual"] as const;
  const statuses = ["new", "contacted", "qualified", "converted"] as const;
  return names.map((name, i) => ({
    name,
    email: emails[i],
    phone: i % 3 !== 1 ? `9876543${200 + i}` : null,
    message: `Interested in ${propertyTitles[i % propertyTitles.length]}.`,
    source: sources[i % 4],
    status: statuses[i % 4],
    property_id: propertyIds[i % propertyIds.length],
    property_title: propertyTitles[i % propertyTitles.length],
    notes: i % 2 === 0 ? "Follow up scheduled." : null,
  }));
}

async function main() {
  console.log("\n🌱 Seeding database: 12 rows each in categories, amenities, properties, leads...\n");

  // 1) Categories (upsert by slug, then get 12 ids in order)
  const slugs = CATEGORIES.map((c) => c.slug);
  const { error: catErr } = await supabase
    .from("categories")
    .upsert(CATEGORIES.map((c) => ({ ...c, is_active: true })), { onConflict: "slug", ignoreDuplicates: false });
  if (catErr) {
    console.error("Categories error:", catErr.message);
    process.exit(1);
  }
  const { data: categoryRows } = await supabase
    .from("categories")
    .select("id, slug")
    .in("slug", slugs);
  const bySlug = new Map((categoryRows ?? []).map((r: { id: string; slug: string }) => [r.slug, r.id]));
  const categoryIds = slugs.map((s) => bySlug.get(s)).filter(Boolean) as string[];
  if (categoryIds.length < 12) {
    console.error("Expected 12 categories; got", categoryIds.length);
    process.exit(1);
  }
  console.log("✅ Categories: 12");

  // 2) Amenities (upsert by slug)
  const amenityRows = AMENITIES.map((a) => ({ ...a, is_active: true }));
  const { error: amErr } = await supabase.from("amenities").upsert(amenityRows, { onConflict: "slug", ignoreDuplicates: false });
  if (amErr) {
    console.error("Amenities error:", amErr.message);
    process.exit(1);
  }
  console.log("✅ Amenities: 12");

  // 3) Properties (need category_id; upsert by slug)
  const properties = buildProperties(categoryIds);
  const { data: props, error: propErr } = await supabase
    .from("properties")
    .upsert(properties, { onConflict: "slug", ignoreDuplicates: false })
    .select("id, title");
  if (propErr) {
    console.error("Properties error:", propErr.message);
    process.exit(1);
  }
  const propList = (props ?? []) as { id: string; title: string }[];
  console.log("✅ Properties:", propList.length);

  // 4) Leads (insert; optional property_id)
  const leadRows = buildLeads(
    propList.map((p) => p.id),
    propList.map((p) => p.title)
  );
  const { error: leadErr } = await supabase.from("leads").insert(leadRows);
  if (leadErr) {
    console.error("Leads error:", leadErr.message);
    process.exit(1);
  }
  console.log("✅ Leads: 12");

  console.log("\n✨ Seed complete.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
