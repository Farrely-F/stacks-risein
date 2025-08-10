import {
  makeContractCall,
  makeUnsignedContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  standardPrincipalCV,
  fetchCallReadOnlyFunction,
  cvToJSON,
  ClarityValue,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import { userSession, network, CONTRACT_ADDRESS, CONTRACT_NAME, appDetails } from './stacks';
import { Auction, UserBid, TransactionResult } from '@/types/auction';

// Helper function to get user address
const getUserAddress = (): string => {
  if (!userSession.isUserSignedIn()) {
    throw new Error('User not signed in');
  }
  const userData = userSession.loadUserData();
  return userData.profile.stxAddress.testnet; // Use testnet address
};

const getUserAddressOrDefault = (): string => {
  try {
    return getUserAddress();
  } catch {
    // Return a default address for read-only calls when user is not signed in
    return CONTRACT_ADDRESS; // Use contract address as default
  }
};

// Create auction
export const createAuction = async (
  title: string,
  description: string,
  startingPrice: number, // in microSTX
  duration: number // in blocks
) => {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-auction',
    functionArgs: [
      stringAsciiCV(title),
      stringAsciiCV(description),
      uintCV(startingPrice),
      uintCV(duration),
    ],
    network,
    anchorMode: AnchorMode.Any,
  };
};

// Place bid
export const placeBid = async (
  auctionId: number,
  bidAmount: number // in microSTX
): Promise<TransactionResult> => {
  try {
    return new Promise((resolve, reject) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'place-bid',
        functionArgs: [
          uintCV(auctionId),
          uintCV(bidAmount),
        ],
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        appDetails,
        onFinish: (data) => {
          resolve({
            txId: data.txId,
            success: true,
          });
        },
        onCancel: () => {
          resolve({
            txId: '',
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    return {
      txId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Claim item (for auction winner)
export const claimItem = async (auctionId: number): Promise<TransactionResult> => {
  try {
    return new Promise((resolve, reject) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'claim-item',
        functionArgs: [uintCV(auctionId)],
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        appDetails,
        onFinish: (data) => {
          resolve({
            txId: data.txId,
            success: true,
          });
        },
        onCancel: () => {
          resolve({
            txId: '',
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });
  } catch (error) {
    console.error('Error claiming item:', error);
    return {
      txId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Claim payment (for auction seller or bidder)
export const claimPayment = async (auctionId: number): Promise<TransactionResult> => {
  try {
    return new Promise((resolve, reject) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'claim-payment',
        functionArgs: [uintCV(auctionId)],
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        appDetails,
        onFinish: (data) => {
          resolve({
            txId: data.txId,
            success: true,
          });
        },
        onCancel: () => {
          resolve({
            txId: '',
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });
  } catch (error) {
    console.error('Error claiming payment:', error);
    return {
      txId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// End auction
export const endAuction = async (auctionId: number): Promise<TransactionResult> => {
  try {
    return new Promise((resolve, reject) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'end-auction',
        functionArgs: [uintCV(auctionId)],
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        appDetails,
        onFinish: (data) => {
          resolve({
            txId: data.txId,
            success: true,
          });
        },
        onCancel: () => {
          resolve({
            txId: '',
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });
  } catch (error) {
    console.error('Error ending auction:', error);
    return {
      txId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Read-only functions

// Get auction details
export const getAuction = async (auctionId: number): Promise<Auction | null> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-auction',
      functionArgs: [uintCV(auctionId)],
      network,
      senderAddress: getUserAddressOrDefault(),
    });

    const auctionData = cvToJSON(result).value;
    
    // Check if auctionData exists and has the expected structure
    if (!auctionData || !auctionData.value || !auctionData.value.seller || !auctionData.value.title) {
      return null;
    }

    const auction = auctionData.value;
    
    return {
      id: auctionId,
      seller: auction.seller?.value || '',
      title: auction.title?.value || '',
      description: auction.description?.value || '',
      startingPrice: parseInt(auction['starting-price']?.value || '0'),
      currentBid: parseInt(auction['current-bid']?.value || '0'),
      highestBidder: auction['highest-bidder']?.value || null,
      endBlock: parseInt(auction['end-block']?.value || '0'),
      isActive: auction['is-active']?.value || false,
      itemClaimed: auction['item-claimed']?.value || false,
      paymentClaimed: auction['payment-claimed']?.value || false,
    };
  } catch (error) {
    console.error('Error fetching auction:', error);
    return null;
  }
};

// Get user bid for specific auction
export const getUserBid = async (auctionId: number, userAddress: string): Promise<UserBid | null> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-user-bid',
      functionArgs: [uintCV(auctionId), standardPrincipalCV(userAddress)],
      network,
      senderAddress: userAddress,
    });

    const bidData = cvToJSON(result).value;
    if (!bidData) return null;

    return {
      auctionId,
      bidder: userAddress,
      amount: parseInt(bidData.amount.value),
      blockHeight: parseInt(bidData['block-height'].value),
    };
  } catch (error) {
    console.error('Error fetching user bid:', error);
    return null;
  }
};

// Get current block height (helper function)
export const getCurrentBlockHeight = async (): Promise<number> => {
  try {
    const response = await fetch(`https://api.testnet.hiro.so/v2/info`);
    const data = await response.json();
    return data.stacks_tip_height;
  } catch (error) {
    console.error('Error fetching block height:', error);
    throw error;
  }
};

// Get next item ID (total number of auctions created + 1)
export const getNextItemId = async (): Promise<number> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-next-item-id',
      functionArgs: [],
      network,
      senderAddress: getUserAddressOrDefault(),
    });

    const nextId = cvToJSON(result).value;
    return parseInt(nextId);
  } catch (error) {
    console.error('Error fetching next item ID:', error);
    return 1; // Default to 1 if error
  }
};