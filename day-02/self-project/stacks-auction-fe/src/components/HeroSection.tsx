'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useAuctions } from '@/contexts/AuctionContext';
import { ArrowRight, Gavel, Shield, Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { user, connectWallet } = useWallet();
  const { activeAuctions } = useAuctions();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
            Decentralized
            <span className="text-primary block">Item Auctions</span>
            on Stacks
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Auction real-world items with blockchain-verified ownership. NFTs serve as proof of ownership certificates for auctioned items on the Stacks blockchain.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {!user.isConnected ? (
              <>
                <Button 
                  size="lg" 
                  onClick={connectWallet}
                  className="text-lg px-8 py-6 h-auto"
                >
                  Connect Wallet to Start
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/auctions">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 h-auto"
                  >
                    Browse Auctions
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/create">
                  <Button 
                    size="lg"
                    className="text-lg px-8 py-6 h-auto"
                  >
                    Create Your First Auction
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auctions">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 h-auto"
                  >
                    Browse {activeAuctions.length} Active Auctions
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Transparent</h3>
              <p className="text-muted-foreground">
                Smart contracts on Stacks blockchain ensure secure and transparent transactions
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Settlements</h3>
              <p className="text-muted-foreground">
                Automatic bid refunds and instant payments with minimal platform fees (2.5%)
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Gavel className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fair Bidding</h3>
              <p className="text-muted-foreground">
                Time-based auctions with automatic bid validation and anti-manipulation features
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary/20 to-primary/10 opacity-20" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;