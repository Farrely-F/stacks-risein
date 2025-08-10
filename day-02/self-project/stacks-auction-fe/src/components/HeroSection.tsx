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
    <section className="relative overflow-hidden bg-background border-b-4 border-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 transform hover:translate-x-1 transition-transform">
            Decentralized
            <span className="text-primary block transform hover:-translate-y-1 transition-transform">Item Auctions</span>
            on Stacks
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 font-bold">
            Auction real-world items with blockchain-verified ownership. NFTs serve as proof of ownership certificates for auctioned items on the Stacks blockchain.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {!user.isConnected ? (
              <>
                <Button 
                  size="lg" 
                  onClick={connectWallet}
                  className="text-lg px-8 py-6 h-auto font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                >
                  Connect Wallet to Start
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/auctions">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 h-auto font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
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
                    className="text-lg px-8 py-6 h-auto font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                  >
                    Create Your First Auction
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auctions">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 h-auto font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                  >
                    Browse {activeAuctions.length} Active Auctions
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 border-4 border-black bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="bg-primary p-3 rounded-none border-2 border-black mb-4">
                <Shield className="h-8 w-8 text-background" />
              </div>
              <h3 className="text-lg font-black mb-2">Secure & Transparent</h3>
              <p className="text-foreground font-medium">
                Smart contracts on Stacks blockchain ensure secure and transparent transactions
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border-4 border-black bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="bg-primary p-3 rounded-none border-2 border-black mb-4">
                <Zap className="h-8 w-8 text-background" />
              </div>
              <h3 className="text-lg font-black mb-2">Instant Settlements</h3>
              <p className="text-foreground font-medium">
                Automatic bid refunds and instant payments with minimal platform fees (2.5%)
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border-4 border-black bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="bg-primary p-3 rounded-none border-2 border-black mb-4">
                <Gavel className="h-8 w-8 text-background" />
              </div>
              <h3 className="text-lg font-black mb-2">Fair Bidding</h3>
              <p className="text-foreground font-medium">
                Time-based auctions with automatic bid validation and anti-manipulation features
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;