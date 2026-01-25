export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white flex items-center justify-center px-6">
            <div className="text-center max-w-2xl">
                <div className="w-24 h-24 bg-[#F81C4F]/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <span className="text-4xl">🛠️</span>
                </div>
                <h1 className="text-5xl font-bold mb-6">Support & Help</h1>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    Need help setting up the bot? Join our official support server OR use the <code>/ticket setup</code> command in your own server to create a help channel.
                </p>
                <div className="flex justify-center gap-6">
                    <a href="#" className="px-8 py-4 bg-[#5865F2] hover:bg-[#4752c4] rounded-full font-bold transition-all shadow-lg shadow-blue-500/20">
                        Join Discord Server
                    </a>
                    <a href="/" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-semibold transition-all">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
