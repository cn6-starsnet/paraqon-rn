// store/selectors/auctionLotSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

// 基础选择器
export const selectParticipatedAuctionLots = (state: RootState) => 
  state.auctionLot.participated_auction_lots;

export const selectOwnedAuctionLots = (state: RootState) => 
  state.auctionLot.owned_auction_lots;

export const selectAuctionLot = (state: RootState) => 
  state.auctionLot.auction_lot;

export const selectAuctionLotMyBids = (state: RootState) => 
  state.auctionLot.auction_lot_my_bids;

export const selectAuctionLotAllBids = (state: RootState) => 
  state.auctionLot.auction_lot_all_bids;

// 派生选择器（原 getters 逻辑）
export const selectParticipatedAuctionLotsData = createSelector(
  [selectParticipatedAuctionLots],
  (participatedLots) => {
    return participatedLots?.data || [];
  }
);

export const selectOwnedAuctionLotsData = createSelector(
  [selectOwnedAuctionLots],
  (ownedLots) => {
    return ownedLots?.data || [];
  }
);

export const selectAuctionLotData = createSelector(
  [selectAuctionLot],
  (auctionLot) => {
    return auctionLot || {};
  }
);

export const selectSortedBids = createSelector(
  [selectAuctionLotMyBids],
  (myBids) => {
    const bids = myBids?.data || [];
    return bids.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
);

export const selectAuctionLotBidsData = createSelector(
  [selectAuctionLotAllBids],
  (allBids) => {
    return allBids?.data || [];
  }
);

// 高级选择器
export const selectAuctionLotWithDetails = createSelector(
  [selectAuctionLot, selectSortedBids, selectAuctionLotBidsData],
  (auctionLot, sortedBids, allBids) => {
    return {
      auctionLot: auctionLot || {},
      myBids: sortedBids,
      allBids: allBids,
      hasBids: sortedBids.length > 0,
      totalBids: allBids.length,
      isLiked: auctionLot?.is_liked || false,
      currentBid: auctionLot?.current_bid || 0
    };
  }
);

export const selectAuctionLotPermissionRequests = createSelector(
  [selectAuctionLot],
  (auctionLot) => {
    return auctionLot?.permission_requests || [];
  }
);

export const selectCanBid = createSelector(
  [selectAuctionLot],
  (auctionLot) => {
    if (!auctionLot) return false;
    return auctionLot.status === 'active' && !auctionLot.is_ended;
  }
);

export const selectHighestBid = createSelector(
  [selectSortedBids],
  (bids) => {
    if (bids.length === 0) return null;
    return bids[0]; // 已经按时间排序，第一个是最新的
  }
);