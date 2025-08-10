'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { showConnect, UserSession } from '@stacks/connect';
import { appConfig, appDetails } from '@/lib/stacks';
import { User } from '@/types/auction';

interface WalletContextType {
  user: User;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
  userSession: UserSession;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    address: '',
    isConnected: false,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userSession] = useState(() => new UserSession({ appConfig }));

  const fetchBalance = async (address: string): Promise<number> => {
    try {
      // In a real app, you'd fetch the actual STX balance from the API
      // For now, we'll return a mock balance
      const response = await fetch(`https://stacks-node-api.testnet.stacks.co/extended/v1/address/${address}/balances`);
      const data = await response.json();
      return parseInt(data.stx.balance) || 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  const refreshBalance = async () => {
    if (user.isConnected && user.address) {
      const balance = await fetchBalance(user.address);
      setUser(prev => ({ ...prev, balance }));
    }
  };

  const connectWallet = () => {
    showConnect({
      appDetails,
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUser({
      address: '',
      isConnected: false,
      balance: 0,
    });
  };

  useEffect(() => {
    const checkAuthState = async () => {
      setIsLoading(true);
      
      try {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          const address = userData.profile.stxAddress.testnet; // Use testnet address
          const balance = await fetchBalance(address);
          
          setUser({
            address,
            isConnected: true,
            balance,
          });
        }
      } catch (error) {
        console.warn('Session data corrupted, clearing session:', error);
        // Clear corrupted session data
        try {
          userSession.signUserOut();
        } catch (signOutError) {
          console.warn('Error signing out:', signOutError);
          // If signOut fails, clear localStorage manually
          localStorage.removeItem('blockstack-session');
          localStorage.removeItem('stacks-session');
        }
        setUser({
          address: '',
          isConnected: false,
          balance: 0,
        });
      }
      
      setIsLoading(false);
    };

    checkAuthState();
  }, [userSession]);

  const value: WalletContextType = {
    user,
    connectWallet,
    disconnectWallet,
    isLoading,
    refreshBalance,
    userSession,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};