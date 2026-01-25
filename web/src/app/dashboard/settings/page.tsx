import connectDB from '@/lib/db';
import Guild from '@/models/Guild';
import { redirect } from 'next/navigation';

async function updateSettings(formData: FormData) {
    'use server';
    await connectDB();

    // In a real app, you would get the Guild ID from the Session
    // For this MVP, we will use a hardcoded Guild ID or logic (User must enter it for now)
    // PRO TIP: When you add NextAuth later, this will come from session.guildId
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

export default async function SettingsPage({ searchParams }: { searchParams: { success?: string } }) {
    return (
        <div className="min-h-screen bg-[#0f172a] p-8 text-white ml-64">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            Bot Configuration
                        </h1>
                        <p className="text-gray-400 mt-2">Manage your server settings</p>
                    </div>
                </div>

                {searchParams.success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg">
                        ✅ Settings saved successfully! The bot will update instantly.
                    </div>
                )}

                <form action={updateSettings} className="space-y-6">

                    {/* TEMP: Guild ID Input (Until NextAuth is fully bonded) */}
                    <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50 hover:border-blue-500/30 transition-all">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Target Server ID</label>
                        <input
                            name="guildId"
                            type="text"
                            placeholder="Enter your Discord Server ID"
                            required
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-white font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-2">Right click your server icon -> Copy ID</p>
                    </div>

                    {/* Auto Mod */}
                    <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-white">🛡️ Auto-Moderation</h3>
                                <p className="text-sm text-gray-400 mt-1">Automatically delete bad words and spam.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="badWords" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* IDs Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50">
                            <label className="block text-sm font-medium mb-3 text-gray-300">👤 Auto-Role ID</label>
                            <input
                                name="autoRoleId"
                                type="text"
                                placeholder="123456789..."
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-white font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-2">Role given immediately on join</p>
                        </div>

                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800/50">
                            <label className="block text-sm font-medium mb-3 text-gray-300">✅ Verification Role ID</label>
                            <input
                                name="verificationRoleId"
                                type="text"
                                placeholder="123456789..."
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 text-white font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-2">Role given when button clicked</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02]"
                    >
                        Save Configuration
                    </button>
                </form>
            </div>
        </div>
    );
}
