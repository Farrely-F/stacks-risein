export interface Auction {
  id: number;
  seller: string;
  title: string;
  description: string;
  startingPrice: number; // in microSTX
  currentBid: number; // in microSTX
  highestBidder: string | null;
  endBlock: number;
  isActive: boolean;
  itemClaimed: boolean;
  paymentClaimed: boolean;
  createdAt?: number; // block height when created
}

export interface UserBid {
  auctionId: number;
  bidder: string;
  amount: number; // in microSTX
  blockHeight: number;
}

export interface CreateAuctionForm {
  title: string;
  description: string;
  startingPrice: string; // in STX
  duration: string; // in blocks
}

export interface PlaceBidForm {
  auctionId: number;
  amount: number; // in STX
}

export interface User {
  address: string;
  isConnected: boolean;
  balance: number; // in microSTX
}

export interface AppState {
  user: User;
  auctions: {
    active: Auction[];
    ended: Auction[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    theme: 'light' | 'dark';
    notifications: Notification[];
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

export interface TransactionResult {
  txId: string;
  success: boolean;
  error?: string;
}

import { ClarityValue, PostCondition } from '@stacks/transactions';

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions?: PostCondition[];
}

export interface ReadOnlyFunctionOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  senderAddress: string;
}

// Enum for auction status
export enum AuctionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  CLAIMED = 'claimed'
}

// Enum for transaction status
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}