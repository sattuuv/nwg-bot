import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030014] relative overflow-hidden font-sans selection:bg-pink-500/30">

      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-white opacity-20"></div>
        {/* Purple Glow Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">NWG<span className="text-pink-500">Bot</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Commands</Link>
          <Link href="#" className="hover:text-white transition-colors">Support</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-all">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="text-sm font-medium text-pink-300">V2.0 Now Available</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-8 leading-tight">
            Dominate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Esports Journey</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The all-in-one Discord bot for tournament management, scrim finding, and team economy.
            Built for the next generation of gamers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="#" className="px-8 py-4 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg shadow-lg shadow-pink-500/25 transition-all w-full md:w-auto hover:scale-105">
              Add to Discord
            </Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-lg backdrop-blur-sm transition-all w-full md:w-auto">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Floating UI Card Mockups */}
        <div className="mt-24 relative max-w-5xl mx-auto">
          <div className="bg-[#0f0c29]/80 border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-xl">
            <div className="bg-[#030014] rounded-lg border border-white/5 p-8 h-[400px] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid-white opacity-10"></div>
              <div className="text-center relative z-10 p-10 glass-card rounded-2xl max-w-lg transform group-hover:scale-105 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-2">Tournament Bracket</h3>
                <p className="text-gray-400">Auto-generating brackets with live score updates.</p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 font-bold">1</div>
                  <div className="h-1 bg-gray-700 w-16"></div>
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold">2</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; 2026 NWG Esports. Built for Gamers.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
