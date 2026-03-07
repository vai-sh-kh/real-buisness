import {
  PageHeaderSkeleton,
  DashboardSkeleton,
} from "@/components/admin/skeletons/AdminPageSkeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <DashboardSkeleton />
    </div>
  );
}
