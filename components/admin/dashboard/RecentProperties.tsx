import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

const statusConfig: Record<Property["status"], { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-50 text-green-700" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-500" },
  sold: { label: "Sold", color: "bg-black text-white" },
  rented: { label: "Rented", color: "bg-blue-50 text-blue-600" },
};

interface RecentPropertiesProps {
  properties: Property[];
  isLoading?: boolean;
}

export function RecentProperties({ properties, isLoading }: RecentPropertiesProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-black">Recent Properties</h3>
        <Link
          href="/admin/properties"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2">
                <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right space-y-1.5">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No properties yet</p>
        ) : (
          <div className="space-y-1">
            {properties.map((property) => {
              const status = statusConfig[property.status] ?? statusConfig.draft;
              return (
                <div key={property.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="h-11 w-11 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                    {property.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={property.cover_image_url}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs font-bold">
                        {property.type === "sale" ? "S" : "R"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{property.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {property.city}, {property.state}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-black">{formatPrice(property.price)}</p>
                    <div className="flex flex-col items-end gap-0.5 mt-0.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatRelativeTime(property.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
