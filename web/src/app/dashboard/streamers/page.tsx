'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StreamerManager() {
    const [streamers, setStreamers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        link: '',
        channel: '',
        role: '',
        gameRole: '',
        type: 'all'
    });

    useEffect(() => {
        fetchStreamers();
    }, []);

    const fetchStreamers = async () => {
        try {
            const res = await fetch('/api/streamers');
            const data = await res.json();
            setStreamers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Stop monitoring ${name || 'this channel'}?`)) return;
        setStreamers(prev => prev.filter((s: any) => s._id !== id)); // Optimistic update
        await fetch(`/api/streamers?id=${id}`, { method: 'DELETE' });
        fetchStreamers(); // Sync
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await fetch('/api/streamers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channelLink: form.link,
                    notificationChannelId: form.channel,
                    roleIdToPing: form.role,
                    gameRoleId: form.gameRole,
                    notifyType: form.type
                })
            });
            setForm({ link: '', channel: '', role: '', gameRole: '', type: 'all' });
            fetchStreamers();
        } catch (e) {
            alert('Failed to add. Check link format.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#F81C4F] to-purple-500">
                        Streamer Monitor
                    </h1>
                    <p className="text-gray-400">Manage real-time YouTube notifications for your community.</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-[#0f0f2d]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl shadow-black/20">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-[#F81C4F]/20 text-[#F81C4F] p-2 rounded-lg">➕</span> Add New
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">YouTube Link</label>
                                    <input
                                        type="text" placeholder="https://youtube.com/channel/..."
                                        className="w-full bg-black/40 border border-white/5 focus:border-[#F81C4F] p-3 rounded-xl transition-all outline-none text-sm"
                                        value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Notify Channel ID</label>
                                    <input
                                        type="text" placeholder="Discord Channel ID"
                                        className="w-full bg-black/40 border border-white/5 focus:border-[#F81C4F] p-3 rounded-xl transition-all outline-none text-sm"
                                        value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Streamer Role</label>
                                        <input
                                            type="text" placeholder="Role ID"
                                            className="w-full bg-black/40 border border-white/5 focus:border-[#F81C4F] p-3 rounded-xl transition-all outline-none text-sm"
                                            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Game Role</label>
                                        <input
                                            type="text" placeholder="Role ID"
                                            className="w-full bg-black/40 border border-white/5 focus:border-[#F81C4F] p-3 rounded-xl transition-all outline-none text-sm"
                                            value={form.gameRole} onChange={e => setForm({ ...form, gameRole: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Notify Type</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/5 focus:border-[#F81C4F] p-3 rounded-xl transition-all outline-none text-sm text-gray-300"
                                        value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                    >
                                        <option value="all">All Videos (Uploads + Live)</option>
                                        <option value="live">Live Streams Only</option>
                                    </select>
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-[#F81C4F] to-purple-600 p-4 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-[#F81C4F]/20"
                                >
                                    {submitting ? 'Connecting...' : 'Start Monitoring'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg">📡</span> Active Monitors
                        </h2>

                        {loading ? (
                            // Loading Skeletons
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                            ))
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                <AnimatePresence>
                                    {streamers.map((s: any) => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={s._id}
                                            className="bg-[#0f0f2d]/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-[#F81C4F]/30 transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleDelete(s._id, s.channelName)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg text-xs font-bold">REMOVE</button>
                                            </div>

                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-purple-600 p-[2px]">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${s.channelName}&background=0D0D1F&color=fff`}
                                                        alt="Avatar"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg truncate w-40">{s.channelName || 'Loading...'}</h3>
                                                    <a href={s.channelLink} target="_blank" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                                        🔗 Open Channel
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                <div className="flex justify-between text-sm bg-black/20 p-2 rounded-lg">
                                                    <span className="text-gray-500">Type</span>
                                                    <span className={`font-bold ${s.notifyType === 'live' ? 'text-red-400' : 'text-blue-400'}`}>
                                                        {s.notifyType === 'live' ? '🔴 Live Only' : '📹 All content'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm bg-black/20 p-2 rounded-lg">
                                                    <span className="text-gray-500">Roles</span>
                                                    <div className="flex gap-1">
                                                        {s.roleIdToPing && <span className="bg-white/10 px-2 rounded text-xs py-0.5">Streamer</span>}
                                                        {s.gameRoleId && <span className="bg-white/10 px-2 rounded text-xs py-0.5">Game</span>}
                                                        {!s.roleIdToPing && !s.gameRoleId && <span className="text-gray-600 text-xs">None</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {streamers.length === 0 && (
                                    <div className="col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                        <div className="text-4xl mb-4">😴</div>
                                        <p className="text-gray-400">No channels monitored yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
