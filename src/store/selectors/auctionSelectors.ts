import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

export const selectAuctionsData = (state: RootState) => state.auctions.auctions;
export const selectAuction = (state: RootState) => state.auctions.auction;
export const selectPaddles = (state: RootState) => state.auctions.paddles;

export const selectAuctions = createSelector(
  [selectAuctionsData],
  (auctionsData) => {
    const output = auctionsData.map((auction) => auction.data);
    return output.flat(1);
  }
);

export const selectNextAuctionLink = createSelector(
  [selectAuctionsData],
  (auctionsData) => {
    const lastElement = auctionsData[auctionsData.length - 1];
    try {
      return lastElement?.next_page_url || null;
    } catch (error) {
      return null;
    }
  }
);

export const selectAuctionById = createSelector(
  [selectAuctions, (state: RootState, auctionId: string) => auctionId],
  (auctions, auctionId) => {
    return auctions.find(auction => auction._id === auctionId);
  }
);

export const selectRegisteredAuctions = createSelector(
  [selectAuctions],
  (auctions) => {
    return auctions.filter(auction => auction.is_registered);
  }
);

export const selectApprovedAuctions = createSelector(
  [selectAuctions],
  (auctions) => {
    return auctions.filter(auction => 
      auction.auction_registration_request?.reply_status === "APPROVED"
    );
  }
);

export const selectAuctionWithStatus = createSelector(
  [selectAuction],
  (auction) => {
    if (!auction) return null;
    
    return {
      ...auction,
      isApproved: auction.auction_registration_request?.reply_status === "APPROVED",
      hasRegistrationRequest: !!auction.auction_registration_request,
      canJoin: auction.is_registered && auction.status === 'active'
    };
  }
);