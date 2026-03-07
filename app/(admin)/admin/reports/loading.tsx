import {
  PageHeaderSkeleton,
  ReportsSkeleton,
} from "@/components/admin/skeletons/AdminPageSkeleton";

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <ReportsSkeleton />
    </div>
  );
}
