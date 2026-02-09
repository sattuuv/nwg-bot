'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModuleConfig {
    enabled: boolean;
    [key: string]: any;
}

interface GuildConfig {
    modules: {
        moderation: ModuleConfig;
        welcome: ModuleConfig;
        tickets: ModuleConfig;
        esports: ModuleConfig;
        utility: ModuleConfig;
    };
}

const MODULES_INFO: Record<string, { name: string; icon: string; desc: string; color: string }> = {
    moderation: { name: 'Moderation', icon: '🛡️', desc: 'Auto-mod, logs, and punishment tools.', color: 'from-red-500 to-orange-500' },
    welcome: { name: 'Welcome', icon: '👋', desc: 'Custom welcome barriers and cards.', color: 'from-green-400 to-cyan-500' },
    tickets: { name: 'Tickets', icon: '🎫', desc: 'Support ticket system with transcripts.', color: 'from-blue-500 to-purple-500' },
    esports: { name: 'Esports', icon: '🏆', desc: 'Team management and tournament tools.', color: 'from-yellow-400 to-orange-500' },
    utility: { name: 'Utility', icon: '🛠️', desc: 'General tools and auto-roles.', color: 'from-gray-400 to-gray-600' }
};

export default function PluginsPage() {
    const [config, setConfig] = useState<GuildConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/config');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setConfig(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = async (moduleKey: string, currentState: boolean) => {
        setToggling(moduleKey);
        // Optimistic update
        setConfig(prev => {
            if (!prev) return null;
            return {
                ...prev,
                modules: {
                    ...prev.modules,
                    [moduleKey]: { ...prev.modules[moduleKey as keyof typeof prev.modules], enabled: !currentState }
                }
            };
        });

        try {
            await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ module: moduleKey, enabled: !currentState })
            });
        } catch (err) {
            console.error('Failed to toggle', err);
            // Revert on fail
            fetchConfig();
        } finally {
            setToggling(null);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Configuration...</div>;
    if (!config) return <div className="p-10 text-center text-red-400">Failed to load configuration.</div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Plugins & Modules
                </h1>
                <p className="text-gray-400 mt-2">Enable or disable features for your server.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(config.modules).map((key) => {
                    const info = MODULES_INFO[key] || { name: key, icon: '❓', desc: 'Unkown module', color: 'from-gray-500 to-gray-700' };
                    // @ts-ignore
                    const isEnabled = config.modules[key]?.enabled;

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`
                                relative overflow-hidden rounded-2xl p-1
                                bg-gradient-to-br ${isEnabled ? info.color : 'from-gray-800 to-gray-900'}
                                transition-all duration-300
                            `}
                        >
                            <div className="bg-[#0f0f2d] bg-opacity-95 h-full rounded-xl p-6 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${info.color} bg-opacity-10 text-2xl`}>
                                        {info.icon}
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer p-0">
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary toggle-sm"
                                                checked={isEnabled}
                                                disabled={toggling === key}
                                                onChange={() => toggleModule(key, isEnabled)}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{info.name}</h3>
                                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{info.desc}</p>

                                <button
                                    className={`
                                        w-full py-2 rounded-lg text-sm font-medium transition-colors
                                        ${isEnabled
                                            ? 'bg-white/10 hover:bg-white/20 text-white'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                                    `}
                                    disabled={!isEnabled}
                                >
                                    {isEnabled ? 'Configure Settings ⚙️' : 'Enable to Configure'}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
