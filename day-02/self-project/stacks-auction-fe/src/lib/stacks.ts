import { STACKS_TESTNET } from "@stacks/network";
import { AppConfig, UserSession } from "@stacks/connect";

// Network configuration
export const network = STACKS_TESTNET; // Change to STACKS_MAINNET for production

// Contract details
export const CONTRACT_ADDRESS = "ST214GJ5G2K6ZHF3BWF2P4ZPA9CBJVGMBAPP6RW6X";
export const CONTRACT_NAME = "stacks-auction-v2";

// App configuration
export const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

// App details for wallet connection
export const appDetails = {
  name: "Stacks Auction",
  icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
};

// Platform fee rate (2.5%)
export const PLATFORM_FEE_RATE = 250; // 2.5% in basis points

// Minimum bid increment (1 STX)
export const MIN_BID_INCREMENT = 1000000; // 1 STX in microSTX

// Minimum auction duration (144 blocks)
export const MIN_AUCTION_DURATION = 144;

// Convert STX to microSTX
export const stxToMicroStx = (stx: number): number => {
  return Math.floor(stx * 1000000);
};

// Convert microSTX to STX
export const microStxToStx = (microStx: number): number => {
  return microStx / 1000000;
};

// Format STX amount for display
export const formatStx = (microStx: number): string => {
  return (microStx / 1_000_000).toFixed(2) + " STX";
};

export const parseStx = (stxAmount: string): number => {
  return Math.floor(parseFloat(stxAmount) * 1_000_000);
};

export const calculateFee = (amount: number): number => {
  return Math.max(1000, Math.floor(amount * 0.001));
};

// Calculate platform fee
export const calculatePlatformFee = (amount: number): number => {
  return Math.floor((amount * PLATFORM_FEE_RATE) / 10000);
};

// Calculate seller payout (amount minus platform fee)
export const calculateSellerPayout = (amount: number): number => {
  return amount - calculatePlatformFee(amount);
};
