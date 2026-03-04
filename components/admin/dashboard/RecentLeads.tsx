import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead } from "@/types";
import { formatRelativeTime, getInitials } from "@/lib/utils";

const statusConfig: Record<Lead["status"], { label: string; color: string }> = {
  new: { label: "New", color: "bg-black text-white" },
  contacted: { label: "Contacted", color: "bg-gray-100 text-gray-600" },
  qualified: { label: "Qualified", color: "bg-green-50 text-green-700" },
  converted: { label: "Converted", color: "bg-green-100 text-green-800" },
  lost: { label: "Lost", color: "bg-red-50 text-red-600" },
};

interface RecentLeadsProps {
  leads: Lead[];
  isLoading?: boolean;
}

export function RecentLeads({ leads, isLoading }: RecentLeadsProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-black">Recent Leads</h3>
        <Link
          href="/admin/leads"
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
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))}
          </div>
        ) : leads.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No leads yet</p>
        ) : (
          <div className="space-y-1">
            {leads.map((lead) => {
              const status = statusConfig[lead.status] ?? statusConfig.new;
              return (
                <div key={lead.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 text-xs font-bold shrink-0">
                    {getInitials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{lead.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {lead.email ?? lead.phone ?? "No contact info"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatRelativeTime(lead.created_at)}
                    </span>
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
