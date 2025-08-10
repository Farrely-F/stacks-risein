import Header from '@/components/Header';
import AuctionsList from '@/components/AuctionsList';

export default function AuctionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            All Auctions
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse and bid on active NFT auctions
          </p>
        </div>
        
        <AuctionsList />
      </main>
    </div>
  );
}