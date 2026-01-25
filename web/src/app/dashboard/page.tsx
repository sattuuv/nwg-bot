import Link from 'next/link';
import connectDB from '@/lib/db';
import Team from '@/models/Team';
import Tournament from '@/models/Tournament';
import Guild from '@/models/Guild';

async function getStats() {
    await connectDB();
    try {
        const teamCount = await Team.countDocuments();
        const tournamentCount = await Tournament.countDocuments();
        const guildCount = await Guild.countDocuments();
        return { teams: teamCount, tournaments: tournamentCount, servers: guildCount || 1 };
    } catch (e) {
        return { teams: 0, tournaments: 0, servers: 0 };
    }
}

export default async function Dashboard() {
    const stats = await getStats();

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
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F81C4F]/10 text-[#F81C4F] border border-[#F81C4F]/20 transition-all font-medium">
                        <span>📊</span> Overview
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

                <div className="p-8 space-y-8">
                    {/* Admin Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-[#0f0f2d]/40 border border-white/5">
                            <div className="text-gray-400 text-sm mb-2 font-medium">System Status</div>
                            <div className="text-xl font-bold text-green-400 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#0f0f2d]/40 border border-white/5">
                            <div className="text-gray-400 text-sm mb-2 font-medium">Total Servers</div>
                            <div className="text-4xl font-bold text-white">{stats.servers}</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#0f0f2d]/40 border border-white/5">
                            <div className="text-gray-400 text-sm mb-2 font-medium">Active Tournaments</div>
                            <div className="text-4xl font-bold text-[#F81C4F]">{stats.tournaments}</div>
                        </div>
                    </div>

                    {/* Quick Configuration */}
                    <div className="bg-[#0f0f2d]/30 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="font-bold text-lg">Quick Actions</h3>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-6">
                            <Link href="/dashboard/settings" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 text-2xl">🤖</div>
                                <div>
                                    <h4 className="font-bold text-white">Bot Status</h4>
                                    <p className="text-sm text-gray-400">Change playing status</p>
                                </div>
                            </Link>

                            <Link href="/dashboard/settings" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 text-2xl">🛡️</div>
                                <div>
                                    <h4 className="font-bold text-white">Auto-Mod</h4>
                                    <p className="text-sm text-gray-400">Configure bad words filter</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
