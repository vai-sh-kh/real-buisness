import { MapPin, Bed, Bath, Maximize2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PropertyWithRelations } from "@/types";
import { formatPrice } from "@/lib/utils";

interface PropertyCardProps {
  property: PropertyWithRelations;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-brand-gold/30">
      {/* Image */}
      <div className="relative h-52 bg-muted overflow-hidden">
        {property.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.cover_image_url}
            alt={property.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-4xl">
            🏠
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            className={
              property.type === "sale"
                ? "bg-brand-charcoal text-white border-0"
                : "bg-brand-gold text-white border-0"
            }
          >
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-brand-charcoal leading-snug line-clamp-1 group-hover:text-brand-gold transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {property.city}, {property.state}
          </span>
        </div>

        {property.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {property.short_description}
          </p>
        )}
        {Array.isArray(property.amenities) && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md"
              >
                <Sparkles className="h-2.5 w-2.5" />
                {a}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{property.amenities.length - 4}
              </span>
            )}
          </div>
        )}
        {/* Property specs */}
        {(property.bedrooms || property.bathrooms || property.area_sqft) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
            {property.bedrooms != null && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.area_sqft != null && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
                <span>{property.area_sqft} sqft</span>
              </div>
            )}
          </div>
        )}

        {/* Price + Category */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-brand-charcoal">
              {formatPrice(property.price)}
              <span className="text-sm font-medium text-muted-foreground">
                {property.price_type === "percent" ? " Per cent" : " Total"}
              </span>
            </p>
            {property.price_label && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {property.price_label}
              </p>
            )}
          </div>
          {property.category && (
            <Badge variant="secondary" className="text-xs">
              {property.category.name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
