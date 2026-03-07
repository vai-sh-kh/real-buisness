import {
  PageHeaderSkeleton,
  SettingsSkeleton,
} from "@/components/admin/skeletons/AdminPageSkeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <SettingsSkeleton />
    </div>
  );
}
