import {
  PageHeaderSkeleton,
  TablePageSkeleton,
} from "@/components/admin/skeletons/AdminPageSkeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6 bg-admin-main-bg">
      <TablePageSkeleton rows={6} />
    </div>
  );
}
