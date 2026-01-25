import connectDB from '@/lib/db';
import Guild from '@/models/Guild';
import BotConfig from '@/models/BotConfig';
import { redirect } from 'next/navigation';

async function updateSettings(formData: FormData) {
    'use server';
    await connectDB();

    const guildId = formData.get('guildId');

    const settings = {
        badWordsEnabled: formData.get('badWords') === 'on',
        autoRoleId: formData.get('autoRoleId'),
        verificationRoleId: formData.get('verificationRoleId'),
        welcomeChannelId: formData.get('welcomeChannelId')
    };

    await Guild.findOneAndUpdate(
        { guildId: guildId },
        { ...settings },
        { upsert: true, new: true }
    );

    redirect('/dashboard/settings?success=true');
}

async function updateStatus(formData: FormData) {
    'use server';
    await connectDB();

    const status = {
        activityName: formData.get('activityName'),
        activityType: Number(formData.get('activityType')),
        status: formData.get('status')
    };

    await BotConfig.findOneAndUpdate(
        { instanceId: 'global' },
        { ...status },
        { upsert: true, new: true }
    );

    redirect('/dashboard/settings?status_success=true');
}

export default async function SettingsPage({ searchParams }: { searchParams: { success?: string, status_success?: string } }) {
    return (
        <div className="min-h-screen bg-[#0f172a] p-8 text-white ml-64">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            Control Panel
                        </h1>
                        <p className="text-gray-400 mt-2">Manage your bot and server settings</p>
                    </div>
                </div>

                {/* Status Manager Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 text-blue-400">🤖 Global Bot Status</h2>
                    {searchParams.status_success && (
                        <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 p-4 rounded-lg mb-6">
                            ✅ Status updated! (Restart bot to apply changes)
                        </div>
                    )}
                    <form action={updateStatus} className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800/50 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Activity Type</label>
                                <select name="activityType" className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                                    <option value="0">Playing</option>
                                    <option value="1">Streaming</option>
                                    <option value="2">Listening to</option>
                                    <option value="3">Watching</option>
                                    <option value="5">Competing in</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-gray-300">Activity Text</label>
                                <input
                                    name="activityName"
                                    type="text"
                                    placeholder="e.g. NWG Tournaments"
                                    required
                                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Online Status</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="status" value="online" defaultChecked className="text-green-500 focus:ring-green-500" />
                                    <span className="text-green-400">Online 🟢</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="status" value="dnd" className="text-red-500 focus:ring-red-500" />
                                    <span className="text-red-400">Do Not Disturb 🔴</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="status" value="idle" className="text-yellow-500 focus:ring-yellow-500" />
                                    <span className="text-yellow-400">Idle 🌙</span>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                            Update Status
                        </button>
                    </form>
                </section>

                <hr className="border-gray-800" />

                {/* Server Settings Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 text-purple-400">⚙️ Server Configuration</h2>
                    {searchParams.success && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6">
                            ✅ Server settings saved!
                        </div>
                    )}

                    <form action={updateSettings} className="space-y-6">

                        {/* Guild ID Input */}
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50">
                            <label className="block text-sm font-medium mb-2 text-gray-300">Target Server ID</label>
                            <input
                                name="guildId"
                                type="text"
                                placeholder="Enter your Discord Server ID"
                                required
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-2">Right click your server icon -{`>`} Copy ID</p>
                        </div>

                        {/* Auto Mod */}
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white">🛡️ Auto-Moderation</h3>
                                <p className="text-sm text-gray-400">Block bad words & spam</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="badWords" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        {/* IDs Config */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50">
                                <label className="block text-sm font-medium mb-3 text-gray-300">👤 Auto-Role ID</label>
                                <input
                                    name="autoRoleId"
                                    type="text"
                                    placeholder="e.g. 123456789..."
                                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none font-mono"
                                />
                            </div>

                            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50">
                                <label className="block text-sm font-medium mb-3 text-gray-300">✅ Verification Role ID</label>
                                <input
                                    name="verificationRoleId"
                                    type="text"
                                    placeholder="e.g. 123456789..."
                                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                        >
                            Save Configuration
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
