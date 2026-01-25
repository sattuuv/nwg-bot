'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            setError('Invalid Password');
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center text-white">
            <form onSubmit={handleLogin} className="bg-[#0f0f2d]/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mb-4 focus:border-[#F81C4F] outline-none transition-colors"
                />

                <button type="submit" className="w-full bg-[#F81C4F] hover:bg-[#d41541] py-3 rounded-lg font-bold transition-all">
                    Enter Dashboard
                </button>
            </form>
        </div>
    );
}
