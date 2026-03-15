import {
  PageHeaderSkeleton,
  ReportsSkeleton,
} from "@/components/admin/skeletons/AdminPageSkeleton";

export default function ReportsLoading() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <PageHeaderSkeleton />
      <div className="space-y-6 sm:space-y-8">
        <ReportsSkeleton />
      </div>
    </div>
  );
}
