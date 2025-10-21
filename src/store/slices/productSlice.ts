import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import auctionAPI from "@/api/auctions";

interface AuctionType {
  [key: string]: any;
}

interface AuctionDetails {
  [key: string]: any;
}

interface AuctionGoods {
  data: any[];
  [key: string]: any;
}

interface LotItem {
  [key: string]: any;
}

interface AuctionsState {
  auctionsType: AuctionType[];
  auctionsDetails: AuctionDetails | null;
  auctionsGoods: AuctionGoods | null;
  log_list: LotItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AuctionsState = {
  auctionsType: [],
  auctionsDetails: null,
  auctionsGoods: null,
  log_list: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAuctionsType = createAsyncThunk(
  'auctions/fetchAuctionsType',
  async (_, { rejectWithValue }) => {
    try {
      console.log("调用fetchAuctionsType")
      const response = await auctionAPI.getAuctionsType();
      console.log("获取的数据为,", response.data)
      return response.data;
    } catch (error: any) {
      console.log("调用fetchAuctionsType出错", error)
      return rejectWithValue(error.response?.data?.message || '获取拍卖类型失败');
    }
  }
);

export const fetchAuctionsDetail = createAsyncThunk(
  'auctions/fetchAuctionsDetail',
  async (storeId: string, { rejectWithValue }) => {
    try {
      const response = await auctionAPI.getAuctionDetails({ auction_id: storeId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取拍卖详情失败');
    }
  }
);

export const fetchAuctionsGoods = createAsyncThunk(
  'auctions/fetchAuctionsGoods',
  async (params: { storeId: string; per_page?: number; page?: number }, { rejectWithValue }) => {
    try {
      const response = await auctionAPI.getAuctionsGoods({
        auction_id: params.storeId,
        per_page: params.per_page,
        page: params.page
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取拍品数据失败');
    }
  }
);

export const getAllAuctionLotsAndNumber = createAsyncThunk(
  'auctions/getAllAuctionLotsAndNumber',
  async (params: { store_id: string; sort_by?: string; sort_order?: string }, { rejectWithValue }) => {
    try {
      const response = await auctionAPI.getAllAuctionLotsAndNumber({
        store_id: params.store_id,
        sort_by: params.sort_by,
        sort_order: params.sort_order
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取拍品列表失败');
    }
  }
);

const auctionsSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {
    setAuctionsType: (state, action: PayloadAction<AuctionType[]>) => {
      state.auctionsType = action.payload;
    },
    setAuctionsDetails: (state, action: PayloadAction<AuctionDetails>) => {
      state.auctionsDetails = action.payload;
    },
    setAuctionsGoods: (state, action: PayloadAction<AuctionGoods>) => {
      state.auctionsGoods = action.payload;
    },
    setLogList: (state, action: PayloadAction<LotItem[]>) => {
      state.log_list = action.payload;
    },
    clearAuctionsDetails: (state) => {
      state.auctionsDetails = null;
    },
    clearAuctionsGoods: (state) => {
      state.auctionsGoods = null;
    },
    clearLogList: (state) => {
      state.log_list = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAuctionsType
      .addCase(fetchAuctionsType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctionsType.fulfilled, (state, action) => {
        state.loading = false;
        state.auctionsType = action.payload;
      })
      .addCase(fetchAuctionsType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchAuctionsDetail
      .addCase(fetchAuctionsDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctionsDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.auctionsDetails = action.payload;
      })
      .addCase(fetchAuctionsDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchAuctionsGoods
      .addCase(fetchAuctionsGoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctionsGoods.fulfilled, (state, action) => {
        state.loading = false;
        state.auctionsGoods = action.payload;
      })
      .addCase(fetchAuctionsGoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getAllAuctionLotsAndNumber
      .addCase(getAllAuctionLotsAndNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAuctionLotsAndNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.log_list = action.payload;
      })
      .addCase(getAllAuctionLotsAndNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setAuctionsType,
  setAuctionsDetails,
  setAuctionsGoods,
  setLogList,
  clearAuctionsDetails,
  clearAuctionsGoods,
  clearLogList,
  clearError
} = auctionsSlice.actions;
export default auctionsSlice.reducer;