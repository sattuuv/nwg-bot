'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WelcomeSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        enabled: false,
        channelId: '',
        message: 'Welcome {user} to {guild}!',
        cardEnabled: true
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/config');
            const data = await res.json();
            if (data.modules?.welcome) {
                setConfig(data.modules.welcome);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            // Fetch current state to merge
            const res = await fetch('/api/config');
            const currentData = await res.json();

            const updatedModules = { ...currentData.modules };
            updatedModules.welcome = config;

            await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modules: updatedModules })
            });

            alert('Settings Saved!');
        } catch (e) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Settings...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                <Link href="/dashboard/plugins" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    ⬅️ Back
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome Settings</h1>
                    <p className="text-gray-400">Customize how new members are greeted.</p>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f0f2d]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
            >
                {/* Main Toggle */}
                <div className="flex justify-between items-center mb-8 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                        <h3 className="font-bold text-lg text-white">Enable Welcome Module</h3>
                        <p className="text-sm text-gray-400">Send messages when users join.</p>
                    </div>
                    <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-lg"
                        checked={config.enabled}
                        onChange={e => setConfig({ ...config, enabled: e.target.checked })}
                    />
                </div>

                <div className={`space-y-6 ${!config.enabled ? 'opacity-50 pointer-events-none' : ''}`}>

                    {/* Welcome Channel */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Welcome Channel ID</label>
                        <input
                            type="text"
                            placeholder="123456789012345678"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-[#F81C4F] outline-none transition-colors"
                            value={config.channelId || ''}
                            onChange={e => setConfig({ ...config, channelId: e.target.value })}
                        />
                    </div>

                    {/* Welcome Message */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Welcome Message</label>
                        <textarea
                            rows={4}
                            placeholder="Welcome {user} to {guild}!"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-[#F81C4F] outline-none transition-colors resize-y"
                            value={config.message || ''}
                            onChange={e => setConfig({ ...config, message: e.target.value })}
                        />
                        <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 cursor-help" title="Mentions the user">{'{user}'}</span>
                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 cursor-help" title="Server Name">{'{guild}'}</span>
                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 cursor-help" title="Member Count">{'{count}'}</span>
                        </div>
                    </div>

                    {/* Image Card Toggle */}
                    <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🖼️</span>
                            <div>
                                <h4 className="font-bold text-white">Welcome Image Card</h4>
                                <p className="text-xs text-gray-400">Generate a custom image with the user's avatar.</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-success"
                            checked={config.cardEnabled}
                            onChange={e => setConfig({ ...config, cardEnabled: e.target.checked })}
                        />
                    </div>

                </div>

                {/* Save Button */}
                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="bg-[#F81C4F] hover:bg-[#d41541] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#F81C4F]/20 transition-all flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : 'Save Changes 💾'}
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
