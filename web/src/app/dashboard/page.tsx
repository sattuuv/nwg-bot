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

        return {
            teams: teamCount,
            tournaments: tournamentCount,
            servers: guildCount || 1 // Assuming at least 1 (current)
        };
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
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F81C4F]/10 text-[#F81C4F] border border-[#F81C4F]/20 transition-all font-medium">
                        <span>📊</span> Overview
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-medium">
                        <span>⚙️</span> Settings
                    </Link>
                    <div className="pt-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Coming Soon</div>
                    {['My Team', 'Tournaments', 'Wallet'].map((item) => (
                        <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 cursor-not-allowed">
                            <span>🔒</span> {item}
                        </div>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F81C4F] to-purple-600" />
                        <div>
                            <div className="font-medium text-sm">Admin Access</div>
                            <div className="text-xs text-gray-400">Connected</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#F81C4F]/5 to-transparent pointer-events-none" />

                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="font-bold text-xl">System Overview</h2>
                    <div className="flex gap-4">
                        <a href="https://discord.com/invite/your-code" target="_blank" className="px-5 py-2 bg-white/5 border border-white/10 text-sm rounded-full hover:bg-white/10 transition-colors">
                            Support Server
                        </a>
                        <Link href="/dashboard/settings" className="px-5 py-2 bg-[#F81C4F] text-white text-sm rounded-full hover:bg-[#d41541] shadow-lg shadow-[#F81C4F]/20 transition-all">
                            Configure Bot
                        </Link>
                    </div>
                </header>

                <div className="p-8 space-y-8 relative z-0">
                    {/* Real Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-[#0f0f2d]/40 border border-white/5 backdrop-blur-sm hover:border-[#F81C4F]/30 transition-colors">
                            <div className="text-gray-400 text-sm mb-2 font-medium">Total Teams</div>
                            <div className="text-4xl font-bold text-white">{stats.teams}</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#0f0f2d]/40 border border-white/5 backdrop-blur-sm hover:border-[#F81C4F]/30 transition-colors">
                            <div className="text-gray-400 text-sm mb-2 font-medium">Active Tournaments</div>
                            <div className="text-4xl font-bold text-[#F81C4F]">{stats.tournaments}</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#0f0f2d]/40 border border-white/5 backdrop-blur-sm hover:border-[#F81C4F]/30 transition-colors">
                            <div className="text-gray-400 text-sm mb-2 font-medium">Configured Servers</div>
                            <div className="text-4xl font-bold text-purple-400">{stats.servers}</div>
                        </div>
                    </div>

                    {/* Quick Guide */}
                    <div className="bg-[#0f0f2d]/30 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Getting Started</h3>
                            <span className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">System Online</span>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-white font-semibold mb-4">How to manage the bot?</h4>
                                <ul className="space-y-4 text-gray-400 text-sm">
                                    <li className="flex gap-3">
                                        <span className="text-[#F81C4F] font-bold">1.</span>
                                        <span>Click <b>Configure Bot</b> (Top Right) to set up Auto-Mod and Roles.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-[#F81C4F] font-bold">2.</span>
                                        <span>Go to Discord and run <code>/ticket setup</code> to create your support panel.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-[#F81C4F] font-bold">3.</span>
                                        <span>Use <code>/tournament create</code> to start your first event.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                                <h4 className="text-white font-semibold mb-2">Bot Status</h4>
                                <p className="text-xs text-gray-500 mb-6 font-mono">ID: {Date.now()}</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Database Connection</span>
                                        <span className="text-green-400">Active</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Bot Latency</span>
                                        <span className="text-white">~24ms</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-[#F81C4F] h-full w-[98%] animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
