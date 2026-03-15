import {
  DashboardHeaderSkeleton,
  DashboardSkeleton,
} from "@/components/admin/skeletons/AdminPageSkeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <DashboardHeaderSkeleton />
      <div className="space-y-6 sm:space-y-8">
        <DashboardSkeleton />
      </div>
    </div>
  );
}
