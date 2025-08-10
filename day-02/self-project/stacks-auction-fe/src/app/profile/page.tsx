"use client";

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useAuctions } from "@/contexts/AuctionContext";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatStx } from "@/lib/stacks";
import { truncateAddress } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Package, Trophy, Clock } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useWallet();
  const { auctions } = useAuctions();

  // Filter auctions for the current user
  const userAuctions = auctions.filter(
    (auction) => auction.seller === user.address
  );
  const activeUserAuctions = userAuctions.filter((auction) => auction.isActive);
  const endedUserAuctions = userAuctions.filter((auction) => !auction.isActive);

  // Filter auctions where user is the highest bidder
  const wonAuctions = auctions.filter(
    (auction) =>
      !auction.isActive &&
      auction.highestBidder === user.address &&
      !auction.itemClaimed
  );

  // Filter auctions where user has placed bids
  const participatedAuctions = auctions.filter(
    (auction) =>
      auction.highestBidder === user.address ||
      auction.currentBid > auction.startingPrice
  );

  if (!user.isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">
              Please connect your wallet
            </h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Profile
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {truncateAddress(user.address)}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Balance: {formatStx(user.balance)}
            </Badge>
          </div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="my-auctions" className="space-y-6">
          <TabsList>
            <TabsTrigger
              value="my-auctions"
              className="flex items-center gap-2"
            >
              <Gavel className="h-4 w-4" />
              My Auctions
            </TabsTrigger>
            <TabsTrigger value="won-items" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Won Items
            </TabsTrigger>
            <TabsTrigger
              value="participated"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Participated
            </TabsTrigger>
          </TabsList>

          {/* My Auctions Tab */}
          <TabsContent value="my-auctions">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Active Auctions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Active Auctions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeUserAuctions.length === 0 ? (
                    <p className="text-muted-foreground">No active auctions</p>
                  ) : (
                    <div className="space-y-4">
                      {activeUserAuctions.map((auction) => (
                        <Link
                          key={auction.id}
                          href={`/auction/${auction.id}`}
                          className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{auction.title}</h3>
                            <Badge>{formatStx(auction.currentBid)}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {auction.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ended Auctions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-primary" />
                    Ended Auctions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {endedUserAuctions.length === 0 ? (
                    <p className="text-muted-foreground">No ended auctions</p>
                  ) : (
                    <div className="space-y-4">
                      {endedUserAuctions.map((auction) => (
                        <Link
                          key={auction.id}
                          href={`/auction/${auction.id}`}
                          className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{auction.title}</h3>
                            <Badge variant="secondary">
                              {formatStx(auction.currentBid)} STX
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {auction.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Won Items Tab */}
          <TabsContent value="won-items">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Won Auctions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wonAuctions.length === 0 ? (
                  <p className="text-muted-foreground">No won auctions yet</p>
                ) : (
                  <div className="space-y-4">
                    {wonAuctions.map((auction) => (
                      <Link
                        key={auction.id}
                        href={`/auction/${auction.id}`}
                        className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{auction.title}</h3>
                          <Badge variant="secondary">
                            Won for {formatStx(auction.currentBid)} STX
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {auction.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participated Tab */}
          <TabsContent value="participated">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Participated Auctions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {participatedAuctions.length === 0 ? (
                  <p className="text-muted-foreground">
                    No auction participation yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {participatedAuctions.map((auction) => (
                      <Link
                        key={auction.id}
                        href={`/auction/${auction.id}`}
                        className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{auction.title}</h3>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant={
                                auction.isActive ? "default" : "secondary"
                              }
                            >
                              Current: {formatStx(auction.currentBid)} STX
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {auction.highestBidder === user.address
                                ? "Your bid is highest"
                                : "Not highest bidder"}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {auction.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
