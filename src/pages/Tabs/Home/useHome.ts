import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAuctionsType } from "@/store/slices/productSlice";
import { StackActions, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useSharedValue } from "react-native-reanimated";
// import { ICarouselInstance } from "react-native-reanimated-carousel";

const useHome = () => {
    const [currentFeaturedTab, setCurrentFeaturedTab] = useState("upcoming")
    const dispatch = useAppDispatch()
    const navigation = useNavigation();
    const auctionsTypes = useAppSelector((state) => state.products.auctionsType)
    // const carouselRef = React.useRef<ICarouselInstance>(null);
    // const progress = useSharedValue<number>(0);
    
    // const onPressPagination = (index: number) => {
    //     carouselRef.current?.scrollTo({
    //     /**
    //      * Calculate the difference between the current index and the target index
    //      * to ensure that the carousel scrolls to the nearest index
    //      */
    //     count: index - progress.value,
    //     animated: true,
    //     });
    // };
 

    const featuredTabs = useMemo(() => {
        return [{
						title: "即将举行",
						value: "upcoming"
					},
					{
						title: "已结束",
						value: "past"
					},
        ]
    }, [])

    const getCoverImage = useCallback((item:{images: any}) => {
        const currentLocale = 'en';
		const [imageEn,imageZh] = item?.images || [];
		return currentLocale === 'en' ? imageEn : imageZh
    }, [])

    const filterAuctions = useMemo(() => {
        const currentTime = new Date();
        if (currentFeaturedTab === "upcoming") {
            return auctionsTypes.filter(auction => new Date(auction.end_datetime) > currentTime)
        }else {
			return auctionsTypes.filter(auction => new Date(auction.end_datetime) < currentTime)
		}
    }, [auctionsTypes,currentFeaturedTab])

    const handleAuctionType = (auctionId: string) => {
        navigation.dispatch(StackActions.push("Auctions", {
            storeId: auctionId
        }))
    }

    useEffect(() => {
        dispatch(fetchAuctionsType())
    }, [dispatch])

    useEffect(() => {
        if (!auctionsTypes.length) return; 
        
        const upcomingAuctions = auctionsTypes.filter(
            auction => new Date(auction.end_datetime) > new Date()
        );
        const pastAuctions = auctionsTypes.filter(
            auction => new Date(auction.end_datetime) < new Date()
        );
        
        // 如果没有即将举行的拍卖，但有已结束的拍卖
        if (!upcomingAuctions.length && pastAuctions.length) {
            setCurrentFeaturedTab("past");
        }
    }, [auctionsTypes])

    return {
        // progress,
        // carouselRef,
        featuredTabs,
        filterAuctions,
        currentFeaturedTab,
        getCoverImage,
        handleAuctionType,
        // onPressPagination,
        setCurrentFeaturedTab
    }
}

export default useHome;