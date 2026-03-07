import { TablePageSkeleton } from "@/components/admin/skeletons/AdminPageSkeleton";

export default function LeadsLoading() {
  return (
    <div className="space-y-6">
      <TablePageSkeleton rows={8} />
    </div>
  );
}
