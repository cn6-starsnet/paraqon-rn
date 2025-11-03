import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllAuctions } from "@/store/slices/auctionSlice";
import { filterPostsByCategories } from "@/store/slices/postSlice";
import { fetchAuctionsType, filterProductsByCategories } from "@/store/slices/productSlice";
import { StackActions, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";

const useHome = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    // Selectors
    const auctionsTypes = useAppSelector((state) => state.products.auctionsType);
    const getAuctions = useAppSelector((state) => state.auctions.auctions);
    const getProducts = useAppSelector((state) => state.products.products);
    const getPosts = useAppSelector((state) => state.posts.posts);

    const carouselRef = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const hasLoadedProducts = useRef(false);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentFeaturedTab, setCurrentFeaturedTab] = useState("upcoming");
    const [currentSwipIndex, setCurrentSwipIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isInitialCheck, setIsInitialCheck] = useState(true);
    const [lastUsedAuctionId, setLastUsedAuctionId] = useState<string | null>(null);

    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    const featuredTabs = useMemo(() => {
        return [
            {
                title: "即将举行",
                value: "upcoming"
            },
            {
                title: "已结束",
                value: "past"
            },
        ];
    }, []);

    const getCoverImage = useCallback((item: { images: any[] }) => {
        const currentLocale = 'en';
        const [imageEn, imageZh] = item?.images || [];
        return currentLocale === 'en' ? imageEn : imageZh;
    }, []);

    const filterAuctions = useMemo(() => {
        const currentTime = new Date();
        if (currentFeaturedTab === "upcoming") {
            return auctionsTypes.filter(auction => new Date(auction.end_datetime) > currentTime);
        } else {
            return auctionsTypes.filter(auction => new Date(auction.end_datetime) < currentTime);
        }
    }, [auctionsTypes, currentFeaturedTab]);

    // 筛选即将举行的拍卖
    const filterUpcomingAuctions = useCallback((auctions: any[]) => {
        const currentTime = new Date();
        return auctions
            .filter((auction) => new Date(auction.end_datetime) > currentTime)
            .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
            .slice(0, 6);
    }, []);

    // 筛选已结束的拍卖
    const filterPastAuctions = useCallback((auctions: any[]) => {
        const currentTime = new Date();
        return auctions
            .filter((auction) => new Date(auction.end_datetime) <= currentTime)
            .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
            .slice(0, 6);
    }, []);

    // 获取拍卖产品
    const getAuctionProducts = useCallback(async (auction: any) => {
        try {
            console.log("正在获取推荐产品数据")
            await dispatch(filterProductsByCategories({
                store_id: auction._id,
                per_page: 12,
                sort_by: "watchlist_item_count",
                sort_order: "DESC"
            })).unwrap();
        } catch (error) {
            console.error('Error fetching auction products:', error);
            setIsError(true);
        }
    }, [dispatch]);

    // 导航到拍卖详情
    const handleNavigatorDetail = useCallback((auctionId: string) => {
        navigation.dispatch(StackActions.push("AuctionDetail", {
            auction_id: auctionId
        }));
    }, [navigation]);

    // 导航到拍卖页面
    const handleAuctionType = useCallback((auctionId: string) => {
        navigation.dispatch(StackActions.push("Auctions", {
            storeId: auctionId
        }));
    }, [navigation]);

    // 处理专题点击
    const handlePostClick = useCallback((id: string) => {
        navigation.dispatch(StackActions.push("EditorialDetail", {
            id: id
        }));
    }, [navigation]);

    const viewMorePost = useCallback(() => {
        navigation.navigate("Editorial" as never);
    }, [navigation]);

    const handleAuctionClick = useCallback((value: string) => {
        setCurrentFeaturedTab(value);
        setIsInitialCheck(false);
        setCurrentSwipIndex(0);
    }, []);

    const handleSwiperChange = useCallback((index: number) => {
        setCurrentSwipIndex(index);
    }, []);

    const canPrev = useMemo(() => {
        return filterAuctions.length > 0 && currentSwipIndex > 0;
    }, [filterAuctions, currentSwipIndex]);

    const canNext = useMemo(() => {
        return filterAuctions.length > 0 && currentSwipIndex < filterAuctions.length - 1;
    }, [filterAuctions, currentSwipIndex]);

    const handlePrev = useCallback(() => {
        if (canPrev) {
            setCurrentSwipIndex(prev => prev - 1);
            carouselRef.current?.prev();
        }
    }, [canPrev]);

    const handleNext = useCallback(() => {
        if (canNext) {
            setCurrentSwipIndex(prev => prev + 1);
            carouselRef.current?.next();
        }
    }, [canNext]);

    const filterProduct = useMemo(() => {
        return getProducts || [];
    }, [getProducts]);

    const getEditorialPosts = useMemo(() => {
        return (getPosts || []).filter((item: any) => item.static_post);
    }, [getPosts]);

    const topTwoPosts = useMemo(() => {
        return (getPosts || []).slice(0, 2);
    }, [getPosts]);

    const fetchAuctionsPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            setIsError(false);

            await Promise.all([
                dispatch(getAllAuctions(null)).unwrap(),
                dispatch(filterPostsByCategories({ per_page: null })).unwrap()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    const loadRecommendedProducts = useCallback(async () => {
        try {
            const upcomingAuctions = filterUpcomingAuctions(getAuctions);
            const pastAuctions = filterPastAuctions(getAuctions);

            let productsFetched = false;

            if (upcomingAuctions.length > 0) {
                const auction = upcomingAuctions[0];
                await getAuctionProducts(auction);

                if (getProducts && getProducts.length > 0) {
                    productsFetched = true;
                }
            } else {
                if (getProducts.length <= 0) {
                    if (pastAuctions.length > 0) {
                        const sortedPastAuctions = pastAuctions.sort(
                            (a, b) => new Date(b.end_datetime).getTime() - new Date(a.end_datetime).getTime()
                        );
                        const pastAuction = sortedPastAuctions[0];
                        await getAuctionProducts(pastAuction);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading recommended products:', error);
        }
    }, [getAuctions, filterUpcomingAuctions, filterPastAuctions, getAuctionProducts]);

    const handleViewAllPost = useCallback(() => {
        navigation.dispatch(StackActions.push("Editorial"))
    }, [])

    const getRandomAuctionProducts = useCallback(async () => {
        try {
            const upcomingAuctions = filterUpcomingAuctions(getAuctions);
            const pastAuctions = filterPastAuctions(getAuctions);

            const allAvailableAuctions = [...upcomingAuctions, ...pastAuctions];

            if (allAvailableAuctions.length === 0) {
                console.log('没有可用的拍卖');
                return;
            }
            let availableAuctions = allAvailableAuctions;
            if (allAvailableAuctions.length > 1 && lastUsedAuctionId) {
                availableAuctions = allAvailableAuctions.filter(
                    auction => auction._id !== lastUsedAuctionId
                );
            }
            if (availableAuctions.length === 0) {
                availableAuctions = allAvailableAuctions;
            }
            const randomIndex = Math.floor(Math.random() * availableAuctions.length);
            const selectedAuction = availableAuctions[randomIndex];

            console.log('随机选择的拍卖:', selectedAuction.title);

            setLastUsedAuctionId(selectedAuction._id);
            await dispatch(filterProductsByCategories({
                store_id: selectedAuction._id,
                per_page: 12,
                sort_by: "watchlist_item_count",
                sort_order: "DESC"
            })).unwrap();
        } catch (error) {
            console.error('Error fetching random auction products:', error);
            setIsError(true);
        }
    }, [
        getAuctions,
        lastUsedAuctionId,
        filterUpcomingAuctions,
        filterPastAuctions,
        dispatch
    ]);

    useEffect(() => {
        dispatch(fetchAuctionsType());
        fetchAuctionsPosts();
    }, [dispatch, fetchAuctionsType]);

    useEffect(() => {
        if (getAuctions && getAuctions.length > 0 && !hasLoadedProducts.current) {
            hasLoadedProducts.current = true;
            loadRecommendedProducts();
        }
    }, [getAuctions]);

    useEffect(() => {
        if (isInitialCheck && currentFeaturedTab === "upcoming") {
            if (filterAuctions.length === 0) {
                setCurrentFeaturedTab("past");
            }
            setIsInitialCheck(false);
        }
    }, [filterAuctions, isInitialCheck, currentFeaturedTab]);

    return {
        // State
        searchKeyword,
        currentFeaturedTab,
        currentSwipIndex,
        isLoading,
        isError,

        // Refs
        carouselRef,
        progress,

        // Data
        featuredTabs,
        filterAuctions,
        filterProduct,
        topTwoPosts,
        getEditorialPosts,

        // Computed
        canPrev,
        canNext,

        // Methods
        setSearchKeyword,
        handleViewAllPost,
        setCurrentFeaturedTab,
        getCoverImage,
        handleAuctionType,
        handleNavigatorDetail,
        handleAuctionClick,
        handleSwiperChange,
        handlePrev,
        handleNext,
        handlePostClick,
        viewMorePost,
        onPressPagination,
        getRandomAuctionProducts
    };
};

export default useHome;