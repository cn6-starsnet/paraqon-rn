import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import BidDisplay from '@/components/auction/BidDisplay';
import LotDescription from '@/components/auction/LotDescription';

// 工具函数
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAuctionLotAllBids, getAuctionLotDetails } from '@/store/slices/auctionLotSlice';
import { getAuctionDetails } from '@/store/slices/auctionSlice';
import { getAllAuctionLotsAndNumber } from '@/store/slices/productSlice';
import RenderHTML from 'react-native-render-html';
import { formatCurrency } from '@/utils/format';
import { pxToVh, pxToVw } from '@/utils/pxToVx';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import PrevIcon from '@svgs/common/arrow_left.svg'
import NextIcon from '@svgs/common/arrow_right.svg'
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { formatCurrency, formatRichText } from '@/utils/format';

const { width: screenWidth } = Dimensions.get('window');

const AuctionDetail = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const [currentSwipIndex, setCurrentSwipIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [acutionLotId, setAcutionLotId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [lotNumber, setLotNumber] = useState(null);
  const insets = useSafeAreaInsets();

  const getAuction = useAppSelector(state => state.auctions.auction);
  const getAuctionLot = useAppSelector(state => state.auctionLot.auction_lot);
  const getAuctionLotBids = useAppSelector(state => state.auctionLot.auction_lot_all_bids);
  const getLotList = useAppSelector(state => state.products.log_list);

  const carouselRef = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const getDisplayProductImages = useMemo(() => {
    return (getAuctionLot?.product?.images) || [];
  }, []);

  const getProductInfo = () => {
    return getAuctionLot?.product || {};
  };

  const isEnded = () => {
    if (getAuction?.auction_type === "LIVE" && getAuction?.status === "ACTIVE") {
      return false;
    }

    if (!getAuctionLot) return false;
    
    const endTime = getAuction?.auction_type === "LIVE"
      ? getAuction?.end_datetime
      : getAuctionLot?.end_datetime || getAuction?.end_datetime;
      
    const now = new Date();
    return endTime ? new Date(endTime) < now : true;
  };

  const isActive = () => {
    if (getAuction?.auction_type === "LIVE") {
      return getAuction?.status === "ACTIVE";
    }

    const today = new Date();
    const end = new Date(getAuctionLot?.end_datetime || getAuction?.end_datetime);
    const start = new Date(getAuctionLot?.start_datetime || getAuction?.start_datetime);
    
    return getAuctionLot?.status === "ACTIVE" && end > today && start <= today;
  };

const init = useCallback(async (auctionLotId: string) => {
  try {
    const auctionLotData = await dispatch(getAuctionLotDetails(auctionLotId)).unwrap();
    
    setStoreId(auctionLotData.store_id);
    setLotNumber(auctionLotData.lot_number);
    await Promise.all([
      dispatch(getAuctionDetails(auctionLotData.store_id)),
      dispatch(getAllAuctionLotsAndNumber({ store_id:auctionLotData.store_id})),
      dispatch(getAuctionLotAllBids(auctionLotId)),
    ]);
  } catch (error) {
    console.error('初始化错误:', error);
  }
}, [dispatch]);

  const changeLot = (product) => {
    if (acutionLotId !== product.auction_lot_id) {
      navigation.navigate('AuctionDetail', { id: product.auction_lot_id });
    }
    setShowDropdown(false);
  };

  const prevLot = () => {
    const currentIndex = getLotList.findIndex(
      (product) => product.lot_number === lotNumber
    );
    const prevLot = getLotList[currentIndex - 1];
    if (prevLot) changeLot(prevLot);
  };

  const nextLot = () => {
    const currentIndex = getLotList.findIndex(
      (product) => product.lot_number === lotNumber
    );
    const nextLot = getLotList[currentIndex + 1];
    if (nextLot) changeLot(nextLot);
  };
  
  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
        count: index - progress.value,
        animated: true,
    });
  };

  useEffect(() => {
    const { id } = route.params;
    setAcutionLotId(id);
    init(id);
  }, [route.params, init]);

  return (
      <View style={[styles.container,{paddingBottom: insets.bottom}]}>
        <View style={styles.auctionHeader}>
          <Text style={styles.headerText}>
            {getAuction?.title?.cn} -
            {getAuction?.start_datetime && (
              <Text>
                {moment(getAuction.start_datetime).format('lll')}
              </Text>
            )}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.mainContainer}>
          <View style={styles.swiperContainerBox}>
            <View style={styles.topContent}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={prevLot}
                disabled={lotNumber === getLotList[0]?.lot_number}
              >
                {/* <Icon
                  name="left"
                  size={17.5}
                  color={lotNumber === getLotList[0]?.lot_number ? '#ccc' : '#103947'}
                /> */}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownText}>拍品{getAuctionLot?.lot_number}</Text>
                {/* <Icon name="down" size={16} color="#103947" /> */}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={nextLot}
                disabled={lotNumber === getLotList[getLotList.length - 1]?.lot_number}
              >
                {/* <Icon
                  name="right"
                  size={17.5}
                  color={lotNumber === getLotList[getLotList.length - 1]?.lot_number ? '#ccc' : '#103947'}
                /> */}
              </TouchableOpacity>
            </View>

            {/* 下拉框内容 */}
            <Modal
              visible={showDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setShowDropdown(false)}
              >
                <View style={styles.dropdownContent}>
                  {getLotList.map((product, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => changeLot(product)}
                    >
                      <Text style={styles.dropdownItemText}>拍品{product?.lot_number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* 轮播图 */}
            {getDisplayProductImages.length > 0 ? <View style={styles.carouselContainer}>
                                <Carousel
                                    ref={carouselRef}
                                    width={screenWidth - pxToVw(50)}
                                    height={pxToVh(650)}
                                    data={getDisplayProductImages}
                                    mode="parallax"
                                    modeConfig={{
                                        parallaxScrollingScale: 0.9,
                                        parallaxScrollingOffset: 50,
                                    }}
                                    onProgressChange={progress}
                                    renderItem={({item}) => {
                                     return   (
                                        <Image resizeMode="stretch" height={pxToVh(600)} source={{ uri: item }}/>
                                    )}}
                                />
                            
                                <Pagination.Basic
                                    progress={progress}
                                    data={getDisplayProductImages}
                                    dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
                                    containerStyle={{ gap: 5, marginTop: 10 }}
                                    onPress={onPressPagination}
                                />
            
                                <View style={styles.nextPrevBtns}>
                                    <TouchableOpacity style={[styles.arrowBtn]} activeOpacity={0.7} onPress={() => {onPressPagination(progress.value - 1)}}>
                                        <PrevIcon />
                        </TouchableOpacity>
                                    <TouchableOpacity style={[styles.arrowBtn]} activeOpacity={0.7} onPress={() => {onPressPagination(progress.value + 1)}}>
                                        <NextIcon />
                        </TouchableOpacity>
                      </View>
                            </View> : 
                                <View style={styles.noDataContainer}>
                                    <Image 
                                        width={pxToVw(140)}
                                        source={{
                                            uri: "https://starsnet-production.oss-cn-hongkong.aliyuncs.com/png/a19291d0-74b6-4e1e-84b0-5725409ff3ca.png"
                                        }}
                                    />
                                    <Text style={styles.noDataText}>敬请期待</Text>
                                </View>
                            }
          </View> 

          <View style={styles.infoContainer}>
            <Text style={styles.lotNumberText}>
              拍品 {getAuctionLot?.lot_number}
              {getAuctionLot?.is_no_reserve_lot && (
                <Text style={styles.noReserve}>(无底价拍品)</Text>
              )}
            </Text>
            
            <Text style={styles.brandText}>{getAuctionLot?.brand?.cn}</Text>
            <Text style={styles.brandText}>{getAuctionLot?.title?.cn}</Text>
            <View style={styles.description}>
              <RenderHTML source={{
                html: getAuctionLot?.short_description?.cn
              }}/>
            </View>
            
            <Text style={styles.smallSize}>
              估价: {formatCurrency({ price: getAuctionLot?.bid_incremental_settings?.estimate_price?.min })}
              {getAuctionLot?.bid_incremental_settings?.estimate_price?.min !== 
               getAuctionLot?.bid_incremental_settings?.estimate_price?.max && (
                <Text>
                  - {formatCurrency({ price: getAuctionLot?.bid_incremental_settings?.estimate_price?.max })}
                </Text>
              )}
            </Text>
          </View>

          <BidDisplay
            auction={getAuction}
            lot={getAuctionLot}
            isActive={isActive()}
            isEnded={isEnded()}
            lotAllCustomersBids={getAuctionLotBids || []}
          />

          <LotDescription auction={getAuction} />
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
  },
  carouselContainer: {
    paddingTop: pxToVh(14),
  },
  auctionHeader: {
    padding: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  headerText: {
    color: '#333',
    fontSize: 16,
  },
  mainContainer: {
    paddingHorizontal: pxToVw(15),
    width: '100%',
    gap: pxToVh(15),
  },
  swiperContainerBox: {
    width: '100%',
    paddingBottom: 60,
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
  },
  topContent: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownText: {
    fontSize: 18,
    color: '#103947',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 400,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  swipeContainer: {
    width: '100%',
    gap: 30,
  },
  swipeList: {
    width: '100%',
    height: 400,
  },
  swiperContainer: {
    height: 400,
  },
  swiperImgItem: {
    width: '100%',
    height: 400,
  },
  swiperImg: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  indicatorImages: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  imageItem: {
    flex: 1,
    height: 80,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeImageItem: {
    borderColor: '#103947',
  },
  indicatorImg: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    width: 78,
    height: 78,
    position: 'absolute',
    top: '30%',
    borderRadius: 39,
    backgroundColor: '#103947',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevBtn: {
    left: 25,
  },
  nextBtn: {
    right: 25,
  },
  disabledArrow: {
    backgroundColor: '#c7c9cd',
    opacity: 0.5,
  },
  noData: {
    width: '100%',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'column',
    gap: pxToVh(8),
  },
  lotNumberText: {
    fontSize: 14,
    marginBottom: 16,
  },
  noReserve: {
    color: '#17A2B8',
  },
  brandText: {
    fontSize: 20,
  },
  description: {
    // fontSize: 16,
  },
  smallSize: {
    fontSize: 14,
    color: '#666',
  },
  nextPrevBtns: {
        flexDirection:'row',
        justifyContent:'center',
        gap: pxToVw(12),
        marginTop: pxToVh(40)
    },
    arrowBtn: {
        width: pxToVw(34),
        height: pxToVw(34),
        borderRadius: '50%',
        borderWidth: pxToVw(2),
        borderColor: '#103947',
        justifyContent: 'center',
        alignItems: 'center'
    },
    arrowDisabled: {
        borderColor: '#c7c9cd',
        opacity: 0.5
    },
    noDataContainer: {
        width: '100%',
        alignItems: 'center'
    },
    noDataText: {
        fontSize: pxToVw(18),
        color: '#103947'
    }
});

export default AuctionDetail;