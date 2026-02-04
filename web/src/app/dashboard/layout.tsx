import Link from 'next/link';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#050511] text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#0f0f2d]/30 backdrop-blur-md hidden md:flex flex-col p-6 fixed h-full z-20">
                <div className="text-2xl font-bold mb-10 flex items-center gap-2">
                    <span>NWG<span className="text-[#F81C4F]">Dash</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-medium">
                        <span>🏠</span> Home
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-medium">
                        <span>📊</span> Overview
                    </Link>
                    <Link href="/dashboard/streamers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-medium">
                        <span>🔴</span> Streamers
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-medium">
                        <span>⚙️</span> Bot Settings
                    </Link>
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500" />
                        <div>
                            <div className="font-medium text-sm">Administrator</div>
                            <div className="text-xs text-red-400">Restricted Access</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="font-bold text-xl">Admin Command Center</h2>
                    <Link href="/dashboard/settings" className="px-5 py-2 bg-[#F81C4F] text-white text-sm rounded-full hover:bg-[#d41541] shadow-lg shadow-[#F81C4F]/20 transition-all">
                        ⚙️ Global Settings
                    </Link>
                </header>

                <div>
                    {children}
                </div>
            </main>
        </div>
    );
}
