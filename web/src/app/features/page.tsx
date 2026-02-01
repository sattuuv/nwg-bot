export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white py-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F81C4F] to-purple-500 mb-6">
                        Powerful Modules
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Everything you need to run a professional esports organization, built directly into Discord.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Module 1 */}
                    <div className="bg-[#0f0f2d]/40 border border-white/5 p-8 rounded-2xl hover:border-[#F81C4F]/30 transition-all group">
                        <div className="text-4xl mb-6 bg-[#F81C4F]/10 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">🏆</div>
                        <h3 className="text-2xl font-bold mb-3">Tournament System</h3>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            <li>• Single Elimination Brackets</li>
                            <li>• Auto-Registration</li>
                            <li>• Lobby Management</li>
                            <li>• Automated Score Reporting</li>
                        </ul>
                    </div>

                    {/* Module 2 */}
                    <div className="bg-[#0f0f2d]/40 border border-white/5 p-8 rounded-2xl hover:border-[#F81C4F]/30 transition-all group">
                        <div className="text-4xl mb-6 bg-blue-500/10 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">⚔️</div>
                        <h3 className="text-2xl font-bold mb-3">Scrim Finder (LFS)</h3>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            <li>• Instant Matchmaking</li>
                            <li>• Skill-based Elo System</li>
                            <li>• Scrim History Logging</li>
                            <li>• Map Veto System</li>
                        </ul>
                    </div>

                    {/* Module 3 */}
                    <div className="bg-[#0f0f2d]/40 border border-white/5 p-8 rounded-2xl hover:border-[#F81C4F]/30 transition-all group">
                        <div className="text-4xl mb-6 bg-green-500/10 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">💰</div>
                        <h3 className="text-2xl font-bold mb-3">Economy & Betting</h3>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            <li>• Team Wallets</li>
                            <li>• Match Betting System</li>
                            <li>• Shop & Inventory</li>
                            <li>• Daily Rewards</li>
                        </ul>
                    </div>

                    {/* Module 4 */}
                    <div className="bg-[#0f0f2d]/40 border border-white/5 p-8 rounded-2xl hover:border-[#F81C4F]/30 transition-all group">
                        <div className="text-4xl mb-6 bg-purple-500/10 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">🛡️</div>
                        <h3 className="text-2xl font-bold mb-3">Auto-Moderation</h3>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            <li>• Bad Word Filter</li>
                            <li>• Anti-Spam (Coming Soon)</li>
                            <li>• Kick/Ban/Timeout Commands</li>
                            <li>• Mod Logs</li>
                        </ul>
                    </div>

                    {/* Module 5 */}
                    <div className="bg-[#0f0f2d]/40 border border-white/5 p-8 rounded-2xl hover:border-[#F81C4F]/30 transition-all group">
                        <div className="text-4xl mb-6 bg-yellow-500/10 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">📢</div>
                        <h3 className="text-2xl font-bold mb-3">Engagement</h3>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            <li>• Streamer Monitor (YouTube/Twitch)</li>
                            <li>• Auto-Nicknames (NWG x Users)</li>
                            <li>• Native Reaction Roles</li>
                            <li>• Welcome Messages</li>
                        </ul>
                    </div>

                    {/* Module 6 */}
                    <div className="bg-[#0f0f2d]/40 border border-white/5 p-8 rounded-2xl hover:border-[#F81C4F]/30 transition-all group">
                        <div className="text-4xl mb-6 bg-pink-500/10 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">⚙️</div>
                        <h3 className="text-2xl font-bold mb-3">Web Dashboard</h3>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            <li>• Remote Bot Configuration</li>
                            <li>• Role Management</li>
                            <li>• Live Status Updates</li>
                            <li>• Admin Control Panel</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
