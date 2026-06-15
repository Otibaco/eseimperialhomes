"use client";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminHeader />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}