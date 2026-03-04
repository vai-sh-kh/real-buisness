import { MapPin, Bed, Bath, Maximize2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PropertyWithRelations } from "@/types";
import { formatPrice } from "@/lib/utils";

interface PropertyCardProps {
  property: PropertyWithRelations;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20">
      {/* Image */}
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        {property.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.cover_image_url}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300 text-4xl">
            🏠
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            className={
              property.type === "sale"
                ? "bg-blue-600 text-white border-0"
                : "bg-violet-600 text-white border-0"
            }
          >
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </Badge>
          {property.is_featured && (
            <Badge className="bg-yellow-500 text-white border-0 gap-1">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{property.city}, {property.state}</span>
        </div>

        {/* Property specs */}
        {(property.bedrooms || property.bathrooms || property.area_sqft) && (
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
            {property.bedrooms != null && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-slate-400" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-slate-400" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.area_sqft != null && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4 text-slate-400" />
                <span>{property.area_sqft} sqft</span>
              </div>
            )}
          </div>
        )}

        {/* Price + Category */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-slate-900">
              {formatPrice(property.price)}
            </p>
            {property.price_label && (
              <p className="text-xs text-slate-500">{property.price_label}</p>
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
