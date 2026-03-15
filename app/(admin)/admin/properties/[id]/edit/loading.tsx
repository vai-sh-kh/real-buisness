import {
  PageHeaderSkeleton,
  PropertyEditSkeleton,
} from "@/components/admin/skeletons/AdminPageSkeleton";

export default function PropertyEditLoading() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <PageHeaderSkeleton showBackLink />
      <div className="space-y-6 sm:space-y-8">
        <PropertyEditSkeleton />
      </div>
    </div>
  );
}
