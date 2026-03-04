import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Header } from "@/components/admin/layout/Header";
import { AdminClientWrapper } from "@/components/admin/layout/AdminClientWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminClientWrapper>
  );
}
