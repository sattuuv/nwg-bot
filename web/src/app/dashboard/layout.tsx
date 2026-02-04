'use client';
import Link from 'next/link';
import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Home', icon: '🏠' },
        { href: '/dashboard', label: 'Overview', icon: '📊' },
        { href: '/dashboard/streamers', label: 'Streamers', icon: '🔴' },
        { href: '/dashboard/settings', label: 'Bot Settings', icon: '⚙️' },
    ];

    return (
        <div className="flex min-h-screen bg-[#050511] text-white font-sans overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full h-16 bg-[#0f0f2d]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4">
                <div className="font-bold text-lg">NWG<span className="text-[#F81C4F]">Dash</span></div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-2xl">
                    {isSidebarOpen ? '✕' : '☰'}
                </button>
            </header>

            {/* Sidebar (Desktop + Mobile) */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-[#0f0f2d]/90 backdrop-blur-xl border-r border-white/10 z-40 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex flex-col p-6
            `}>
                <div className="text-2xl font-bold mb-10 hidden md:flex items-center gap-2">
                    <span>NWG<span className="text-[#F81C4F]">Dash</span></span>
                </div>

                <nav className="flex-1 space-y-2 mt-16 md:mt-0">
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                        ? 'bg-[#F81C4F]/10 text-[#F81C4F] border border-[#F81C4F]/20'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <span>{link.icon}</span> {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F81C4F] to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm" />
                        </div>
                        <div>
                            <div className="font-medium text-sm">Administrator</div>
                            <div className="text-xs text-[#F81C4F]">Restricted Access</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto h-screen pt-16 md:pt-0">
                <header className="hidden md:flex h-20 border-b border-white/5 items-center justify-between px-8 backdrop-blur-sm sticky top-0 z-10 bg-[#050511]/80">
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
