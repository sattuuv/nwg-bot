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

                    <Link href="/dashboard/streamers" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400 text-2xl">🔴</div>
                        <div>
                            <h4 className="font-bold text-white">Streamer Monitor</h4>
                            <p className="text-sm text-gray-400">Add/Remove YouTube Channels</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
