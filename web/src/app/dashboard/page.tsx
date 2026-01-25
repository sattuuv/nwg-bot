export default function Dashboard() {
    return (
        <div className="flex h-screen bg-zinc-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-zinc-900/50 hidden md:flex flex-col p-6">
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-10">
                    NWG DASH
                </div>
                <nav className="flex-1 space-y-2">
                    {['Overview', 'My Team', 'Tournaments', 'Scrims', 'Wallet', 'Settings'].map((item) => (
                        <div key={item} className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${item === 'Overview' ? 'bg-violet-600/20 text-violet-400' : 'hover:bg-white/5 text-zinc-400 hover:text-white'}`}>
                            {item}
                        </div>
                    ))}
                </nav>
                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800" />
                        <div>
                            <div className="font-medium">User123</div>
                            <div className="text-xs text-zinc-500">ID: 8493...</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="font-bold text-lg">Dashboard Overview</h2>
                    <button className="px-4 py-1.5 bg-violet-600 text-sm rounded-lg hover:bg-violet-500">New Scrim</button>
                </header>

                <div className="p-8 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: "Wallet Balance", value: "$4,250", color: "text-green-400" },
                            { label: "Scrim Wins", value: "24", color: "text-blue-400" },
                            { label: "Tournament Rank", value: "#3", color: "text-amber-400" },
                            { label: "Experience", value: "Lvl 12", color: "text-purple-400" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-xl bg-zinc-900/50 border border-white/5">
                                <div className="text-zinc-400 text-sm mb-1">{stat.label}</div>
                                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Scrims */}
                    <div className="bg-zinc-900/30 rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="font-bold">Upcoming Matches</h3>
                        </div>
                        <div className="p-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-zinc-500 text-sm border-b border-white/5">
                                        <th className="pb-4">Event</th>
                                        <th className="pb-4">Time</th>
                                        <th className="pb-4">Opponent</th>
                                        <th className="pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { event: "Scrim #392", time: "Today, 8:00 PM", opp: "Team Liquid", status: "Ready" },
                                        { event: "Winter Cup Qualifiers", time: "Tomorrow, 6:00 PM", opp: "TBD", status: "Scheduled" },
                                        { event: "Scrim #395", time: "Jan 28, 9:00 PM", opp: "Navi", status: "Pending" },
                                    ].map((row, i) => (
                                        <tr key={i} className="group">
                                            <td className="py-4 font-medium">{row.event}</td>
                                            <td className="py-4 text-zinc-400">{row.time}</td>
                                            <td className="py-4 text-zinc-300">{row.opp}</td>
                                            <td className="py-4">
                                                <span className="px-2 py-1 round-full bg-violet-500/10 text-violet-400 text-xs rounded border border-violet-500/20">
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
