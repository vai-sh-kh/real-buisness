// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Property ─────────────────────────────────────────────────────────────────
export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  type: "sale" | "rent";
  status: "active" | "sold" | "rented" | "draft";
  category_id: string | null;
  price: number;
  price_label: string | null;
  area_sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floors: number | null;
  facing: string | null;
  age_years: number | null;
  parking: boolean;
  furnished: "furnished" | "semi-furnished" | "unfurnished" | null;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  map_embed_url: string | null;
  cover_image_url: string | null;
  amenities: string[] | null;
  highlights: string[] | null;
  plot_number: string | null;
  plot_dimensions: string | null;
  is_featured: boolean;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithRelations extends Property {
  category?: Category | null;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────
export type LeadSource = "website" | "meta_ads" | "google_ads" | "manual";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  property_id: string | null;
  property_title: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadWithProperty extends Lead {
  property?: Pick<Property, "id" | "title" | "slug"> | null;
}

// ─── Reports ─────────────────────────────────────────────────────────────────
export interface PropertyStats {
  total: number;
  active: number;
  draft: number;
  sold: number;
  rented: number;
  featured: number;
  for_sale: number;
  for_rent: number;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  by_source: {
    source: LeadSource;
    count: number;
  }[];
}

export interface CategoryDistribution {
  id: string;
  name: string;
  property_count: number;
}

export interface RecentActivity {
  type: "property" | "lead";
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
}

export interface ReportsData {
  property_stats: PropertyStats;
  lead_stats: LeadStats;
  category_distribution: CategoryDistribution[];
  recent_activity: RecentActivity[];
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  total_properties: number;
  total_leads: number;
  active_properties: number;
  new_leads: number;
  recent_leads: Lead[];
  recent_properties: Property[];
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ─── Filters ─────────────────────────────────────────────────────────────────
export interface PropertyFilters extends PaginationParams, SortParams {
  search?: string;
  status?: Property["status"] | "all";
  type?: Property["type"] | "all";
  category_id?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  is_featured?: boolean;
}

export interface LeadFilters extends PaginationParams, SortParams {
  search?: string;
  status?: LeadStatus | "all";
  source?: LeadSource | "all";
}

export interface CategoryFilters extends PaginationParams, SortParams {
  search?: string;
  is_active?: boolean;
}

// ─── Session ─────────────────────────────────────────────────────────────────
export interface AdminSession {
  isAdmin: boolean;
  email: string;
}
