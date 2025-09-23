import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import Navbar from "@/components/Admin-Navbare/Navbar";
import MobileBottomNav from "@/components/Admin-Navbare/MobileBottomNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16 pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </RoleProtectedRoute>
  );
}
