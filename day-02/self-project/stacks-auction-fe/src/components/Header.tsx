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
    <header className="border-b-4 border-black bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
              <div className="bg-primary p-2 border-2 border-black">
                <Gavel className="h-6 w-6 text-background" />
              </div>
              <span className="text-xl font-black tracking-tight">Stacks Auction</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/auctions" 
                className="text-sm font-bold text-foreground hover:text-primary transition-colors hover:underline decoration-4 underline-offset-8"
              >
                Auctions
              </Link>
              <Link 
                href="/create" 
                className="text-sm font-bold text-foreground hover:text-primary transition-colors hover:underline decoration-4 underline-offset-8"
              >
                Create Auction
              </Link>
              {user.isConnected && (
                <Link 
                  href="/profile" 
                  className="text-sm font-bold text-foreground hover:text-primary transition-colors hover:underline decoration-4 underline-offset-8"
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
                className="flex items-center space-x-2 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                <Wallet className="h-4 w-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Balance Display */}
                <div className="hidden sm:flex items-center space-x-2 text-sm font-bold border-2 border-black px-3 py-1">
                  <span>Balance:</span>
                  <span className="font-black text-primary">{formatStx(user.balance)}</span>
                </div>

                {/* Create Auction Button */}
                <Link href="/create">
                  <Button size="sm" className="flex items-center space-x-2 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Auction</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-none border-2 border-black hover:bg-primary hover:text-background transition-colors">
                      <Avatar className="h-8 w-8 rounded-none">
                        <AvatarFallback className="text-xs font-black rounded-none bg-background">
                          {user.address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2 border-b-2 border-black">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="text-sm font-bold">
                          {truncateAddress(user.address)}
                        </p>
                        <p className="text-xs font-bold text-primary">
                          {formatStx(user.balance)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild className="focus:bg-primary focus:text-background">
                      <Link href="/profile" className="flex items-center space-x-2 font-bold">
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-primary focus:text-background">
                      <Link href="/auctions" className="flex items-center space-x-2 font-bold">
                        <Gavel className="h-4 w-4" />
                        <span>Browse Auctions</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-t-2 border-black" />
                    <DropdownMenuItem 
                      onClick={disconnectWallet}
                      className="flex items-center space-x-2 font-bold text-red-600 focus:text-background focus:bg-red-600"
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