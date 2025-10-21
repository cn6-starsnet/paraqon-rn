import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import auctionAPI from "@/api/auctions";
import auctionSitemapAPI from "@/api/auctionSitemap";

interface Auction {
  _id: string;
  is_registered: boolean;
  auction_registration_request?: any;
  [key: string]: any;
}

interface AuctionData {
  data: Auction[];
  current_page: number;
  next_page_url?: string;
}

interface AuctionState {
  auctions: AuctionData[];
  auction: Auction | null;
  paddles: any[];
}

const initialState: AuctionState = {
  auctions: [],
  auction: null,
  paddles: [],
};

export const getAllAuctions = createAsyncThunk(
  'auction/getAllAuctions',
  async (params: {
    next_page_url: string;
    sort_by: string;
    sort_order: string;
    per_page: number;
    page: number;
  } = {
    next_page_url:"",
    sort_by:"start_datetime",
    sort_order:"ASC",
    per_page:1,
    page:1,
  }) => {
    const response = await auctionSitemapAPI.getAllAuctions();
    return response.data;
  }
);

export const getAuctionDetails = createAsyncThunk(
  'auction/getAuctionDetails',
  async (auction_id: string) => {
    const response = await auctionAPI.getAuctionDetails({ auction_id });
    return response.data;
  }
);

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    updateAuctionRegistration: (state, action: PayloadAction<{ 
      auction_id: string; 
      auction_registration_request: any 
    }>) => {
      const { auction_id, auction_registration_request } = action.payload;
      
      for (const auctionData of state.auctions) {
        const itemIndex = auctionData.data.findIndex((item) => item._id === auction_id);
        if (itemIndex !== -1) {
          if (auction_registration_request.reply_status === "APPROVED") {
            auctionData.data[itemIndex].is_registered = true;
          }
          auctionData.data[itemIndex].auction_registration_request = auction_registration_request;
          break;
        }
      }
      
      if (state.auction && state.auction._id === auction_id) {
        state.auction.auction_registration_request = auction_registration_request;
        if (auction_registration_request.reply_status === "APPROVED") {
          state.auction.is_registered = true;
        }
      }
    },
    setPaddles: (state, action: PayloadAction<any[]>) => {
      state.paddles = action.payload;
    },
    socketUpdateAuction: (state, action: PayloadAction<{ 
      id: string; 
      update: Partial<Auction> 
    }>) => {
      const { id, update } = action.payload;
      
      if (state.auction && state.auction._id === id) {
        state.auction = { ...state.auction, ...update };
      }
      
      for (const auctionData of state.auctions) {
        const item = auctionData.data.find((item) => item._id === id);
        if (item) {
          Object.assign(item, update);
          break;
        }
      }
    },
    clearAuction: (state) => {
      state.auction = null;
    },
    clearAuctions: (state) => {
      state.auctions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAuctions.fulfilled, (state, action) => {
        if (action.payload.current_page === 1) {
          state.auctions = [action.payload];
        } else {
          state.auctions.push(action.payload);
        }
      })
      .addCase(getAuctionDetails.fulfilled, (state, action) => {
        state.auction = action.payload;
      });
  }
});

export const { 
  updateAuctionRegistration, 
  setPaddles, 
  socketUpdateAuction,
  clearAuction,
  clearAuctions
} = auctionSlice.actions;
export default auctionSlice.reducer;