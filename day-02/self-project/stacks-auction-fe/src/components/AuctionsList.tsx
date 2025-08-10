"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuctions } from "@/contexts/AuctionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatStx } from "@/lib/stacks";
import {
  Search,
  Clock,
  User,
  TrendingUp,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Auction } from "@/types/auction";

type SortOption =
  | "newest"
  | "oldest"
  | "price-high"
  | "price-low"
  | "ending-soon";
type FilterTab = "all" | "active" | "ended";

const AuctionsList: React.FC = () => {
  const {
    auctions,
    activeAuctions,
    endedAuctions,
    loading,
    currentBlockHeight,
  } = useAuctions();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [activeTab, setActiveTab] = useState<FilterTab>("active");

  const calculateTimeRemaining = (endBlock: number): string => {
    const blocksRemaining = endBlock - currentBlockHeight;
    if (blocksRemaining <= 0) return "Ended";

    const minutesRemaining = blocksRemaining * 10;
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const daysRemaining = Math.floor(hoursRemaining / 24);

    if (daysRemaining > 0) {
      return `${daysRemaining}d ${hoursRemaining % 24}h`;
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining}h ${minutesRemaining % 60}m`;
    } else {
      return `${minutesRemaining}m`;
    }
  };

  const truncateAddress = (
    address: string | null | undefined | unknown
  ): string => {
    if (!address || typeof address !== "string") return "N/A";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // Get auctions based on active tab
  const getAuctionsByTab = (tab: FilterTab): Auction[] => {
    switch (tab) {
      case "active":
        return activeAuctions;
      case "ended":
        return endedAuctions;
      default:
        return auctions;
    }
  };

  // Filter and sort auctions
  const filteredAndSortedAuctions = useMemo(() => {
    let filtered = getAuctionsByTab(activeTab);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          auction.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.id - a.id; // Assuming higher ID means newer
        case "oldest":
          return a.id - b.id;
        case "price-high":
          return b.currentBid - a.currentBid;
        case "price-low":
          return a.currentBid - b.currentBid;
        case "ending-soon":
          return a.endBlock - b.endBlock;
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeTab, searchTerm, sortBy, activeAuctions, endedAuctions, auctions]);

  const AuctionCard: React.FC<{ auction: Auction }> = ({ auction }) => {
    const timeRemaining = calculateTimeRemaining(auction.endBlock);
    const isEnding = auction.endBlock - currentBlockHeight <= 144;
    const isActive = currentBlockHeight < auction.endBlock && auction.isActive;

    return (
      <Card className="bg-background group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {auction.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {auction.description}
              </p>
            </div>
            <div className="flex flex-col space-y-1 ml-2">
              {isActive ? (
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="secondary">Ended</Badge>
              )}
              {isEnding && isActive && (
                <Badge variant="destructive" className="text-xs">
                  Ending Soon
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Seller Info */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Seller: {truncateAddress(auction.seller)}</span>
          </div>

          {/* Bid Information */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {auction.currentBid > auction.startingPrice
                  ? "Current Bid"
                  : "Starting Price"}
              </span>
              <span className="font-semibold text-lg">
                {formatStx(auction.currentBid)}
              </span>
            </div>

            {/* Show minimum bid for active auctions */}
            {isActive && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Min Next Bid
                </span>
                <span className="text-sm font-medium text-primary">
                  {formatStx(auction.currentBid + 1000000)}
                </span>
              </div>
            )}

            {auction.highestBidder && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Highest Bidder
                </span>
                <span className="text-sm font-medium">
                  {truncateAddress(auction.highestBidder)}
                </span>
              </div>
            )}
          </div>

          {/* Time Information */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{isActive ? "Time remaining" : "Ended"}</span>
            </div>
            <span
              className={`font-medium ${
                isEnding && isActive ? "text-destructive" : "text-foreground"
              }`}
            >
              {timeRemaining}
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <Link href={`/auction/${auction.id}`} className="w-full">
            <Button className="w-full group-hover:bg-primary/90 transition-colors">
              {isActive ? "View & Bid" : "View Details"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  const LoadingSkeleton: React.FC = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading state for filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full sm:w-80" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>

        {/* Loading state for tabs */}
        <Skeleton className="h-10 w-80" />

        {/* Loading state for auction cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search auctions by title, description, or seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: SortOption) => setSortBy(value)}
        >
          <SelectTrigger className="w-full sm:w-48 h-full">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Highest Price</SelectItem>
            <SelectItem value="price-low">Lowest Price</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FilterTab)}
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Active ({activeAuctions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="ended" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Ended ({endedAuctions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>All ({auctions.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredAndSortedAuctions.length > 0 ? (
            <>
              {/* Results count */}
              <div className="mb-6 text-sm text-muted-foreground">
                Showing {filteredAndSortedAuctions.length} auction
                {filteredAndSortedAuctions.length !== 1 ? "s" : ""}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>

              {/* Auction Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedAuctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted/30 rounded-lg p-8 max-w-md mx-auto">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? "No auctions found" : "No auctions available"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? `No auctions match your search for "${searchTerm}"`
                    : `No ${
                        activeTab === "all" ? "" : activeTab
                      } auctions at the moment`}
                </p>
                {searchTerm ? (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                ) : (
                  <Link href="/create">
                    <Button>
                      Create First Auction
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuctionsList;
