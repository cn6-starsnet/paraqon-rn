// store/slices/auctionLotSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import auctionLotAPI from "@/api/auctionLot";

interface Bid {
  created_at: string;
  [key: string]: any;
}

interface AuctionLot {
  _id: string;
  is_liked: boolean;
  current_bid?: number;
  permission_requests?: any[];
  [key: string]: any;
}

interface PaginatedData {
  data: any[];
  [key: string]: any;
}

interface AuctionLotState {
  participated_auction_lots: PaginatedData | null;
  owned_auction_lots: PaginatedData | null;
  auction_lot: AuctionLot | null;
  auction_lot_my_bids: PaginatedData | null;
  auction_lot_all_bids: PaginatedData | null;
}

const initialState: AuctionLotState = {
  participated_auction_lots: null,
  owned_auction_lots: null,
  auction_lot: null,
  auction_lot_my_bids: null,
  auction_lot_all_bids: null,
};

// Async Thunks
export const getAuctionLotDetails = createAsyncThunk(
  'auctionLot/getAuctionLotDetails',
  async (auction_lot_id: string) => {
    const response = await auctionLotAPI.getAuctionLogDetails({ auction_lot_id });
    return response.data;
  }
);

export const getAuctionLotAllBids = createAsyncThunk(
  'auctionLot/getAuctionLotAllBids',
  async (auction_lot_id: string, { rejectWithValue }) => {
    try {
      const response = await auctionLotAPI.getAuctionLotAllBids({ auction_lot_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const auctionLotSlice = createSlice({
  name: "auctionLot",
  initialState,
  reducers: {
    setParticipatedAuctionLots: (state, action: PayloadAction<PaginatedData>) => {
      state.participated_auction_lots = action.payload;
    },
    setOwnedAuctionLots: (state, action: PayloadAction<PaginatedData>) => {
      state.owned_auction_lots = action.payload;
    },
    updateAuctionLotIsLiked: (state) => {
      if (state.auction_lot) {
        state.auction_lot.is_liked = !state.auction_lot.is_liked;
      }
    },
    updateAuctionLotCurrentBid: (state, action: PayloadAction<number>) => {
      if (state.auction_lot) {
        state.auction_lot.current_bid = action.payload;
      }
    },
    updateAuctionLotPermissionRequests: (state, action: PayloadAction<any>) => {
      if (!state.auction_lot) return;
      
      const requests = state.auction_lot.permission_requests;
      
      if (!requests) {
        state.auction_lot.permission_requests = [action.payload];
        return;
      }
      
      requests.push(action.payload);
    },
    setBiddingHistory: (state, action: PayloadAction<PaginatedData>) => {
      state.auction_lot_my_bids = action.payload;
    },
    socketUpdateAuctionLot: (state, action: PayloadAction<{ 
      id: string; 
      update: Partial<AuctionLot> 
    }>) => {
      const { id, update } = action.payload;
      if (state.auction_lot && state.auction_lot._id === id) {
        state.auction_lot = { ...state.auction_lot, ...update };
      }
    },
    socketUpdateBiddingHistory: (state, action: PayloadAction<{ 
      id: string; 
      update: PaginatedData 
    }>) => {
      const { id, update } = action.payload;
      if (state.auction_lot && state.auction_lot._id === id && state.auction_lot_my_bids) {
        state.auction_lot_my_bids.data = update.data;
      }
    },
    clearAuctionLot: (state) => {
      state.auction_lot = null;
    },
    clearBids: (state) => {
      state.auction_lot_my_bids = null;
      state.auction_lot_all_bids = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuctionLotDetails.fulfilled, (state, action) => {
        state.auction_lot = action.payload;
      })
      .addCase(getAuctionLotAllBids.fulfilled, (state, action) => {
        state.auction_lot_all_bids = action.payload;
      })
      .addCase(getAuctionLotAllBids.rejected, (state) => {
        state.auction_lot_all_bids = { data: [] };
      });
  }
});

export const { 
  setParticipatedAuctionLots,
  setOwnedAuctionLots,
  updateAuctionLotIsLiked,
  updateAuctionLotCurrentBid,
  updateAuctionLotPermissionRequests,
  setBiddingHistory,
  socketUpdateAuctionLot,
  socketUpdateBiddingHistory,
  clearAuctionLot,
  clearBids
} = auctionLotSlice.actions;
export default auctionLotSlice.reducer;