import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Header } from "@/components/admin/layout/Header";
import { BottomNav } from "@/components/admin/layout/BottomNav";
import { AdminClientWrapper } from "@/components/admin/layout/AdminClientWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminClientWrapper>
      <Sidebar />
      <Header />
      <main className="min-h-full bg-admin-main-bg mx-2 px-2 py-6 pt-16 pb-20 sm:mx-4 sm:px-6 lg:mx-6 lg:px-8 lg:pt-[4.5rem] lg:pb-6">
        {children}
      </main>
      <BottomNav />
    </AdminClientWrapper>
  );
}
