"use client";

import React from "react";
import Link from "next/link";
import { useAuctions } from "@/contexts/AuctionContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatStx } from "@/lib/stacks";
import { Clock, User, ArrowRight } from "lucide-react";
import { Auction } from "@/types/auction";

const FeaturedAuctions: React.FC = () => {
  const { activeAuctions, loading, currentBlockHeight } = useAuctions();

  // Get featured auctions (first 6 active auctions)
  const featuredAuctions = activeAuctions.slice(0, 6);

  const calculateTimeRemaining = (endBlock: number): string => {
    const blocksRemaining = endBlock - currentBlockHeight;

    // Approximate: 1 block ≈ 10 minutes
    const minutesRemaining = blocksRemaining * 10;
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const daysRemaining = Math.floor(hoursRemaining / 24);

    if (blocksRemaining <= 0) {
      return "Target end block reached";
    } else if (daysRemaining > 0) {
      return `${daysRemaining}d ${hoursRemaining % 24}h until target end block`;
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining}h ${
        minutesRemaining % 60
      }m until target end block`;
    } else {
      return `${minutesRemaining}m until target end block`;
    }
  };

  const truncateAddress = (
    address: string | null | undefined | unknown
  ): string => {
    if (!address || typeof address !== "string") return "N/A";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const AuctionCard: React.FC<{ auction: Auction }> = ({ auction }) => {
    const timeRemaining = calculateTimeRemaining(auction.endBlock);
    const isEnding = auction.endBlock - currentBlockHeight <= 144; // Less than 24 hours

    return (
      <Card className="group border-4 border-black bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
        <CardHeader className="pb-3 border-b-2 border-black">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-black text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {auction.title}
              </h3>
              <p className="text-sm font-bold text-muted-foreground line-clamp-2">
                {auction.description}
              </p>
            </div>
            {isEnding && (
              <Badge
                variant="destructive"
                className="ml-2 font-bold border-2 border-black"
              >
                Ending Soon
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 flex-1">
          {/* Seller Info */}
          <div className="flex items-center space-x-2 text-sm font-bold border-2 border-black p-2">
            <User className="h-4 w-4" />
            <span>Seller: {truncateAddress(auction.seller)}</span>
          </div>

          {/* Bid Information */}
          <div className="space-y-2 border-2 border-black p-3">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="text-sm font-bold">Current Bid</span>
              <span className="font-black text-lg text-primary">
                {formatStx(auction.currentBid)}
              </span>
            </div>

            {auction.highestBidder && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold">Highest Bidder</span>
                <span className="text-sm font-black">
                  {truncateAddress(auction.highestBidder)}
                </span>
              </div>
            )}
          </div>

          {/* Time Remaining */}
          <div className="flex items-center justify-between border-2 border-black p-2">
            <div className="flex items-center space-x-2 text-sm font-bold">
              <Clock className="h-4 w-4" />
              <span>Time remaining</span>
            </div>
            <span
              className={`font-black ${
                isEnding ? "text-destructive" : "text-primary"
              }`}
            >
              {timeRemaining}
            </span>
          </div>
        </CardContent>

        <CardFooter className="border-t-2 border-black pt-4">
          <Link href={`/auction/${auction.id}`} className="w-full">
            <Button className="w-full font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
              View Auction
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  const LoadingSkeleton: React.FC = () => (
    <Card className="border-4 border-black bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-2 border-black">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Skeleton className="h-8 w-full border-2 border-black" />
        <div className="space-y-2 border-2 border-black p-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="h-8 w-full border-2 border-black" />
      </CardContent>
      <CardFooter className="border-t-2 border-black pt-4">
        <Skeleton className="h-10 w-full border-2 border-black" />
      </CardFooter>
    </Card>
  );

  return (
    <section className="py-16 border-b-4 border-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-4 transform hover:translate-x-1 transition-transform">
            Featured Auctions
          </h2>
          <p className="text-lg font-bold text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover unique items from sellers around the world. Each winning
            bid includes an NFT certificate as proof of ownership.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : featuredAuctions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>

            {activeAuctions.length > 6 && (
              <div className="text-center">
                <Link href="/auctions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                  >
                    View All {activeAuctions.length} Auctions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="border-4 border-black bg-background p-8 max-w-md mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Gavel className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-black mb-2">No Active Auctions</h3>
              <p className="font-bold text-muted-foreground mb-6">
                Be the first to create an auction on the platform!
              </p>
              <Link href="/create">
                <Button className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                  Create First Auction
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Gavel: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

export default FeaturedAuctions;
