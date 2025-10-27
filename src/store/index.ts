import { configureStore } from "@reduxjs/toolkit";
import configurationSlice from '@/store/slices/configurationSlice'
import timeSlice from '@/store/slices/timeSlice'
import currencySlice from '@/store/slices/currencySlice'
import auctionSlice from '@/store/slices/auctionSlice'
import auctionLotSlice from '@/store/slices/auctionLotSlice'
import postSlice from '@/store/slices/postSlice'
import productSlice from '@/store/slices/productSlice'
import staticsSlice from '@/store/slices/staticSlice'

const store = configureStore({
    reducer: {
        configuration: configurationSlice,
        time: timeSlice,
        currency: currencySlice,
        auctions: auctionSlice,
        auctionLot: auctionLotSlice,
        posts: postSlice,
        products: productSlice,
        statics: staticsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;