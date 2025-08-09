"use client";

import { useStacks } from "@/hooks/use-stacks";
import { formatStx } from "@/lib/stx-utils";
import { Move } from "@/lib/contract";
import { useState } from "react";
import Link from "next/link";

export default function CreateGame() {
  const { userData, stxBalance, handleCreateGame, connectWallet } = useStacks();
  const [betAmount, setBetAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [firstMove, setFirstMove] = useState<Move>(Move.X);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betAmount || parseFloat(betAmount) <= 0) return;

    setIsCreating(true);
    try {
      // Convert to microSTX (integer) for blockchain transaction
      const betAmountMicroStx = Math.floor(parseFloat(betAmount) * 1000000);
      // For creating a new game, we start with the first move at center (index 4) with selected move
      await handleCreateGame(betAmountMicroStx, 4, firstMove);
      setBetAmount("");
    } catch (error) {
      console.error("Failed to create game:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const setMaxAmount = () => {
    if (stxBalance) {
      setBetAmount(formatStx(stxBalance).toString());
    }
  };

  const quickAmounts = [0.1, 0.5, 1, 5, 10];

  if (!userData) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-danger/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-warning/20 rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="relative z-10 text-center bg-card border border-border rounded-2xl p-12 max-w-md mx-4">
          <div className="text-6xl mb-6 animate-float">🔒</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">Connect your wallet to enter the quantum battleground and create epic battles!</p>
          <button
            onClick={connectWallet}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-all duration-300"
          >
            🔗 Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-in">
            <div className="text-6xl mb-4 animate-float">⚔️</div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              CREATE BATTLE
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Set your stake and challenge the quantum realm. 
              <span className="text-primary font-semibold">Victory awaits the bold!</span>
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-card border border-border rounded-lg p-8 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Balance Display */}
              <div className="text-center p-6 bg-card rounded-lg border border-primary/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground font-medium">WALLET BALANCE</span>
                </div>
                <div className="text-3xl font-bold text-primary font-mono">
                  {stxBalance ? formatStx(stxBalance) : '0.000000'} STX
                </div>
              </div>

              {/* Bet Amount Input */}
              <div className="space-y-4">
                <label htmlFor="betAmount" className="block text-lg font-bold text-foreground mb-4">
                  ⚡ Battle Stake (STX)
                </label>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setBetAmount(amount.toString())}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                        betAmount === amount.toString()
                          ? 'bg-primary text-white border border-primary'
                          : 'bg-card border border-border text-card-foreground hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <input
                    id="betAmount"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full px-6 py-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg font-mono text-center text-card-foreground transition-all duration-300 hover:border-primary/50"
                    placeholder="Enter custom amount"
                    required
                  />
                  <button
                    type="button"
                    onClick={setMaxAmount}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm bg-accent text-white font-bold rounded-lg hover:bg-accent/80 transition-all duration-300"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* First Move Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-bold text-foreground mb-4">
                  🎯 Choose Your Symbol
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFirstMove(Move.X)}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                      firstMove === Move.X
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-card border-border text-card-foreground hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    <div className="text-4xl mb-2">❌</div>
                    <div className="font-bold text-lg">Play as X</div>
                    <div className="text-sm text-muted-foreground">You go first</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFirstMove(Move.O)}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                      firstMove === Move.O
                        ? 'bg-secondary/20 border-secondary text-secondary'
                        : 'bg-card border-border text-card-foreground hover:border-secondary/50 hover:text-secondary'
                    }`}
                  >
                    <div className="text-4xl mb-2">⭕</div>
                    <div className="font-bold text-lg">Play as O</div>
                    <div className="text-sm text-muted-foreground">Opponent goes first</div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isCreating || !betAmount || parseFloat(betAmount) <= 0}
                  className="w-full py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Battle...
                    </div>
                  ) : (
                    "⚔️ Create Battle"
                  )}
                </button>
                
                <Link 
                  href="/"
                  className="block text-center py-3 border-2 border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300"
                >
                  🏠 Return to Arena
                </Link>
              </div>
            </form>
          </div>

          {/* Battle Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-in" style={{animationDelay: '0.3s'}}>
            <div className="bg-card border border-success/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-success mb-1">Strategic</h3>
              <p className="text-xs text-muted-foreground">Plan your moves carefully</p>
            </div>
            <div className="bg-card border border-warning/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-warning mb-1">Fast-Paced</h3>
              <p className="text-xs text-muted-foreground">Quick battles, instant rewards</p>
            </div>
            <div className="bg-card border border-primary/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-bold text-primary mb-1">Rewarding</h3>
              <p className="text-xs text-muted-foreground">Winner takes all the stakes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
