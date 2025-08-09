"use client";

import { Game, Move } from "@/lib/contract";
import { GameBoard } from "./game-board";
import { abbreviateAddress, explorerAddress, formatStx } from "@/lib/stx-utils";
import Link from "next/link";
import { useStacks } from "@/hooks/use-stacks";
import { useState } from "react";

interface PlayGameProps {
  game: Game;
}

export function PlayGame({ game }: PlayGameProps) {
  const { userData, handleJoinGame, handlePlayGame } = useStacks();
  const [board, setBoard] = useState(game.board);
  const [playedMoveIndex, setPlayedMoveIndex] = useState(-1);
  if (!userData) return null;

  const isPlayerOne =
    userData.profile.stxAddress.testnet === game["player-one"];
  const isPlayerTwo =
    userData.profile.stxAddress.testnet === game["player-two"];

  // Determine which symbol each player is using based on the board state
  // If there's only one move on the board, that's the creator's symbol
  const movesOnBoard = game.board.filter(cell => cell !== Move.EMPTY);
  const playerOneSymbol = movesOnBoard.length > 0 ? movesOnBoard[0] : Move.X;
  const playerTwoSymbol = playerOneSymbol === Move.X ? Move.O : Move.X;

  const isJoinable = game["player-two"] === null && !isPlayerOne;
  const isJoinedAlready = isPlayerOne || isPlayerTwo;
  
  // Determine next move based on whose turn it is and their symbol
  const nextMove = game["is-player-one-turn"] ? playerOneSymbol : playerTwoSymbol;
  const isMyTurn =
    (game["is-player-one-turn"] && isPlayerOne) ||
    (!game["is-player-one-turn"] && isPlayerTwo);
  const isGameOver = game.winner !== null;

  function onCellClick(index: number) {
    const tempBoard = [...game.board];
    tempBoard[index] = nextMove;
    setBoard(tempBoard);
    setPlayedMoveIndex(index);
  }

  return (
    <div className="flex flex-col gap-4 w-[400px]">
      <GameBoard
        board={board}
        onCellClick={onCellClick}
        nextMove={nextMove}
        cellClassName="size-32 text-6xl"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Stake Amount: </span>
          <span className="text-card-foreground">{formatStx(game["bet-amount"])} STX</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Player One: </span>
          <Link
              href={explorerAddress(game["player-one"])}
              target="_blank"
              className="hover:underline text-primary hover:text-primary/80"
            >
              {abbreviateAddress(game["player-one"])}
            </Link>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Player Two: </span>
          {game["player-two"] ? (
            <Link
              href={explorerAddress(game["player-two"])}
              target="_blank"
              className="hover:underline text-primary hover:text-primary/80"
            >
              {abbreviateAddress(game["player-two"])}
            </Link>
          ) : (
            <span className="text-muted-foreground">Nobody</span>
          )}
        </div>

        {game["winner"] && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Winner: </span>
            <Link
              href={explorerAddress(game["winner"])}
              target="_blank"
              className="hover:underline text-success hover:text-success/80 font-semibold"
            >
              {abbreviateAddress(game["winner"])}
            </Link>
          </div>
        )}
      </div>

      {isJoinable && (
        <button
          onClick={() => handleJoinGame(game.id, playedMoveIndex, playerTwoSymbol)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Join Game
        </button>
      )}

      {isMyTurn && (
        <button
          onClick={() => handlePlayGame(game.id, playedMoveIndex, nextMove)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Play
        </button>
      )}

      {isJoinedAlready && !isMyTurn && !isGameOver && (
        <div className="text-muted-foreground">
          Waiting for opponent to play...
        </div>
      )}
    </div>
  );
}
