import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050511] relative overflow-hidden font-sans selection:bg-[#F81C4F] selection:text-white">

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center bg-[#0f0f2d]/40 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white">NWG<span className="text-[#F81C4F]">Bot</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <Link href="#" className="hover:text-[#F81C4F] transition-colors">Features</Link>
              <Link href="#" className="hover:text-[#F81C4F] transition-colors">Commands</Link>
              <Link href="#" className="hover:text-[#F81C4F] transition-colors">Support</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden md:inline-flex items-center bg-white text-[#0f0f2d] font-semibold py-2 px-5 rounded-lg shadow-lg hover:-translate-y-0.5 transition-all text-sm">
                Dashboard
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-hero-radial relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
          <div className="absolute top-20 -left-20 w-96 h-96 bg-[#F81C4F]/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
          <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-500/50 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#F81C4F] text-sm font-semibold mb-8 backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F81C4F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F81C4F]"></span>
              </span>
              NWG Bot V2.0 is Live
            </div>

            {/* Main Text */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-white mb-6">
              Transform Your <br className="hidden md:block" />
              <span className="text-gradient">Discord Server</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-normal leading-relaxed">
              Welcome to <span className="font-semibold text-white">NWG Bot</span>.
              The ultimate esports management suite for tournaments, scrims, and team economy.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#" className="w-full sm:w-auto flex items-center justify-center bg-[#F81C4F] text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Add to Discord
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all duration-300">
                View Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Feature 1 */}
              <div className="group bg-[#0f0f2d]/40 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/5 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-xl bg-[#F81C4F]/10 flex items-center justify-center mb-6 group-hover:bg-[#F81C4F]/20 transition-colors">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Tournaments</h3>
                <p className="text-gray-400 leading-relaxed">
                  Auto-generating brackets with live score updates. Manage registration and payouts effortlessly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-[#0f0f2d]/40 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/5 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <span className="text-3xl">⚔️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Scrim Finder</h3>
                <p className="text-gray-400 leading-relaxed">
                  Find matches instantly. Our intelligent matchmaking pairs your team with equal skill opponents.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-[#0f0f2d]/40 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/5 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Economy System</h3>
                <p className="text-gray-400 leading-relaxed">
                  Bet on matches, earn rewards, and climb the leaderboard. A complete financial ecosystem.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; 2026 NWG Esports. Built for Gamers.</p>
        </div>
      </footer>
    </div>
  );
}
