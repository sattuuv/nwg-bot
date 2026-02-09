'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            setError('Invalid Access Key');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center text-white relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F81C4F]/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="bg-[#0f0f2d]/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
                    {/* Gloss Reflection */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-16 h-16 bg-gradient-to-br from-[#F81C4F] to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#F81C4F]/20"
                        >
                            <span className="text-3xl">🔐</span>
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Admin Portal
                        </h1>
                        <p className="text-gray-400 text-sm mt-2">Enter your secured access key to continue.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Access Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#050511]/50 border border-white/10 rounded-xl px-5 py-4 focus:border-[#F81C4F] focus:ring-1 focus:ring-[#F81C4F] outline-none transition-all placeholder:text-gray-600 text-lg tracking-widest"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full bg-gradient-to-r from-[#F81C4F] to-[#b01035] 
                                hover:shadow-lg hover:shadow-[#F81C4F]/25 hover:scale-[1.02] active:scale-[0.98]
                                text-white font-bold py-4 rounded-xl transition-all duration-300
                                flex items-center justify-center gap-2
                                ${isLoading ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Access Dashboard</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-gray-500">
                        Protected by NWG Secure Systems • ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
