import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-violet-500/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            NWG ESPORTS
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium hover:text-violet-400 transition-colors">
              Dashboard
            </Link>
            <Link href="#" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-neutral-200 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            The Ultimate <span className="text-violet-500">Esports</span> <br />
            Management Suite
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Automate tournaments, manage scrims, and track your team's performance with the most advanced Discord bot for gaming communities.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-600/20">
              Add to Discord
            </button>
            <Link href="/dashboard" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-xl font-semibold transition-all">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: "Tournament Bracket", desc: "Auto-generated brackets for simple and complex tournaments.", icon: "🏆" },
            { title: "Scrim Finder", desc: "Post LFS ads and find matches instantly with other teams.", icon: "⚔️" },
            { title: "Team Economy", desc: "Bet on matches, earn rewards, and climb the leaderboard.", icon: "💰" }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/50 transition-all group">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-zinc-600 border-t border-white/5">
        <p>© 2026 NWG Esports. Built for Gamers.</p>
      </footer>
    </main>
  );
}
