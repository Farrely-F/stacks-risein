"use client";

import { Game, Move } from "@/lib/contract";
import Link from "next/link";
import { GameBoard } from "./game-board";
import { useStacks } from "@/hooks/use-stacks";
import { formatStx } from "@/lib/stx-utils";
import { useMemo } from "react";

interface GamesListProps {
  games: Game[];
}

export function GamesList({ games }: GamesListProps) {
  const { userData } = useStacks();

  const { userGames, joinableGames, endedGames } = useMemo(() => {
    const userAddress = userData?.profile.stxAddress.testnet;

    const userGames = games.filter(
      (game) =>
        (game["player-one"] === userAddress ||
          game["player-two"] === userAddress) &&
        game.winner === null
    );

    const joinableGames = games.filter(
      (game) =>
        game.winner === null &&
        game["player-one"] !== userAddress &&
        game["player-two"] === null
    );

    const endedGames = games.filter(
      (game) => game.winner !== null
    );

    return { userGames, joinableGames, endedGames };
  }, [games, userData]);

  const EmptyState = ({ title, description, buttonText }: { title: string; description: string; buttonText: string }) => (
    <div className="bg-card border border-border rounded-lg p-12 text-center animate-scale-in">
      <div className="text-6xl mb-4 animate-float">🎮</div>
      <h3 className="text-xl font-bold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link
        href="/create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300"
      >
        ⚔️ {buttonText}
      </Link>
    </div>
  );

  const GameCard = ({ game, type }: { game: Game; type: 'active' | 'joinable' | 'ended' }) => {
    // Determine which symbol each player is using based on the board state
    const movesOnBoard = game.board.filter(cell => cell !== Move.EMPTY);
    const playerOneSymbol = movesOnBoard.length > 0 ? movesOnBoard[0] : Move.X;
    const playerTwoSymbol = playerOneSymbol === Move.X ? Move.O : Move.X;
    const nextSymbol = game["is-player-one-turn"] ? playerOneSymbol : playerTwoSymbol;
    const nextSymbolDisplay = nextSymbol === Move.X ? "⚡" : "🔥";

    const getStatusInfo = () => {
      switch (type) {
        case 'active':
          return {
            statusText: `Next: ${nextSymbolDisplay}`,
            statusColor: 'text-primary',
            borderColor: 'border-primary/30',
            glowColor: 'hover:shadow-primary/20'
          };
        case 'joinable':
          return {
            statusText: "🔥 Ready to Join!",
            statusColor: 'text-success',
            borderColor: 'border-success/30',
            glowColor: 'hover:shadow-success/20'
          };
        case 'ended':
          return {
            statusText: game.winner ? `🏆 Winner: ${game.winner}` : "🤝 Draw",
            statusColor: 'text-warning',
            borderColor: 'border-warning/30',
            glowColor: 'hover:shadow-warning/20'
          };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <Link
        key={game.id}
        href={`/game/${game.id}`}
        className={`group block bg-card border ${statusInfo.borderColor} rounded-lg p-6 hover:border-opacity-60 transition-all duration-300 hover:scale-105 ${statusInfo.glowColor} hover:shadow-lg animate-scale-in ${type === 'ended' ? 'opacity-75' : ''}`}
      >
        <div className="mb-6">
          <GameBoard
            board={game.board}
            cellClassName="size-8 text-xl"
          />
        </div>
        
        <div className="space-y-3">
          {/* Bet Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stake:</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-card-foreground">{formatStx(game["bet-amount"])}</span>
              <span className="text-sm text-muted-foreground">STX</span>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={`text-sm font-medium ${statusInfo.statusColor}`}>
              {statusInfo.statusText}
            </span>
          </div>
          
          {/* Game ID */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Game ID:</span>
            <span className="text-sm font-mono text-card-foreground">#{game.id}</span>
          </div>
        </div>
        
        {/* Hover Effect */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="text-center text-sm text-primary mt-2 font-medium">
            {type === 'joinable' ? '🎯 Join Battle' : type === 'active' ? '⚡ Continue Game' : '📊 View Results'}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full space-y-16">
      {/* Active Games */}
      {userData && (
        <section className="animate-slide-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">⚡</div>
            <h2 className="text-3xl font-bold text-foreground">Active Battles</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent" />
          </div>
          
          {userGames.length === 0 ? (
            <EmptyState 
              title="No Active Battles" 
              description="You don't have any ongoing games. Start a new battle to begin!" 
              buttonText="Start New Battle"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGames.map((game, index) => (
                <GameCard key={`your-game-${index}`} game={game} type="active" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Joinable Games */}
      <section className="animate-slide-in" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center gap-3 mb-8">
          <div className="text-3xl">🎯</div>
          <h2 className="text-3xl font-bold text-foreground">Open Challenges</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-secondary to-transparent" />
        </div>
        
        {joinableGames.length === 0 ? (
          <EmptyState 
            title="No Open Challenges" 
            description="No battles are waiting for opponents. Create one and let others join!" 
            buttonText="Create Challenge"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinableGames.map((game, index) => (
              <GameCard key={`joinable-game-${index}`} game={game} type="joinable" />
            ))}
          </div>
        )}
      </section>

      {/* Ended Games */}
      {endedGames.length > 0 && (
        <section className="animate-slide-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">🏆</div>
            <h2 className="text-3xl font-bold text-foreground">Battle History</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-warning to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedGames.map((game, index) => (
              <GameCard key={`ended-game-${index}`} game={game} type="ended" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
