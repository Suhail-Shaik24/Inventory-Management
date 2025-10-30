import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function RootLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="h-screen w-full bg-[rgb(33,19,9)] text-gray-200 p-4 md:p-6 lg:p-8">
            {/* Flex container to hold the sidebar and main content with a gap */}
            <div className="flex h-full w-full gap-4 md:gap-6 lg:gap-8">
                {/* --- Sidebar --- */}
                <Sidebar
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />

                {/* --- Main Content Area --- */}
                <div className="flex h-full flex-1 flex-col overflow-y-auto">
                    <main className="flex-1">
                        <Header setIsMobileOpen={setIsMobileOpen} />

                        <div className="mt-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

