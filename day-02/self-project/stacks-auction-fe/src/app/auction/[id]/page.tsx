import React from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AuctionDetail from "@/components/AuctionDetail";

interface AuctionPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AuctionPage: React.FC<AuctionPageProps> = async ({ params }) => {
  const auctionId = parseInt((await params).id);

  // Validate auction ID
  if (isNaN(auctionId) || auctionId < 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AuctionDetail auctionId={auctionId} />
      </main>
    </div>
  );
};

export default AuctionPage;
