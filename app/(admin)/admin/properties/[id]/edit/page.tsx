import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/queries/properties";
import { getAllActiveCategories } from "@/lib/queries/categories";
import { PropertyFormSimple } from "@/components/admin/PropertyFormSimple";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id).catch(() => null);
  if (!property) notFound();

  const categories = await getAllActiveCategories();
  const initialData = {
    title: property.title,
    slug: property.slug,
    description: property.description ?? undefined,
    short_description: property.short_description ?? undefined,
    type: property.type,
    status: property.status,
    category_id: property.category_id ?? undefined,
    price: Number(property.price),
    price_label: property.price_label ?? undefined,
    area_sqft:
      property.area_sqft != null ? Number(property.area_sqft) : undefined,
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined,
    address: property.address,
    city: property.city,
    state: property.state,
    zip_code: property.zip_code ?? undefined,
    country: property.country ?? "India",
    is_featured: property.is_featured ?? false,
    furnished: property.furnished ?? undefined,
    parking: property.parking ?? false,
    amenities: property.amenities ?? undefined,
    highlights: property.highlights ?? undefined,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Property</h1>
      <PropertyFormSimple
        categories={categories}
        initialData={initialData}
        propertyId={id}
      />
    </div>
  );
}
