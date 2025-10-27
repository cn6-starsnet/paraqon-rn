import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { pxToVh, pxToVw } from '@/utils/pxToVx';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAuctionsDetail, fetchAuctionsGoods } from '@/store/slices/productSlice';
import AuctionProductItem from '@/components/auction/AuctionProductItem'; // 确保路径正确
import RenderHTML from 'react-native-render-html';

const Auctions = () => {
  const navigation = useNavigation();
  const { loading, auctionsGoods, auctionsDetails } = useAppSelector((state) => state.products);
  const route = useRoute();
  const storeId = route.params?.storeId;
  const [auctionLoading, setAuctionLoading] = useState<boolean>(true)
  const dispatch = useAppDispatch();

  const [expandedIndex, setExpandedIndex] = useState(null);

  const formatDateTime = (datetime) => {
    return moment(datetime).locale('zh-cn').format('YYYY年M月D日 HH:mm');
  };

  const formatDate = (datetime) => {
    return moment(datetime).locale('zh-cn').format('YYYY年M月D日');
  };

  const getBannerImage = () => {
    if (!auctionsDetails || !auctionsDetails.images) {
      return 'https://via.placeholder.com/375x166?text=Auction+Banner';
    }
    const [squaredEn, bannerEn, squaredZh, bannerZh] = auctionsDetails.images;
    const locale = "en";
    const banner = locale === 'en' ? bannerEn : (bannerZh || bannerEn);
    const fallback = locale === 'en' ? squaredEn : (squaredZh || squaredEn);
    return banner || fallback || 'https://via.placeholder.com/375x166?text=Auction+Banner';
  };

    useEffect(() => {
    if (!storeId) {
      console.error('未获取到拍卖ID');
      setAuctionLoading(false);
      return;
    }

    const loadAuctionData = async () => {
      try {
        setAuctionLoading(true);
        await Promise.all([
          dispatch(fetchAuctionsDetail(storeId)),
        ]);
        
        dispatch(fetchAuctionsGoods({
          storeId: storeId,
          page: 1,
          sort_by: 'lot_number',
          sort_order: 'ASC',
        }))
      } catch (error) {
        console.error('加载拍卖数据失败:', error);
      } finally {
        setAuctionLoading(false); // 无论成功失败，都停止加载
      }
    };

    loadAuctionData();
  }, [storeId, dispatch]);

  const toggleCollapse = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const navigateToInfo = (type: string) => {
    navigation.dispatch(StackActions.push("Information", { type }));
  };

  const renderProductItem = ({ item }) => {
    return (
    <View style={styles.goodsItem}>
      <AuctionProductItem
        store_id={storeId}
        product={item}
      />
    </View>
  )};

  if (auctionLoading && !auctionsDetails?.title?.cn) {
    return <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#103947" />
    </View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.topImageContent}>
        <Image
          source={{ uri: getBannerImage() }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

        <View style={styles.centerContent}>
          <View style={[styles.contentContainer, styles.topContent]}>
            <Text style={styles.topContentTitle}>
              {auctionsDetails.title?.cn}
            </Text>
            
            <Text style={styles.timerPart}>
              {formatDateTime(auctionsDetails.start_datetime)} HKT
              {' - '}
              {formatDateTime(
                auctionsDetails.display_end_datetime || auctionsDetails.end_datetime
              )}{' '}
              HKT
            </Text>

            {auctionsDetails.long_description?.cn && (
              <RenderHTML
                contentWidth={pxToVw(315)}
                source={{ html: auctionsDetails.long_description.cn }}
                tagsStyles={htmlStyles}
              />
            )}

            <View style={styles.linkContent}>
              <TouchableOpacity
                style={styles.linkItem}
                onPress={() => navigateToInfo('conditions-of-business')}
              >
                <Text style={styles.linkText}>查看卖家业务规则</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.linkItem}
                onPress={() => navigateToInfo('important-notice')}
              >
                <Text style={styles.linkText}>查看重要通知</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.contentContainer, styles.auctionDetailsContent]}>
              <Text style={styles.auctionDetailsTitle}>拍卖详情</Text>

              <View style={styles.collapseItem}>
                <TouchableOpacity
                  style={styles.collapseHeader}
                  onPress={() => toggleCollapse(0)}
                >
                  <Text style={styles.collapseTitle}>拍卖资讯</Text>
                  <Text style={styles.collapseIcon}>
                    {expandedIndex === 0 ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>

                {expandedIndex === 0 && (
                  <View style={styles.questionItemList}>
                    <Text style={styles.infoText}>
                      {formatDateTime(auctionsDetails.start_datetime)} HKT
                      {auctionsDetails.end_datetime &&
                        auctionsDetails.auction_type === 'ONLINE' && (
                          <>
                            {' - '}
                            {formatDateTime(
                              auctionsDetails.display_end_datetime ||
                                auctionsDetails.end_datetime
                            )}{' '}
                            HKT
                          </>
                        )}
                    </Text>

                    <Text style={styles.infoText}>
                      地点: {auctionsDetails.auction_address?.cn}
                    </Text>

                    {auctionsDetails.viewing_start_datetime && (
                      <>
                        <Text style={styles.infoText}>
                          预展时间与地址:{' '}
                          {formatDate(auctionsDetails.viewing_start_datetime)} -{' '}
                          {formatDate(auctionsDetails.viewing_end_datetime)}
                        </Text>
                        {auctionsDetails.viewing_address && (
                          <Text style={styles.infoText}>
                            {auctionsDetails.viewing_address.cn}
                          </Text>
                        )}
                      </>
                    )}

                    {auctionsDetails.opening_hours?.length > 0 &&
                      auctionsDetails.opening_hours.map((each, index) => (
                        <Text key={index} style={styles.infoText}>
                          {each.title?.cn} {each.start_time} - {each.end_time}
                        </Text>
                      ))}
                  </View>
                )}
              </View>

              <View style={styles.collapseItem}>
                <TouchableOpacity
                  style={styles.collapseHeader}
                  onPress={() => toggleCollapse(1)}
                >
                  <Text style={styles.collapseTitle}>联系方式</Text>
                  <Text style={styles.collapseIcon}>
                    {expandedIndex === 1 ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>

                {expandedIndex === 1 && (
                  <View style={styles.questionItemList}>
                    {auctionsDetails.contact_info?.name?.cn && (
                      <Text style={styles.infoText}>
                        {auctionsDetails.contact_info.name.cn}
                      </Text>
                    )}
                    {auctionsDetails.contact_info?.position?.cn && (
                      <Text style={styles.infoText}>
                        {auctionsDetails.contact_info.position.cn}
                      </Text>
                    )}
                    {auctionsDetails.contact_info?.phone && (
                      <Text style={styles.infoText}>
                        {auctionsDetails.contact_info.phone}
                      </Text>
                    )}
                    {auctionsDetails.contact_info?.email && (
                      <Text style={styles.infoText}>
                        {auctionsDetails.contact_info.email}
                      </Text>
                    )}
                  </View>
                )}
              </View>
          </View>

          <View style={styles.goodsContainer}>
            {loading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#103947" />
                <Text style={styles.loadingText}>加载中...</Text>
              </View>
            ) : auctionsGoods && auctionsGoods.length > 0 ? (
              <View style={styles.goodsList}>
                <FlatList
                  scrollEnabled={false}
                  data={auctionsGoods}
                  renderItem={renderProductItem}
                  keyExtractor={item => item._id}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无拍品</Text>
              </View>
            )}
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  topImageContent: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  bannerImage: {
    width: '100%',
    height: pxToVh(366),
  },
  centerContent: {
    width: '100%',
    paddingHorizontal: pxToVw(15),
    paddingTop: pxToVh(30),
    paddingBottom: pxToVh(15),
    gap: pxToVh(20),
  },
  scrollView: {
    paddingHorizontal: pxToVw(15),
    gap: pxToVh(20),
  },
  contentContainer: {
    paddingBottom: pxToVh(25),
  },
  topContent: {
    gap: pxToVh(10),
  },
  topContentTitle: {
    fontSize: pxToVw(22),
    fontWeight: '600',
    lineHeight: pxToVw(26.4),
    color: '#103947',
  },
  timerPart: {
    fontSize: pxToVw(14),
    fontWeight: '400',
    color: '#103947',
  },
  linkContent: {
    gap: pxToVh(10),
    marginTop: pxToVh(10),
  },
  linkItem: {
    width: '100%',
  },
  linkText: {
    color: '#103947',
    fontSize: pxToVw(14),
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
  },
  auctionDetailsContent: {
    gap: pxToVh(10),
  },
  auctionDetailsTitle: {
    fontSize: pxToVw(18),
    fontWeight: '500',
    letterSpacing: 0.03,
    color: '#103947',
  },
  collapseItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    paddingVertical: pxToVh(12),
  },
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pxToVh(8),
  },
  collapseTitle: {
    fontSize: pxToVw(18),
    color: '#103947',
    flex: 1,
  },
  collapseIcon: {
    fontSize: pxToVw(12),
    color: '#103947',
  },
  questionItemList: {
    paddingHorizontal: pxToVw(5),
    paddingTop: pxToVh(10),
    gap: pxToVh(7.5),
  },
  infoText: {
    fontSize: pxToVw(14),
    lineHeight: pxToVw(20),
    color: '#103947',
  },
  goodsContainer: {
    width: '100%',
    paddingBottom: pxToVh(50),
  },
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pxToVh(40),
  },
  loadingText: {
    marginTop: pxToVh(10),
    fontSize: pxToVw(14),
    color: '#103947',
  },
  goodsList: {
    width: '100%',
    gap: pxToVh(15),
  },
  goodsItem: {
    // width: '100%',
    flex: 1,
    marginBottom: pxToVh(10),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pxToVh(60),
  },
  emptyText: {
    fontSize: pxToVw(16),
    color: '#999',
  },
  row: {
    justifyContent: 'space-between',  // 或 'space-around'
    paddingHorizontal: pxToVw(15),
    gap: pxToVw(12),
    marginBottom: pxToVh(10),
  },
});

const htmlStyles = {
  p: {
    fontSize: pxToVw(14),
    lineHeight: pxToVw(22.4),
    color: '#103947',
    marginBottom: pxToVh(8),
  },
  div: {
    fontSize: pxToVw(14),
    lineHeight: pxToVw(22.4),
    color: '#103947',
  },
};

export default Auctions;