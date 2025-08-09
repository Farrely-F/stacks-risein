"use client";

import { useStacks } from "@/hooks/use-stacks";
import { abbreviateAddress } from "@/lib/stx-utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { userData, connectWallet, disconnectWallet } = useStacks();
  const pathname = usePathname();

  return (
    <nav className="bg-card/80 border-b border-border backdrop-blur-xl sticky top-0 z-50 animate-slide-in">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group hover-glow rounded-lg px-3 py-2 transition-all duration-300"
          >
            <div className="text-3xl animate-float">⚡</div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">
                QUANTUM
              </span>
              <span className="text-xs text-primary font-medium tracking-wider">
                TIC-TAC-TOE
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/" 
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
                pathname === '/' 
                  ? 'text-primary bg-primary/10 border border-primary/30' 
                  : 'text-card-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <span className="relative z-10">🏠 Arena</span>
            </Link>
            <Link 
              href="/create" 
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
                pathname === '/create' 
                  ? 'text-primary bg-primary/10 border border-primary/30' 
                  : 'text-card-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <span className="relative z-10">⚔️ Battle</span>
            </Link>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center gap-3">
            {userData ? (
              <div className="flex items-center gap-3">
                {/* User Address */}
                <div className="bg-card px-4 py-2 rounded-lg border border-primary/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-primary">
                      {abbreviateAddress(userData.profile.stxAddress.testnet)}
                    </span>
                  </div>
                </div>
                
                {/* Disconnect Button */}
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="px-4 py-2 rounded-lg bg-danger text-white font-medium hover:bg-danger/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-danger/50"
                >
                  🚪 Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={connectWallet}
                className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                🔗 Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
