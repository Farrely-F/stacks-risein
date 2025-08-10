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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Platform Statistics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time data from the Stacks Auction marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Additional metrics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Auction Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Auctions</span>
                <span className="font-medium text-green-600">{activeAuctions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed Auctions</span>
                <span className="font-medium">{endedAuctions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Auctions</span>
                <span className="font-medium">{auctions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-background rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium text-green-600">
                  {auctions.length > 0 ? Math.round((endedAuctions.length / auctions.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-medium">2.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium text-orange-600">Stacks Testnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;