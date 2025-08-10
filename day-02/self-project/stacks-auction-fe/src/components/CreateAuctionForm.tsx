"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import { createAuction } from "@/lib/contract";
import { parseStx, formatStx } from "@/lib/stacks";
import { openContractCall } from "@stacks/connect";
import { PostConditionMode } from "@stacks/transactions";
import { appDetails } from "@/lib/stacks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Plus, AlertCircle, Info } from "lucide-react";
import { CreateAuctionForm as CreateAuctionFormType } from "@/types/auction";

const CreateAuctionForm: React.FC = () => {
  const router = useRouter();
  const { user, userSession } = useWallet();

  const [formData, setFormData] = useState<CreateAuctionFormType>({
    title: "",
    description: "",
    startingPrice: "",
    duration: "144", // Default to 24 hours (144 blocks)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateAuctionFormType>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateAuctionFormType> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 50) {
      newErrors.title = "Title must be 50 characters or less";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    // Starting price validation
    if (!formData.startingPrice) {
      newErrors.startingPrice = "Starting price is required";
    } else {
      const price = parseFloat(formData.startingPrice);
      if (isNaN(price) || price <= 0) {
        newErrors.startingPrice = "Starting price must be a positive number";
      } else if (price < 0.000001) {
        newErrors.startingPrice = "Minimum starting price is 0.000001 STX";
      }
    }

    // Duration validation
    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    } else {
      const duration = parseInt(formData.duration);
      if (isNaN(duration) || duration <= 0) {
        newErrors.duration = "Duration must be a positive number";
      } else if (duration < 6) {
        newErrors.duration = "Minimum duration is 6 blocks (1 hour)";
      } else if (duration > 4320) {
        newErrors.duration = "Maximum duration is 4320 blocks (30 days)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateAuctionFormType,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.isConnected || !userSession.isUserSignedIn()) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const startingPriceMicroStx = parseStx(formData.startingPrice);
      const durationBlocks = parseInt(formData.duration);

      const txOptions = await createAuction(
        formData.title.trim(),
        formData.description.trim(),
        startingPriceMicroStx,
        durationBlocks
      );

      console.log("txOptions", txOptions);
      console.log("appDetails", appDetails);

      try {
        console.log("About to call openContractCall with:", {
          txOptions,
          appDetails,
          userSession: userSession
            ? "UserSession exists"
            : "UserSession is null",
          isUserSignedIn: userSession?.isUserSignedIn(),
          userData: userSession?.loadUserData(),
          walletAddress: userSession?.loadUserData()?.profile?.stxAddress,
          network: txOptions.network,
        });

        const result = await openContractCall({
          ...txOptions,
          appDetails,
          onFinish: (data) => {
            console.log("Transaction submitted:", data);
            toast.success("Auction creation transaction submitted!");
            router.push("/auctions");
          },
          onCancel: () => {
            console.log("Transaction cancelled by user");
            toast.error("Transaction cancelled");
          },
          postConditionMode: PostConditionMode.Allow,
        });
        console.log("openContractCall completed with result:", result);
      } catch (contractCallError) {
        console.error("openContractCall error:", contractCallError);
        throw contractCallError;
      }
    } catch (error) {
      console.error("Error creating auction:", error);
      toast.error("Failed to create auction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDurationDisplay = (blocks: string): string => {
    const blockCount = parseInt(blocks);
    if (isNaN(blockCount)) return "";

    const minutes = blockCount * 10;
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (!user.isConnected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
            <p className="text-muted-foreground mb-6">
              You need to connect your wallet to create an auction.
            </p>
            <Button onClick={() => window.location.reload()}>
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Auction Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter auction title (e.g., Vintage Bitcoin T-Shirt)"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-destructive" : ""}
              maxLength={50}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail. Include condition, features, and any relevant information for bidders."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              rows={4}
              maxLength={500}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Starting Price */}
          <div className="space-y-2">
            <Label htmlFor="startingPrice">Starting Price (STX) *</Label>
            <Input
              id="startingPrice"
              type="number"
              placeholder="0.000001"
              value={formData.startingPrice}
              onChange={(e) =>
                handleInputChange("startingPrice", e.target.value)
              }
              className={errors.startingPrice ? "border-destructive" : ""}
              min="0.000001"
              step="0.000001"
            />
            {errors.startingPrice && (
              <p className="text-sm text-destructive">{errors.startingPrice}</p>
            )}
            {formData.startingPrice && !errors.startingPrice && (
              <p className="text-xs text-muted-foreground">
                ≈ {formatStx(parseStx(formData.startingPrice))}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (Blocks) *</Label>
            <Input
              id="duration"
              type="number"
              placeholder="144"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className={errors.duration ? "border-destructive" : ""}
              min="6"
              max="4320"
            />
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration}</p>
            )}
            {formData.duration && !errors.duration && (
              <p className="text-xs text-muted-foreground">
                ≈ {calculateDurationDisplay(formData.duration)}
              </p>
            )}

            {/* Duration presets */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange("duration", "144")}
              >
                1 Day
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange("duration", "432")}
              >
                3 Days
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange("duration", "1008")}
              >
                1 Week
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange("duration", "2016")}
              >
                2 Weeks
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Once created, auctions cannot be modified.
          Make sure all details are correct before submitting. You can end the
          auction early if needed, but the terms cannot be changed.
        </AlertDescription>
      </Alert>

      {/* User Balance Info */}
      <Card className="bg-background">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Your STX Balance:
            </span>
            <span className="font-semibold">{formatStx(user.balance)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Auction
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateAuctionForm;
