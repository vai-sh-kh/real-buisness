import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Header } from "@/components/admin/layout/Header";
import { BottomNav } from "@/components/admin/layout/BottomNav";
import { MobileNavDrawer } from "@/components/admin/layout/MobileNavDrawer";
import { AdminClientWrapper } from "@/components/admin/layout/AdminClientWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <AdminClientWrapper>
      <Sidebar />
      <Header />
      <main className="min-h-full bg-admin-main-bg pt-16 pb-[max(5rem,env(safe-area-inset-bottom))] lg:pt-[4.5rem] lg:pb-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
        {children}
      </main>
      <BottomNav />
      <MobileNavDrawer />
    </AdminClientWrapper>
  );
}
