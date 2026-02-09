'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ModerationSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        enabled: false,
        logChannelId: '',
        muteRoleId: '',
        badWordsFilter: false
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/config');
            const data = await res.json();
            if (data.modules?.moderation) {
                setConfig(data.modules.moderation);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // We need to send the FULL module object to update it
            await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modules: {
                        moderation: config
                        // Note: The API needs to support deep merging or we need to send the whole structure.
                        // Ideally we should update the API to handle partial updates or we send the full merged object.
                        // For now, let's assume the API in route.ts handles the update logic or we adjust the API.
                        // Wait, my API route uses $set: body. 
                        // So I should send { "modules.moderation": config } ? No, Mongoose $set doesn't work deep like that with JSON body unless flattened.
                        // Actually, looking at my API route:
                        // if (module) ... else { $set: body }
                        // So I should fetch the WHOLE config, update mod, and send back? Or update the API.
                        // Let's UPDATE the API to be smarter. But for now, I'll send the nested structure.
                        // { modules: { moderation: config } } combined with existing config?
                        // Actually, let's use the 'module' toggle endpoint but I need a generic 'update settings' endpoint.
                        // I'll update the API to handle a specifically targeted update or just use the current POST with nested data.
                        // To be safe, I will fetch full config, merge, and save.
                    }
                })
            });
            // Actually, I'll modify the API to handle partial updates better in the next step. 
            // For now, let's try sending the update structure. 
            // If I send { modules: { moderation: ... } }, $set will replace the whole modules object if I'm not careful? 
            // No, Mongoose $set on "modules.moderation" works if keys are quoted.
            // But standard JSON body { modules: { moderation: ... } } passed to $set might overwrite other modules if not using dot notation.
            // Safe bet: Fetch, Merge, Save.

            // BETTER: I will assume I'm fixing the API next.
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            // Fetch current state first to ensure we don't wipe other modules
            const res = await fetch('/api/config');
            const currentData = await res.json();

            const updatedModules = { ...currentData.modules };
            updatedModules.moderation = config;

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
                    <h1 className="text-3xl font-bold text-white">Moderation Settings</h1>
                    <p className="text-gray-400">Configure auto-moderation and logging.</p>
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
                        <h3 className="font-bold text-lg text-white">Enable Moderation Module</h3>
                        <p className="text-sm text-gray-400">Master switch for all moderation features.</p>
                    </div>
                    <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-lg"
                        checked={config.enabled}
                        onChange={e => setConfig({ ...config, enabled: e.target.checked })}
                    />
                </div>

                <div className={`space-y-6 ${!config.enabled ? 'opacity-50 pointer-events-none' : ''}`}>

                    {/* Log Channel */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mod Log Channel ID</label>
                        <input
                            type="text"
                            placeholder="123456789012345678"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-[#F81C4F] outline-none transition-colors"
                            value={config.logChannelId || ''}
                            onChange={e => setConfig({ ...config, logChannelId: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-2">ID of the channel where kicks/bans/warns are logged.</p>
                    </div>

                    {/* Mute Role */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mute Role ID</label>
                        <input
                            type="text"
                            placeholder="123456789012345678"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-[#F81C4F] outline-none transition-colors"
                            value={config.muteRoleId || ''}
                            onChange={e => setConfig({ ...config, muteRoleId: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-2">The role assigned to muted users (make sure it denies Send Messages permissions).</p>
                    </div>

                    {/* Filters */}
                    <div className="pt-6 border-t border-white/10">
                        <h4 className="font-bold text-white mb-4">Auto-Mod Filters</h4>

                        <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                            <span>🚫 Bad Words Filter</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-error"
                                checked={config.badWordsFilter}
                                onChange={e => setConfig({ ...config, badWordsFilter: e.target.checked })}
                            />
                        </div>
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
