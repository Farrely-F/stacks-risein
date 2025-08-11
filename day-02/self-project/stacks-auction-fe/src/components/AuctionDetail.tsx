"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import { useAuctions } from "@/contexts/AuctionContext";
import {
  placeBid,
  claimItem,
  claimPayment,
  endAuction,
  getUserBid,
} from "@/lib/contract";
import { formatStx, parseStx } from "@/lib/stacks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Clock,
  User,
  TrendingUp,
  Gavel,
  Trophy,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { UserBid } from "@/types/auction";

interface AuctionDetailProps {
  auctionId: number;
}

const AuctionDetail: React.FC<AuctionDetailProps> = ({ auctionId }) => {
  const router = useRouter();
  const { user } = useWallet();
  const { auctions, loading, currentBlockHeight, refreshAuctions } =
    useAuctions();

  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isEndingAuction, setIsEndingAuction] = useState(false);
  const [userBid, setUserBid] = useState<UserBid | null>(null);
  const [loadingUserBid, setLoadingUserBid] = useState(false);

  // Find the auction
  const auction = auctions.find((a) => a.id === auctionId);

  // Calculate auction status
  const isActive = auction ? auction.isActive : false;
  const hasReachedEndBlock = auction
    ? currentBlockHeight >= auction.endBlock
    : false;
  const isUserSeller =
    auction && user.address ? auction.seller === user.address : false;
  const isUserHighestBidder =
    auction && user.address ? auction.highestBidder === user.address : false;

  const calculateTimeRemaining = (): string => {
    if (!auction) return "Unknown";

    const blocksRemaining = auction.endBlock - currentBlockHeight;

    if (blocksRemaining <= 0) {
      return `End block ${auction.endBlock} reached`;
    }

    const minutesRemaining = blocksRemaining * 10;
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const daysRemaining = Math.floor(hoursRemaining / 24);

    let timeStr = "";
    if (daysRemaining > 0) {
      timeStr = `${daysRemaining}d ${hoursRemaining % 24}h`;
    } else if (hoursRemaining > 0) {
      timeStr = `${hoursRemaining}h ${minutesRemaining % 60}m`;
    } else {
      timeStr = `${minutesRemaining}m`;
    }

    return `${timeStr} (Block ${auction.endBlock})`;
  };

  const truncateAddress = (
    address: string | null | undefined | unknown
  ): string => {
    if (!address || typeof address !== "string") return "N/A";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // Fetch user's bid for this auction
  useEffect(() => {
    const fetchUserBid = async () => {
      if (!user.address || !auction) return;

      setLoadingUserBid(true);
      try {
        const bid = await getUserBid(auctionId, user.address);
        setUserBid(bid);
      } catch (error) {
        console.error("Error fetching user bid:", error);
      } finally {
        setLoadingUserBid(false);
      }
    };

    fetchUserBid();
  }, [auctionId, user.address, auction]);

  const handlePlaceBid = async () => {
    if (!user || !auction || !bidAmount) return;

    const bidAmountMicroStx = parseStx(bidAmount);

    // Validation
    if (bidAmountMicroStx <= auction.currentBid) {
      toast.error("Bid must be higher than current bid");
      return;
    }

    if (bidAmountMicroStx > user.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsPlacingBid(true);
    try {
      const result = await placeBid(auctionId, bidAmountMicroStx);

      if (result.success) {
        toast.success("Bid placed successfully!");
        setBidAmount("");
        // Refresh auction data
        await refreshAuctions();
        // Refresh user bid
        if (user.address) {
          const updatedBid = await getUserBid(auctionId, user.address);
          setUserBid(updatedBid);
        }
      } else {
        toast.error(result.error || "Failed to place bid");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleClaimItem = async () => {
    if (!user || !auction) return;

    setIsClaiming(true);
    try {
      const result = await claimItem(auctionId);

      if (result.success) {
        toast.success("Item claimed successfully!");
        await refreshAuctions();
      } else {
        toast.error(result.error || "Failed to claim item");
      }
    } catch (error) {
      console.error("Error claiming item:", error);
      toast.error("Failed to claim item");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimPayment = async () => {
    if (!user || !auction) return;

    setIsClaiming(true);
    try {
      const result = await claimPayment(auctionId);

      if (result.success) {
        toast.success("Payment claimed successfully!");
        await refreshAuctions();
      } else {
        toast.error(result.error || "Failed to claim payment");
      }
    } catch (error) {
      console.error("Error claiming payment:", error);
      toast.error("Failed to claim payment");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleEndAuction = async () => {
    if (!user || !auction) return;

    setIsEndingAuction(true);
    try {
      const result = await endAuction(auctionId);

      if (result.success) {
        toast.success("Auction ended successfully!");
        await refreshAuctions();
      } else {
        toast.error(result.error || "Failed to end auction");
      }
    } catch (error) {
      console.error("Error ending auction:", error);
      toast.error("Failed to end auction");
    } finally {
      setIsEndingAuction(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/30 rounded-lg p-8 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Auction Not Found</h3>
          <p className="text-muted-foreground mb-6">
            The auction you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/auctions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Auctions
          </Button>
        </div>
      </div>
    );
  }

  const timeRemaining = calculateTimeRemaining();
  const isEndingSoon = auction.endBlock - currentBlockHeight <= 144; // Less than 24 hours
  const minBidAmount = auction.currentBid + 1000000; // Minimum increment of 1 STX

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Auction Info Card */}
          <Card className="bg-background">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-2xl">{auction.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Seller: {truncateAddress(auction.seller)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>ID: #{auction.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {isActive ? (
                    <Badge variant="default" className="text-center">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-center">
                      Auction Completed
                    </Badge>
                  )}
                  {isEndingSoon && isActive && (
                    <Badge
                      variant="outline"
                      className="text-center border-destructive text-destructive"
                    >
                      Ending Soon
                    </Badge>
                  )}
                  {hasReachedEndBlock && isActive && (
                    <Badge
                      variant="outline"
                      className="text-center border-yellow-500 text-yellow-500"
                    >
                      Needs Manual End (Current Block: {currentBlockHeight})
                    </Badge>
                  )}
                  {!isActive && auction.highestBidder && (
                    <Badge
                      variant="outline"
                      className="text-center border-green-500 text-green-500"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Winner Selected
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {auction.description}
                </p>
              </div>

              <Separator />

              {/* Auction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Starting Price</h4>
                    <p className="text-lg font-semibold">
                      {formatStx(auction.startingPrice)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Current Bid</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatStx(auction.currentBid)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Block Height</span>
                    </h4>
                    <p className="text-lg font-semibold">
                      Current: {currentBlockHeight} / End: {auction.endBlock}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Time Remaining</span>
                    </h4>
                    <p
                      className={`text-lg font-semibold ${
                        isEndingSoon && isActive
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      {timeRemaining}
                    </p>
                  </div>

                  {auction.highestBidder && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <Trophy className="h-4 w-4" />
                        <span>Highest Bidder</span>
                      </h4>
                      <p className="text-lg font-semibold">
                        {truncateAddress(auction.highestBidder)}
                        {isUserHighestBidder && (
                          <Badge variant="default" className="ml-2">
                            You
                          </Badge>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Bid Info */}
          {user.address && userBid && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gavel className="h-5 w-5" />
                  <span>Your Bid</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Bid Amount</span>
                  <span className="font-semibold text-lg">
                    {formatStx(userBid.amount)}
                  </span>
                </div>
                {userBid.amount === auction.currentBid && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      You are currently the highest bidder!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bidding Card */}
          {isActive && !isUserSeller && user.isConnected && (
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Place Bid</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bid Amount (STX)
                  </label>
                  <Input
                    type="number"
                    placeholder={`Min: ${formatStx(minBidAmount)}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={formatStx(minBidAmount)}
                    step="0.000001"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum bid: {formatStx(minBidAmount)}
                  </p>
                </div>

                <Button
                  onClick={handlePlaceBid}
                  disabled={
                    isPlacingBid ||
                    !bidAmount ||
                    parseStx(bidAmount) <= auction.currentBid
                  }
                  className="w-full"
                >
                  {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your balance: {formatStx(user.balance)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Cards for Ended Auctions */}
          {!isActive && user.isConnected && (
            <div className="space-y-4">
              {/* Winner can claim item */}
              {isUserHighestBidder && (
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5" />
                      <span>Congratulations!</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      You won this auction! Claim your item.
                    </p>
                    <Button
                      onClick={handleClaimItem}
                      disabled={isClaiming}
                      className="w-full"
                    >
                      {isClaiming ? "Claiming..." : "Claim Item"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Seller can end auction */}
              {isUserSeller && isActive && hasReachedEndBlock && (
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle>End Auction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Current Block: {currentBlockHeight}
                      <br />
                      End Block: {auction.endBlock}
                      <br />
                      You can now manually end this auction.
                    </p>
                    <Button
                      onClick={handleEndAuction}
                      disabled={isEndingAuction}
                      className="w-full"
                    >
                      {isEndingAuction ? "Ending Auction..." : "End Auction"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Seller can claim payment */}
              {isUserSeller &&
                auction.highestBidder &&
                !auction.paymentClaimed && (
                  <Card className="bg-background">
                    <CardHeader>
                      <CardTitle>Claim Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your auction has ended. Claim your payment of{" "}
                        {formatStx(auction.currentBid)}.
                      </p>
                      <Button
                        onClick={handleClaimPayment}
                        disabled={isClaiming}
                        className="w-full"
                      >
                        {isClaiming ? "Claiming..." : "Claim Payment"}
                      </Button>
                    </CardContent>
                  </Card>
                )}

              {/* Non-winner can claim bid back */}
              {!isUserHighestBidder && userBid && !auction.paymentClaimed && (
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle>Claim Bid Back</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      The auction has ended. You can claim your bid back.
                    </p>
                    <Button
                      onClick={handleClaimPayment}
                      disabled={isClaiming}
                      className="w-full"
                    >
                      {isClaiming ? "Claiming..." : "Claim Bid Back"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Seller Actions */}
          {isUserSeller && isActive && (
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Seller Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  End this auction early if needed.
                </p>
                <Button
                  onClick={handleEndAuction}
                  disabled={isEndingAuction}
                  variant="destructive"
                  className="w-full"
                >
                  {isEndingAuction ? "Ending..." : "End Auction"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Connect Wallet Prompt */}
          {!user.isConnected && (
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Connect Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet to place bids and interact with auctions.
                </p>
                <Button
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
