"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Auction, AuctionStatus } from "@/types/auction";
import {
  getAuction,
  getCurrentBlockHeight,
  getNextItemId,
} from "@/lib/contract";
import { useWallet } from "./WalletContext";

interface AuctionContextType {
  auctions: Auction[];
  activeAuctions: Auction[];
  endedAuctions: Auction[];
  loading: boolean;
  error: string | null;
  currentBlockHeight: number;
  refreshAuctions: () => Promise<void>;
  getAuctionById: (id: number) => Auction | undefined;
  isAuctionActive: (auction: Auction) => boolean;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const useAuctions = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error("useAuctions must be used within an AuctionProvider");
  }
  return context;
};

interface AuctionProviderProps {
  children: ReactNode;
}

export const AuctionProvider: React.FC<AuctionProviderProps> = ({
  children,
}) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBlockHeight, setCurrentBlockHeight] = useState(0);
  const { user } = useWallet();

  // Check if auction is active based on contract state
  const isAuctionActive = (auction: Auction): boolean => {
    return auction.isActive;
  };

  // Get active auctions
  const activeAuctions = auctions.filter(isAuctionActive);

  // Get ended auctions
  const endedAuctions = auctions.filter((auction) => !isAuctionActive(auction));

  // Get auction by ID
  const getAuctionById = (id: number): Auction | undefined => {
    return auctions.find((auction) => auction.id === id);
  };

  // Fetch current block height
  const fetchBlockHeight = async () => {
    try {
      const height = await getCurrentBlockHeight();
      setCurrentBlockHeight(height);
    } catch (error) {
      console.error("Error fetching block height:", error);
    }
  };

  // Fetch auctions using the next item ID to determine how many auctions exist
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the next item ID to know how many auctions exist
      let nextId;
      try {
        nextId = await getNextItemId();
      } catch (error) {
        console.warn(
          "getNextItemId failed, falling back to checking first 50 auctions:",
          error
        );
        nextId = 51; // Check first 50 auctions as fallback
      }

      // If nextId is 1, no auctions exist yet
      if (nextId === 1) {
        setAuctions([]);
        return;
      }

      // Fetch all existing auctions (from 1 to nextId - 1)
      const auctionPromises = [];
      for (let i = 1; i < nextId; i++) {
        auctionPromises.push(getAuction(i));
      }

      const auctionResults = await Promise.all(auctionPromises);

      const validAuctions = auctionResults.filter(
        (auction): auction is Auction => auction !== null
      );

      setAuctions(validAuctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch auctions"
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh auctions and block height
  const refreshAuctions = async () => {
    await Promise.all([fetchAuctions(), fetchBlockHeight()]);
  };

  // Initial load
  useEffect(() => {
    refreshAuctions();
  }, []);

  // Refresh block height every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchBlockHeight, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh auctions when user connects/disconnects
  useEffect(() => {
    if (user.isConnected) {
      refreshAuctions();
    }
  }, [user.isConnected]);

  const value: AuctionContextType = {
    auctions,
    activeAuctions,
    endedAuctions,
    loading,
    error,
    currentBlockHeight,
    refreshAuctions,
    getAuctionById,
    isAuctionActive,
  };

  return (
    <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
  );
};
