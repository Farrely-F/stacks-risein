"use client";

import { Move } from "@/lib/contract";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  board: Move[];
  onCellClick?: (index: number) => void;
  nextMove?: Move;
  cellClassName?: string;
}

export function GameBoard({
  board,
  onCellClick,
  nextMove,
  cellClassName,
}: GameBoardProps) {
  const renderCell = (move: Move, index: number) => {
    const isClickable = onCellClick && move === Move.EMPTY;
    const showPreview = isClickable && nextMove;
    const isWinningCell = false; // TODO: Add winning line detection

    const getCellContent = () => {
      if (move === Move.X) return "⚡";
      if (move === Move.O) return "🔥";
      if (showPreview && move === Move.EMPTY) {
        return (
          <span className="text-muted-foreground opacity-50 animate-pulse">
            {nextMove === Move.X ? "⚡" : "🔥"}
          </span>
        );
      }
      return null;
    };

    const getCellStyles = () => {
      let baseStyles = "bg-card/50 backdrop-blur-sm border border-border flex items-center justify-center font-bold text-2xl transition-all duration-300 relative overflow-hidden group";
      
      if (isClickable) {
        baseStyles += " hover:border-primary hover:bg-primary/10 cursor-pointer hover:scale-105";
      } else {
        baseStyles += " cursor-not-allowed";
      }
      
      if (move === Move.X) {
        baseStyles += " border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 text-primary";
      } else if (move === Move.O) {
        baseStyles += " border-secondary/50 bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary";
      }
      
      if (isWinningCell) {
        baseStyles += " animate-pulse border-success bg-success/20";
      }
      
      return baseStyles;
    };

    return (
      <button
        key={index}
        className={cn(getCellStyles(), cellClassName)}
        onClick={() => isClickable && onCellClick(index)}
        disabled={!isClickable}
      >
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Cell Content */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {getCellContent()}
        </div>
        
        {/* Hover Effect */}
        {isClickable && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 border border-primary rounded-lg animate-pulse" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative">
      {/* Board Container */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-card/30 backdrop-blur-md border border-border rounded-lg bg-gradient-to-br from-card to-background w-fit">
        {board.map((move, index) => renderCell(move, index))}
      </div>
      
      {/* Board Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-lg blur-xl -z-10 animate-pulse" />
    </div>
  );
}
