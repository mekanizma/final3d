import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 pt-16 lg:pt-10">{children}</div>
      </div>
    </div>
  );
}
