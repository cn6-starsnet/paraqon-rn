import configurationAPI from "@/api/configuration";
import { ConfigData, ConfigInfo } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigurationState {
  config: ConfigData | null;
}
const initalState: ConfigurationState = {
  config: null,
}

export const fetchLatest = createAsyncThunk(
  'configuration/fetchLatest',
  async () => {
    const response = await configurationAPI.getLatestAPI();
    return response;
  }
)

const configurationSlice = createSlice({
  name: "configuration",
  initialState: initalState,
  reducers: {
    clearConfiguration: (state) => {
      state.config = null;
    },
    setConfig: (state, action: PayloadAction<ConfigData>) => {
      state.config = action.payload;
    },
    getLatest: (state, action) => {
      state.config = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchConfiguration
      .addCase(fetchLatest.fulfilled, (state, action) => {
        state.config = action.payload;
      })
  }
})

export const { clearConfiguration, setConfig } = configurationSlice.actions;
export default configurationSlice.reducer;