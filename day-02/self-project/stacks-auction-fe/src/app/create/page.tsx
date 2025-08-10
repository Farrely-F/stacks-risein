import React from "react";
import Header from "@/components/Header";
import CreateAuctionForm from "@/components/CreateAuctionForm";

const CreateAuctionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Auction</h1>
            <p className="text-muted-foreground">
              List your item for auction on the Stacks blockchain. Set your
              terms and let bidders compete for your item.
            </p>
          </div>
          <CreateAuctionForm />
        </div>
      </main>
    </div>
  );
};

export default CreateAuctionPage;
