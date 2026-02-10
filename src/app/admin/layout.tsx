"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Skip auth check on login page
            if (pathname === "/admin") {
                setIsChecking(false);
                return;
            }

            // Check localStorage admin auth
            const isAdminAuthenticated = localStorage.getItem("adminAuth");

            if (!isAdminAuthenticated) {
                console.log("[Admin Layout] No admin auth found, redirecting to /admin");
                router.push("/admin");
                return;
            }

            // Also check if user is a regular authenticated user trying to access admin
            const supabase = createSupabaseBrowserClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // User is authenticated with Supabase - check if they're an admin
                const { data: userData } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (userData?.role !== "admin") {
                    // Regular user trying to access admin - redirect to user dashboard
                    console.log("[Admin Layout] Regular user trying to access admin, redirecting to /dashboard");
                    router.push("/dashboard");
                    return;
                }
            }

            setIsChecking(false);
        };

        checkAuth();
    }, [pathname, router]);

    // Don't show sidebar on login page
    if (pathname === "/admin") {
        return <>{children}</>;
    }

    // Show loading state while checking auth
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FAF7EE]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31372B] mx-auto mb-4"></div>
                    <p className="text-[#717182]">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#FAF7EE]">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Mobile Header with Hamburger */}
                <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#31372B1F] px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-[#F5F5F5] rounded-md transition"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-[#31372B]">Admin Panel</h1>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
