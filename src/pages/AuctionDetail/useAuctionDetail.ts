import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSharedValue } from 'react-native-reanimated';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAuctionLotAllBids, getAuctionLotDetails } from '@/store/slices/auctionLotSlice';
import { getAuctionDetails } from '@/store/slices/auctionSlice';
import { getAllAuctionLotsAndNumber } from '@/store/slices/productSlice';

const useAuctionDetail = () => {
    const dispatch = useAppDispatch();
    const route = useRoute();
    const navigation = useNavigation();

    // State
    const [currentSwipIndex, setCurrentSwipIndex] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [acutionLotId, setAcutionLotId] = useState('');
    const [storeId, setStoreId] = useState('');
    const [lotNumber, setLotNumber] = useState(null);

    // Redux Selectors
    const getAuction = useAppSelector(state => state.auctions.auction);
    const getAuctionLot = useAppSelector(state => state.auctionLot.auction_lot);
    const getAuctionLotBids = useAppSelector(state => state.auctionLot.auction_lot_all_bids);
    const getLotList = useAppSelector(state => state.products.log_list);

    // Refs
    const carouselRef = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const getDisplayProductImages = useMemo(() => {
        return (getAuctionLot?.product?.images) || [];
    }, [getAuctionLot?.product?.images]);

    const isEnded = useCallback(() => {
        if (getAuction?.auction_type === "LIVE" && getAuction?.status === "ACTIVE") {
            return false;
        }

        if (!getAuctionLot) return false;

        const endTime = getAuction?.auction_type === "LIVE"
            ? getAuction?.end_datetime
            : getAuctionLot?.end_datetime || getAuction?.end_datetime;

        const now = new Date();
        return endTime ? new Date(endTime) < now : true;
    }, [getAuction, getAuctionLot]);

    const isActive = useCallback(() => {
        if (getAuction?.auction_type === "LIVE") {
            return getAuction?.status === "ACTIVE";
        }

        const today = new Date();
        const end = new Date(getAuctionLot?.end_datetime || getAuction?.end_datetime);
        const start = new Date(getAuctionLot?.start_datetime || getAuction?.start_datetime);

        return getAuctionLot?.status === "ACTIVE" && end > today && start <= today;
    }, [getAuction, getAuctionLot]);

    const init = useCallback(async (auctionLotId: string) => {
        try {
            const auctionLotData = await dispatch(getAuctionLotDetails(auctionLotId)).unwrap();

            setStoreId(auctionLotData.store_id);
            setLotNumber(auctionLotData.lot_number);

            await Promise.all([
                dispatch(getAuctionDetails(auctionLotData.store_id)),
                dispatch(getAllAuctionLotsAndNumber({ store_id: auctionLotData.store_id })),
                dispatch(getAuctionLotAllBids(auctionLotId)),
            ]);
        } catch (error) {
            console.error('初始化错误:', error);
        }
    }, [dispatch]);

    const changeLot = useCallback((product) => {
        if (acutionLotId !== product.auction_lot_id) {
            (navigation as any).navigate('AuctionDetail', { id: product.auction_lot_id });
        }
        setShowDropdown(false);
    }, [acutionLotId, navigation]);

    const prevLot = useCallback(() => {
        const currentIndex = getLotList.findIndex(
            (product) => product.lot_number === lotNumber
        );
        const prevLot = getLotList[currentIndex - 1];
        if (prevLot) changeLot(prevLot);
    }, [getLotList, lotNumber, changeLot]);

    const nextLot = useCallback(() => {
        const currentIndex = getLotList.findIndex(
            (product) => product.lot_number === lotNumber
        );
        const nextLot = getLotList[currentIndex + 1];
        if (nextLot) changeLot(nextLot);
    }, [getLotList, lotNumber, changeLot]);

    const onPressPagination = useCallback((index: number) => {
        carouselRef.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    }, [progress]);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(prev => !prev);
    }, []);

    const closeDropdown = useCallback(() => {
        setShowDropdown(false);
    }, []);

    const canNavigatePrev = useMemo(() => {
        return lotNumber !== getLotList[0]?.lot_number;
    }, [lotNumber, getLotList]);

    const canNavigateNext = useMemo(() => {
        return lotNumber !== getLotList[getLotList.length - 1]?.lot_number;
    }, [lotNumber, getLotList]);

    useEffect(() => {
        const { id } = route.params as { id: string };
        setAcutionLotId(id);
        init(id);
    }, [route.params, init]);

    return {
        // State
        currentSwipIndex,
        showDropdown,
        acutionLotId,
        storeId,
        lotNumber,

        // Refs
        carouselRef,
        progress,

        // Redux data
        getAuction,
        getAuctionLot,
        getAuctionLotBids,
        getLotList,

        // Computed
        getDisplayProductImages,
        canNavigatePrev,
        canNavigateNext,

        // Methods
        isEnded,
        isActive,
        changeLot,
        prevLot,
        nextLot,
        onPressPagination,
        toggleDropdown,
        closeDropdown,
        setCurrentSwipIndex,
    };
};

export default useAuctionDetail;