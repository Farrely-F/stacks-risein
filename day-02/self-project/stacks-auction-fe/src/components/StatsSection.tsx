'use client';

import React from 'react';
import { useAuctions } from '@/contexts/AuctionContext';
import { formatStx } from '@/lib/stacks';
import { TrendingUp, Users, Gavel, DollarSign } from 'lucide-react';

const StatsSection: React.FC = () => {
  const { auctions, activeAuctions, endedAuctions } = useAuctions();

  // Calculate total volume (sum of all current bids)
  const totalVolume = auctions.reduce((sum, auction) => sum + auction.currentBid, 0);
  
  // Calculate unique sellers
  const uniqueSellers = new Set(auctions.map(auction => auction.seller)).size;
  
  // Calculate average auction value
  const averageValue = auctions.length > 0 ? totalVolume / auctions.length : 0;

  const stats = [
    {
      icon: Gavel,
      label: 'Active Auctions',
      value: activeAuctions.length.toString(),
      description: 'Live auctions accepting bids',
    },
    {
      icon: DollarSign,
      label: 'Total Volume',
      value: formatStx(totalVolume),
      description: 'Total value of all bids',
    },
    {
      icon: Users,
      label: 'Active Sellers',
      value: uniqueSellers.toString(),
      description: 'Unique auction creators',
    },
    {
      icon: TrendingUp,
      label: 'Average Value',
      value: formatStx(averageValue),
      description: 'Average auction bid value',
    },
  ];

  return (
    <section className="py-16 bg-background border-y-4 border-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-4 transform hover:translate-x-1 transition-transform">
            Platform Statistics
          </h2>
          <p className="text-lg font-bold text-muted-foreground max-w-2xl mx-auto">
            Real-time data from the Stacks Auction marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="bg-background border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary p-3 border-2 border-black">
                    <IconComponent className="h-6 w-6 text-background" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl sm:text-3xl font-black text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm font-black text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Additional metrics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
            <h3 className="text-lg font-black mb-4 border-b-2 border-black pb-2">Auction Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-2 border-black p-2">
                <span className="font-bold">Active Auctions</span>
                <span className="font-black text-primary">{activeAuctions.length}</span>
              </div>
              <div className="flex justify-between items-center border-2 border-black p-2">
                <span className="font-bold">Completed Auctions</span>
                <span className="font-black">{endedAuctions.length}</span>
              </div>
              <div className="flex justify-between items-center border-2 border-black p-2">
                <span className="font-bold">Total Auctions</span>
                <span className="font-black">{auctions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-background border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
            <h3 className="text-lg font-black mb-4 border-b-2 border-black pb-2">Platform Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-2 border-black p-2">
                <span className="font-bold">Success Rate</span>
                <span className="font-black text-primary">
                  {auctions.length > 0 ? Math.round((endedAuctions.length / auctions.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center border-2 border-black p-2">
                <span className="font-bold">Platform Fee</span>
                <span className="font-black">2.5%</span>
              </div>
              <div className="flex justify-between items-center border-2 border-black p-2">
                <span className="font-bold">Network</span>
                <span className="font-black text-primary">Stacks Testnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;