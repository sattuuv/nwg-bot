'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StreamerManager() {
    const [streamers, setStreamers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        link: '',
        channel: '', // Notification Channel ID
        role: '',    // Role ID
        gameRole: '', // Game Role ID
        type: 'all'
    });

    useEffect(() => {
        fetchStreamers();
    }, []);

    const fetchStreamers = async () => {
        const res = await fetch('/api/streamers');
        const data = await res.json();
        setStreamers(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Stop monitoring this channel?')) return;
        await fetch(`/api/streamers?id=${id}`, { method: 'DELETE' });
        fetchStreamers();
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        // We need notificationChannelId. User typically enters ID manually in this simple dash 
        // OR we would need a channel selector (requires fetching guilds, complex).
        // For now, assume Admin inputs ID.

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
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
                🔴 Streamer Monitor
            </h1>

            {/* Add Form */}
            <div className="bg-[#0f0f2d]/50 p-6 rounded-2xl border border-white/5 mb-8">
                <h2 className="text-xl font-bold mb-4">Add New Streamer</h2>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="YouTube Channel Link"
                        className="bg-black/30 border border-white/10 p-3 rounded-lg"
                        value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                        required
                    />
                    <input
                        type="text" placeholder="Notification Channel ID"
                        className="bg-black/30 border border-white/10 p-3 rounded-lg"
                        value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}
                        required
                    />
                    <input
                        type="text" placeholder="Streamer Role ID (Optional)"
                        className="bg-black/30 border border-white/10 p-3 rounded-lg"
                        value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Game Role ID (Optional)"
                        className="bg-black/30 border border-white/10 p-3 rounded-lg"
                        value={form.gameRole} onChange={e => setForm({ ...form, gameRole: e.target.value })}
                    />
                    <select
                        className="bg-black/30 border border-white/10 p-3 rounded-lg"
                        value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="all">All Videos (Uploads + Live)</option>
                        <option value="live">Live Streams Only</option>
                    </select>

                    <button disabled={loading} className="col-span-2 bg-gradient-to-r from-red-500 to-purple-600 p-3 rounded-lg font-bold hover:opacity-90">
                        {loading ? 'Processing...' : 'Add Monitor'}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {streamers.map((s: any) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        key={s._id}
                        className="bg-[#0f0f2d]/30 p-4 rounded-xl border border-white/5 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-xl">📺</div>
                            <div>
                                <h3 className="font-bold text-lg">{s.channelName || 'Unknown'}</h3>
                                <div className="flex gap-2 text-sm text-gray-400">
                                    <a href={s.channelLink} target="_blank" className="hover:text-red-400">View Channel</a>
                                    <span>•</span>
                                    <span>Filter: {s.notifyType?.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(s._id)} className="bg-red-500/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/40">
                            Delete
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
