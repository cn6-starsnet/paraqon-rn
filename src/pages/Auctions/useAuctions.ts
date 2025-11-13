import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAuctionsDetail, fetchAuctionsGoods } from '@/store/slices/productSlice';

const useAuctions = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useAppDispatch();

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [auctionLoading, setAuctionLoading] = useState<boolean>(true);

    const { loading, auctionsGoods, auctionsDetails } = useAppSelector((state) => state.products);

    const storeId = useMemo(() => route.params?.storeId, [route.params]);

    const getBannerImage = useCallback(() => {
        if (!auctionsDetails || !auctionsDetails.images) {
            return 'https://via.placeholder.com/375x166?text=Auction+Banner';
        }
        const [squaredEn, bannerEn, squaredZh, bannerZh] = auctionsDetails.images;
        const locale = "en";
        const banner = locale === 'en' ? bannerEn : (bannerZh || bannerEn);
        const fallback = locale === 'en' ? squaredEn : (squaredZh || squaredEn);
        return banner || fallback || 'https://via.placeholder.com/375x166?text=Auction+Banner';
    }, [auctionsDetails]);

    const toggleCollapse = useCallback((index: number) => {
        setExpandedIndex(prevIndex => prevIndex === index ? null : index);
    }, []);

    const navigateToInfo = useCallback((type: string) => {
        navigation.dispatch(StackActions.push("Information", { type }));
    }, [navigation]);

    const loadAuctionData = useCallback(async () => {
        if (!storeId) {
            console.error('未获取到拍卖ID');
            setAuctionLoading(false);
            return;
        }

        try {
            setAuctionLoading(true);
            await Promise.all([
                dispatch(fetchAuctionsDetail(storeId)),
            ]);

            await dispatch(fetchAuctionsGoods({
                storeId: storeId,
                page: 1,
                sort_by: 'lot_number',
                sort_order: 'ASC',
            }));
        } catch (error) {
            console.error('加载拍卖数据失败:', error);
        } finally {
            setAuctionLoading(false);
        }
    }, [storeId, dispatch]);

    const isDataLoaded = useMemo(() => {
        return !auctionLoading && auctionsDetails?.title?.cn;
    }, [auctionLoading, auctionsDetails]);

    const hasGoods = useMemo(() => {
        return auctionsGoods && auctionsGoods.length > 0;
    }, [auctionsGoods]);

    useEffect(() => {
        loadAuctionData();
    }, [loadAuctionData]);

    return {
        expandedIndex,
        auctionLoading,
        loading,

        auctionsDetails,
        auctionsGoods,
        storeId,

        isDataLoaded,
        hasGoods,

        getBannerImage,
        toggleCollapse,
        navigateToInfo,
    };
};

export default useAuctions;