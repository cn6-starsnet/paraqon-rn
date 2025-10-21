// store/selectors/auctionsSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

// 基础选择器
export const selectAuctionsType = (state: RootState) => state.products.auctionsType;
export const selectAuctionsDetails = (state: RootState) => state.products.auctionsDetails;
export const selectAuctionsGoods = (state: RootState) => state.products.auctionsGoods;
export const selectLogList = (state: RootState) => state.products.log_list;
export const selectAuctionsLoading = (state: RootState) => state.products.loading;
export const selectAuctionsError = (state: RootState) => state.products.error;

// 派生选择器（原 getters 逻辑）
export const selectAuctionsTypeData = createSelector(
  [selectAuctionsType],
  (auctionsType) => auctionsType
);

export const selectAuctionsDetailsData = createSelector(
  [selectAuctionsDetails],
  (auctionsDetails) => auctionsDetails
);

export const selectAuctionsGoodsData = createSelector(
  [selectAuctionsGoods],
  (auctionsGoods) => auctionsGoods
);

export const selectLotList = createSelector(
  [selectLogList],
  (logList) => logList
);

// 高级选择器
export const selectAuctionsGoodsItems = createSelector(
  [selectAuctionsGoods],
  (auctionsGoods) => auctionsGoods?.data || []
);

export const selectAuctionWithStatus = createSelector(
  [selectAuctionsDetails, selectAuctionsLoading, selectAuctionsError],
  (auctionsDetails, loading, error) => ({
    auction: auctionsDetails,
    loading,
    error,
    hasAuction: !!auctionsDetails,
    isEmpty: !auctionsDetails
  })
);

export const selectAuctionGoodsWithStatus = createSelector(
  [selectAuctionsGoods, selectAuctionsLoading, selectAuctionsError],
  (auctionsGoods, loading, error) => ({
    goods: auctionsGoods?.data || [],
    total: auctionsGoods?.data?.length || 0,
    loading,
    error,
    hasGoods: (auctionsGoods?.data?.length || 0) > 0
  })
);

export const selectLotListWithStatus = createSelector(
  [selectLogList, selectAuctionsLoading, selectAuctionsError],
  (logList, loading, error) => ({
    lots: logList,
    total: logList.length,
    loading,
    error,
    hasLots: logList.length > 0
  })
);

export const selectAuctionTypesWithStatus = createSelector(
  [selectAuctionsType, selectAuctionsLoading, selectAuctionsError],
  (auctionsType, loading, error) => ({
    types: auctionsType,
    total: auctionsType.length,
    loading,
    error,
    hasTypes: auctionsType.length > 0
  })
);

export const selectSortedLotList = createSelector(
  [selectLogList, (state: RootState, sortBy: string = 'lot_number', sortOrder: string = 'asc') => ({ sortBy, sortOrder })],
  (logList, { sortBy, sortOrder }) => {
    return [...logList].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }
);