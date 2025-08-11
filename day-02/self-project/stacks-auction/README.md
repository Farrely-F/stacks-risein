# Stacks Auction - Decentralized NFT Auction Platform

A decentralized auction platform built on the Stacks blockchain that enables users to create, bid on, and trade NFT-based items with transparent and secure smart contract functionality.

## 🎯 App Overview

Stacks Auction is a fully decentralized auction dApp that leverages the Stacks blockchain to provide a trustless marketplace for NFT auctions. The platform combines the security of Bitcoin with the flexibility of smart contracts, enabling users to:

- **Create Auctions**: Mint NFTs and list them for auction with customizable duration and starting prices
- **Place Bids**: Participate in live auctions with automatic bid validation and refund mechanisms
- **Claim Items**: Winners can securely claim their NFTs after auction completion
- **Claim Payments**: Sellers receive payments minus platform fees automatically
- **Platform Management**: Decentralized fee collection and admin functions

### Key Features

- 🔒 **Secure Smart Contracts**: Built with Clarity for maximum security and transparency
- 💰 **Automatic Payments**: Instant STX transfers with platform fee deduction (2.5%)
- 🎨 **NFT Integration**: Native NFT minting and transfer functionality
- ⏰ **Time-based Auctions**: Block-height based auction duration system
- 🔄 **Bid Refunds**: Automatic refund system for outbid participants
- 📊 **Transparent Tracking**: All auction data stored on-chain

## 🚀 MVP (Minimum Viable Product)

### Core Smart Contract Functions

#### 1. Auction Management

- **`create-auction`**: Create new auctions with NFT minting

  - Input validation for title, description, price, and duration
  - Automatic NFT minting to contract
  - Configurable auction duration (minimum 144 blocks)

- **`end-auction`**: Manually end auctions after duration
  - Validates auction completion conditions
  - Updates auction status to inactive

#### 2. Bidding System

- **`place-bid`**: Submit bids with validation
  - Minimum bid increment enforcement (1 STX)
  - Automatic refund to previous highest bidder
  - Prevention of self-bidding
  - Bid tracking per user

#### 3. Claiming Mechanism

- **`claim-item`**: Winners claim NFTs

  - Ownership verification
  - NFT transfer from contract to winner
  - Prevents double claiming

- **`claim-payment`**: Sellers claim payments
  - Platform fee deduction (2.5%)
  - STX transfer to seller
  - Payment tracking

#### 4. Read-Only Functions

- **`get-auction`**: Retrieve auction details
- **`get-user-bid`**: Check user's bid for specific auction
- **`get-owner`**: NFT ownership verification
- **`get-platform-earnings`**: Platform fee tracking

#### 5. Admin Functions

- **`withdraw-platform-earnings`**: Owner-only fee withdrawal
- **`set-platform-fee-rate`**: Adjustable platform fees (max 10%)

### Data Structures

```clarity
;; Auction Structure
{
  seller: principal,
  title: (string-ascii 100),
  description: (string-ascii 500),
  starting-price: uint,
  current-bid: uint,
  highest-bidder: (optional principal),
  end-block: uint,
  is-active: bool,
  item-claimed: bool,
  payment-claimed: bool
}
```

## 🔄 User Flow

### For Sellers (Auction Creators)

1. **Connect Wallet** → Connect Stacks wallet to the dApp
2. **Create Auction** → Fill auction form (title, description, starting price, duration)
3. **NFT Minting** → Smart contract automatically mints NFT to contract address
4. **Monitor Auction** → Track bids and auction progress in real-time
5. **Auction Ends** → Either manually end or wait for automatic expiration
6. **Claim Payment** → Receive STX payment minus 2.5% platform fee

### For Bidders

1. **Connect Wallet** → Connect Stacks wallet with sufficient STX balance
2. **Browse Auctions** → View active auctions with current bid information
3. **Place Bid** → Submit bid higher than current bid + 1 STX minimum increment
4. **Automatic Refund** → Previous bid automatically refunded if outbid
5. **Win Auction** → Become highest bidder when auction ends
6. **Claim NFT** → Transfer NFT from contract to personal wallet

### Platform Flow

1. **Auction Creation** → NFT minted and auction data stored on-chain
2. **Bidding Phase** → Real-time bid updates with automatic validations
3. **Auction Completion** → Status updated, claiming phase begins
4. **Settlement** → NFT and payment claims processed independently
5. **Fee Collection** → Platform fees accumulated for admin withdrawal

## 🌐 Frontend Integration

### Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Blockchain Integration**: @stacks/connect for wallet connectivity
- **State Management**: React Context API or Zustand
- **UI Components**: Headless UI or Radix UI primitives

### Key Frontend Components

#### 1. Wallet Integration

```typescript
// Wallet connection using @stacks/connect
import { showConnect, UserSession } from "@stacks/connect";
import { StacksMainnet } from "@stacks/network";

const connectWallet = () => {
  showConnect({
    appDetails: {
      name: "Stacks Auction",
      icon: "/logo.png",
    },
    redirectTo: "/",
    onFinish: () => {
      // Handle successful connection
    },
    userSession,
  });
};
```

#### 2. Smart Contract Interaction

```typescript
// Contract calls using @stacks/transactions
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
} from "@stacks/transactions";

const createAuction = async (
  title: string,
  description: string,
  price: number,
  duration: number
) => {
  const txOptions = {
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "stacks-auction",
    functionName: "create-auction",
    functionArgs: [
      stringAsciiCV(title),
      stringAsciiCV(description),
      uintCV(price),
      uintCV(duration),
    ],
    senderKey: userSession.loadUserData().profile.stxAddress.mainnet,
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, network);
};
```

#### 3. Real-time Data Fetching

```typescript
// Auction data fetching
import { callReadOnlyFunction } from "@stacks/transactions";

const fetchAuction = async (auctionId: number) => {
  const result = await callReadOnlyFunction({
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "stacks-auction",
    functionName: "get-auction",
    functionArgs: [uintCV(auctionId)],
    network,
    senderAddress: userSession.loadUserData().profile.stxAddress.mainnet,
  });

  return result;
};
```

### Page Structure

#### 1. **Home Page** (`/`)

- Hero section with platform overview
- Featured active auctions grid
- Statistics (total auctions, volume, users)
- Call-to-action buttons

#### 2. **Auctions Page** (`/auctions`)

- Filterable auction list (active, ended, category)
- Search functionality
- Sorting options (price, time remaining, popularity)
- Pagination for large datasets

#### 3. **Auction Detail Page** (`/auction/[id]`)

- Auction information display
- Current bid and bidding history
- Countdown timer
- Bid placement form
- Seller information

#### 4. **Create Auction Page** (`/create`)

- Auction creation form
- Image upload for NFT metadata
- Price and duration selection
- Preview functionality

#### 5. **Profile Page** (`/profile`)

- User's created auctions
- Bidding history
- Won items
- Claim actions (items/payments)

#### 6. **Dashboard** (`/dashboard`)

- Personal auction management
- Earnings tracking
- Platform statistics (for admins)

### State Management

```typescript
// Global state structure
interface AppState {
  user: {
    address: string | null;
    isConnected: boolean;
    balance: number;
  };
  auctions: {
    active: Auction[];
    ended: Auction[];
    loading: boolean;
  };
  ui: {
    theme: "light" | "dark";
    notifications: Notification[];
  };
}
```

### Real-time Updates

- **WebSocket Integration**: For live bid updates
- **Polling Strategy**: Regular contract state checks
- **Event Listeners**: Blockchain event monitoring
- **Optimistic Updates**: Immediate UI feedback

### Error Handling

- **Transaction Failures**: User-friendly error messages
- **Network Issues**: Retry mechanisms
- **Validation Errors**: Form validation feedback
- **Loading States**: Skeleton screens and spinners

### Security Considerations

- **Input Validation**: Client and contract-side validation
- **Transaction Verification**: Confirm transaction success
- **Rate Limiting**: Prevent spam transactions
- **Wallet Security**: Secure key management practices

## 🧪 Testing

The project includes comprehensive test coverage:

- **28 test cases** covering all smart contract functions
- **Unit tests** for individual function validation
- **Integration tests** for complete user flows
- **Edge case testing** for error conditions

```bash
# Run tests
npm test

# Test coverage
npm run test:coverage
```

## 🚀 Deployment

### Smart Contract Deployment

```bash
# Deploy to testnet
clarinet deployments apply --devnet

# Deploy to mainnet
clarinet deployments apply --mainnet
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

## 📈 Future Enhancements

- **Multi-token Support**: Support for different cryptocurrencies
- **Auction Categories**: Categorized marketplace
- **Advanced Bidding**: Reserve prices, buy-now options
- **Social Features**: User profiles, ratings, comments
- **Mobile App**: React Native implementation
- **Analytics Dashboard**: Detailed platform metrics
- **NFT Metadata**: IPFS integration for rich media

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ on Stacks Blockchain**
