import { GamesList } from "@/components/games-list";
import { getAllGames } from "@/lib/contract";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const games = await getAllGames();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/10 to-secondary/5" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-slide-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground animate-slide-in">
              QUANTUM ARENA
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 animate-slide-in" style={{animationDelay: '0.2s'}}>
              Enter the ultimate battleground where strategy meets blockchain technology
            </p>
            <p className="text-lg text-foreground/50 max-w-2xl mx-auto animate-slide-in" style={{animationDelay: '0.4s'}}>
              Challenge opponents in quantum-powered tic-tac-toe battles. Stake STX, prove your dominance, and claim victory in the decentralized arena.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Link 
                href="/create" 
                className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg animate-scale-in"
                style={{animationDelay: '0.6s'}}
              >
                🚀 START BATTLE
              </Link>
              
              <Link 
                href="/games" 
                className="group px-8 py-4 border-2 border-primary/30 text-primary font-semibold text-lg rounded-lg hover:bg-primary/10 transition-all duration-300 animate-scale-in"
                style={{animationDelay: '0.8s'}}
              >
                ⚔️ JOIN ARENA
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Games Section */}
      <div className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <GamesList games={games} />
        </div>
      </div>

      {/* Floating Quick Battle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link 
          href="/create" 
          className="group flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 animate-float"
        >
          <span className="text-2xl">⚡</span>
          <span className="hidden sm:block">Quick Battle</span>
        </Link>
      </div>
    </main>
  );
}
