import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import configurationAPI from "@/api/configuration";
import { get } from "@/utils/http";

interface timeState {
    serverTime: number,
    serverPrefNow: number
}

const initalState: timeState = {
    serverTime: 0,
    serverPrefNow: 0
}

export const fetchTimeWithConfig = createAsyncThunk(
    'time/fetchTimeWithConfig',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            let config = state.configuration.config;

            if(!config) {
                config = await configurationAPI.getLatestAPI();
            }

            const sources = config['server-time'].list.filter(
                (item: {is_enabled:string}) => item.is_enabled
            )

            if(sources && sources.length) {
                for (const { url, key } of sources) {
                    try {
                        if(url.includes('ip')) {break;}
                        const prefStart = performance.now();
                        const data = await get(url);
                        const prefEnd = performance.now();

                        const initalTimestamp = data[key];
                        if (!initalTimestamp) throw "Invalid time format";

                        const serverTime = new Date(initalTimestamp).getTime();
                        const estimatedLatency = (prefEnd - prefStart) / 2;

                        const serverPrefNow = prefEnd - estimatedLatency;

                        return {
                            serverTime,
                            serverPrefNow
                        }
                    } catch (error) {
                        
                    }
                }
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '获取时间失败');
        }
    }
)


const timeSlice = createSlice({
    name:"time",
    initialState: initalState,
    reducers: {
        startLocalTimer: (state) => {
            const elapsed = performance.now() - state.serverPrefNow;
            state.serverTime = state.serverTime + elapsed;
            state.serverPrefNow = performance.now();
        }
    }
})

export const { startLocalTimer } = timeSlice.actions;
export default timeSlice.reducer;