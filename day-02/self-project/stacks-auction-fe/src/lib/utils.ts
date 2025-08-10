import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Truncate Stacks address to a readable format
export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

// Format date from block height (assuming 10 min block time)
export function formatBlockDate(blockHeight: number): string {
  const now = Date.now();
  const blockTime = 10 * 60 * 1000; // 10 minutes in milliseconds
  const timestamp = now + blockHeight * blockTime;
  return new Date(timestamp).toLocaleDateString();
}

// Calculate remaining blocks
export function calculateBlocksRemaining(endBlock: number, currentBlock: number): number {
  return Math.max(0, endBlock - currentBlock);
}
