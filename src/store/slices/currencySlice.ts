import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get } from "@/utils/http";
import { getStoreItem, setStoreItem } from "@/utils/storage";
import { CURRENCY } from "@/constants";

interface ExchangeRateItem {
    code: string;
    title: {
        en: string;
        zh: string;
        cn: string;
    },
    is_enabled: boolean;
    value: number;
}

interface CrrencyState {
    exchangeRates: ExchangeRateItem[],
    currency: string
}

const initalState: CrrencyState = {
    exchangeRates: [
        {
            code: "HKD",
            title: {
                en: "Hong Kong Dollar",
                zh: "港币",
                cn: "港币"
            },
            is_enabled: true,
            value: 1
        },
        {
            code: "USD",
            title: {
                en: "US Dollars",
                zh: "美元",
                cn: "美元"
            },
            is_enabled: true,
            value: 0.128
        }
    ],
    currency: "HKD"
}

const crrencySlice = createSlice({
    name:"crrency",
    initialState: initalState,
    reducers: {
        updateCurrency: (state) => {
            let newCurrency = state.currency;
            if (!newCurrency) {
                newCurrency = getStoreItem(CURRENCY) || "HKD"
            }
            setStoreItem(CURRENCY, newCurrency);
        }
    }
})

export const { updateCurrency } = crrencySlice.actions;
export default crrencySlice.reducer;