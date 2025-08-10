'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatStx } from '@/lib/stacks';
import { Wallet, Plus, User, LogOut, Gavel } from 'lucide-react';

const Header: React.FC = () => {
  const { user, connectWallet, disconnectWallet, isLoading } = useWallet();

  const truncateAddress = (address: string | null | undefined | unknown): string => {
    if (!address || typeof address !== 'string') return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Gavel className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Stacks Auction</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/auctions" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Auctions
              </Link>
              <Link 
                href="/create" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Create Auction
              </Link>
              {user.isConnected && (
                <Link 
                  href="/profile" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Auctions
                </Link>
              )}
            </nav>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {!user.isConnected ? (
              <Button 
                onClick={connectWallet} 
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Balance Display */}
                <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Balance:</span>
                  <span className="font-medium">{formatStx(user.balance)}</span>
                </div>

                {/* Create Auction Button */}
                <Link href="/create">
                  <Button size="sm" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Auction</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="text-sm font-medium">
                          {truncateAddress(user.address)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatStx(user.balance)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auctions" className="flex items-center space-x-2">
                        <Gavel className="h-4 w-4" />
                        <span>Browse Auctions</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={disconnectWallet}
                      className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Disconnect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;