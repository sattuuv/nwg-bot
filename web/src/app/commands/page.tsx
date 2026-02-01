export default function CommandsPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white py-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#F81C4F] mb-4">Commands</h1>
                <p className="text-gray-400 text-lg mb-12">Complete list of available commands for NWG Bot.</p>

                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="bg-[#0f0f2d]/50 border border-white/5 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[#F81C4F] mb-6 border-b border-white/5 pb-4">🏆 Esports & Tournaments</h2>
                        <div className="grid gap-4">
                            <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-white/5 pb-4 last:border-0">
                                <code className="bg-[#F81C4F]/10 text-[#F81C4F] px-4 py-1 rounded-full font-mono text-sm w-fit">/team create</code>
                                <span className="text-gray-400">Create a new team (You become Captain).</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-white/5 pb-4 last:border-0">
                                <code className="bg-[#F81C4F]/10 text-[#F81C4F] px-4 py-1 rounded-full font-mono text-sm w-fit">/tournament create</code>
                                <span className="text-gray-400">Start a new tournament (Admin Only).</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-white/5 pb-4 last:border-0">
                                <code className="bg-[#F81C4F]/10 text-[#F81C4F] px-4 py-1 rounded-full font-mono text-sm w-fit">/scrims find</code>
                                <span className="text-gray-400">Post an LFS ad to find an opponent.</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-[#0f0f2d]/50 border border-white/5 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-blue-500 mb-6 border-b border-white/5 pb-4">⚔️ Moderation & Utility</h2>
                        <div className="grid gap-4">
                            <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-white/5 pb-4 last:border-0">
                                <code className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full font-mono text-sm w-fit">/mod kick</code>
                                <span className="text-gray-400">Kick a user from the server.</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-white/5 pb-4 last:border-0">
                                <code className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full font-mono text-sm w-fit">/announce</code>
                                <span className="text-gray-400">Send a colorful embed message to any channel.</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-white/5 pb-4 last:border-0">
                                <code className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full font-mono text-sm w-fit">/streamer add</code>
                                <span className="text-gray-400">Monitor a YouTube channel for new uploads/streams.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
