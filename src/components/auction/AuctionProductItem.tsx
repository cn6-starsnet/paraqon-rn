import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { pxToVh, pxToVw } from '@/utils/pxToVx';
import moment from 'moment';

interface AuctionProductItemProps {
  store_id: string | number;
  product: {
    _id?: string;
    id?: string;
    lot_number?: string | number;
    title?: {
      cn?: string;
      en?: string;
    };
    images?: string[];
    image?: string;
    bid_incremental_settings?: {
      estimate_price?: {
        min?: number;
        max?: number;
      };
    };
    estimate?: {
      low?: number;
      high?: number;
      currency?: string;
    };
    starting_price?: number;
    current_bid?: number;
    hammer_price?: number;
    status?: string;
    is_watching?: boolean;
    is_bid_placed?: boolean;
    is_reserve_price_met?: boolean;
    is_disabled?: boolean;
    is_closed?: boolean;
    end_datetime?: string;
    start_datetime?: string;
    sold_price?: number;
    auction_lot_id?: string;
    auction_lots?: Array<{
      _id?: string | { $oid?: string };
      brand?: { cn?: string };
      is_no_reserve_lot?: boolean;
      commission_rate?: number;
    }>;
    store?: {
      auction_type?: 'ONLINE' | 'LIVE';
      status?: string;
      end_datetime?: string;
      start_datetime?: string;
    };
  };
}

const AuctionProductItem: React.FC<AuctionProductItemProps> = ({
  store_id,
  product,
}) => {
  const navigation = useNavigation();
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 格式化货币
  const formatCurrency = (price: number, currency: string = 'HKD') => {
    if (!price) return '--';
    return `${currency} ${price.toLocaleString()}`;
  };

  // 格式化时间单位（补零）
  const formatTimeUnit = (unit: number) => {
    return unit < 10 ? `0${unit}` : unit.toString();
  };

  // 计算状态
  const isActive = useMemo(() => {
    if (product.store?.auction_type === 'LIVE') {
      if (
        product.store.status === 'ACTIVE' &&
        product.status === 'ACTIVE' &&
        !product.is_disabled &&
        !product.is_closed
      )
        return true;
      return false;
    }
    const today = new Date();
    const end_time = product.end_datetime || product.store?.end_datetime;
    const start_time = product.start_datetime || product.store?.start_datetime;
    return new Date(end_time || '') > today && new Date(start_time || '') <= today;
  }, [product]);

  const isUpcoming = useMemo(() => {
    if (product.store?.auction_type === 'ONLINE') return false;
    return (
      product.store?.status === 'ACTIVE' &&
      product.status === 'ARCHIVED' &&
      !product.is_disabled &&
      !product.is_closed
    );
  }, [product]);

  const isEnded = useMemo(() => {
    if (
      product.store?.auction_type === 'LIVE' &&
      product.store?.status === 'ACTIVE'
    )
      return false;

    const end_time = product.store?.auction_type === 'LIVE'
      ? product.store?.end_datetime
      : product.end_datetime || product.store?.end_datetime;
    
    if (end_time) return new Date(end_time) < new Date();
    return true;
  }, [product]);

  const isSold = useMemo(() => {
    return product.status?.toLowerCase() === 'sold';
  }, [product.status]);

  const isUnsold = useMemo(() => {
    return product.status?.toLowerCase() === 'unsold';
  }, [product.status]);

  // 获取拍卖批次信息
  const auctionLot = useMemo(() => {
    if (!product.auction_lot_id || !product.auction_lots?.length) 
      return null;

    return (
      product.auction_lots.find((lot) => {
        if (!lot._id) return false;

        const lotId = typeof lot._id === 'string' ? lot._id : lot._id?.$oid;
        return lotId === product.auction_lot_id;
      }) || null
    );
  }, [product.auction_lot_id, product.auction_lots]);

  // 计算成交价
  const soldPrice = useMemo(() => {
    return (
      product.sold_price ||
      (auctionLot?.commission_rate
        ? Math.floor(
            (auctionLot.commission_rate / 100 + 1) * (product.current_bid || 0)
          )
        : product.current_bid
      )
    );
  }, [product.sold_price, product.current_bid, auctionLot]);

  // 倒计时计算
  useEffect(() => {
    if (!isActive) return;

    const calculateRemainingTime = () => {
      const now = new Date();
      const end = new Date(
        product.end_datetime || product.store?.end_datetime || ''
      );

      const time_remaining = end.getTime() - now.getTime();

      if (time_remaining <= 0) {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(time_remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (time_remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (time_remaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor(
        (time_remaining % (1000 * 60)) / 1000
      );

      setRemainingTime({ days, hours, minutes, seconds });
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [isActive, product.end_datetime, product.store?.end_datetime]);

  const handlePress = () => {
    navigation.dispatch(StackActions.push(
      'AuctionDetail', {
      id: product.auction_lot_id,
    }));
  };

  const getProductImage = () => {
    if (product.image) return product.image;
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return 'https://via.placeholder.com/200x200?text=No+Image';
  };

  const getSelectedExchangeRate = {
    code: 'HKD',
    value: 1,
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getProductImage() }}
          style={styles.productImage}
          resizeMode='stretch'
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.lotNumber}>拍品 {product.lot_number}</Text>
        
        {auctionLot?.brand && (
          <Text style={styles.brandText}>{auctionLot.brand.cn}</Text>
        )}

        <Text style={styles.title} numberOfLines={2}>
          {product.title?.cn || product.title?.en || '无标题'}
        </Text>

        {/* 估价 */}
        <Text style={styles.smallText}>
          估价: {formatCurrency(product.bid_incremental_settings?.estimate_price?.min || 0)}
          {product.bid_incremental_settings?.estimate_price?.min !== 
           product.bid_incremental_settings?.estimate_price?.max && (
            <>
              - {formatCurrency(product.bid_incremental_settings?.estimate_price?.max || 0)}
            </>
          )}
        </Text>

        {/* ONLINE 拍卖类型 */}
        {product.store?.auction_type === 'ONLINE' && (
          <View style={styles.bidPriceContainer}>
            {isActive ? (
              <View>
                <Text style={styles.smallText}>
                  {product.is_bid_placed ? '目前出價' : '起價'}
                </Text>
                <Text style={styles.priceText}>
                  {formatCurrency(
                    product.current_bid || 0,
                    getSelectedExchangeRate.code
                  )}
                </Text>

                {/* 状态标签 */}
                {auctionLot?.is_no_reserve_lot ? (
                  <Text style={[styles.markText, { color: '#17A2B8' }]}>
                    无底价拍品
                  </Text>
                ) : product.is_reserve_price_met && product.is_bid_placed ? (
                  <Text style={[styles.markText, { color: '#28A745' }]}>
                    已达到保留价
                  </Text>
                ) : product.is_bid_placed ? (
                  <Text style={[styles.markText, { color: 'red' }]}>
                    未达到保留价
                  </Text>
                ) : null}

                {/* 倒计时 */}
                <Text style={styles.timerText}>
                  结束倒计时
                  {remainingTime.days > 0 && ` ${remainingTime.days}d `}
                  {formatTimeUnit(remainingTime.hours)}h
                  {formatTimeUnit(remainingTime.minutes)}m
                  {formatTimeUnit(remainingTime.seconds)}s
                </Text>
              </View>
            ) : isEnded ? (
              <View>
                {product.is_reserve_price_met && product.is_bid_placed ? (
                  <View>
                    <Text>成交价:</Text>
                    <Text style={styles.priceText}>
                      {formatCurrency(
                        soldPrice,
                        getSelectedExchangeRate.code
                      )}
                    </Text>
                  </View>
                ) : null}
                <Text>竞投已结束</Text>
              </View>
            ) : (
              <View>
                {auctionLot?.is_no_reserve_lot && (
                  <Text>无底价拍品</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* LIVE 拍卖类型 */}
        {product.store?.auction_type === 'LIVE' && (
          <View>
            {isActive ? (
              <View>
                <Text style={styles.smallText}>
                  {product.is_bid_placed ? '目前出价' : '起价'}
                </Text>
                <Text style={styles.priceText}>
                  {formatCurrency(
                    product.current_bid || 0,
                    getSelectedExchangeRate.code
                  )}
                </Text>

                {auctionLot?.is_no_reserve_lot ? (
                  <Text>无底价拍品</Text>
                ) : product.is_reserve_price_met && product.is_bid_placed ? (
                  <Text>已达到保留价</Text>
                ) : product.is_bid_placed ? (
                  <Text>未达到保留价</Text>
                ) : null}
              </View>
            ) : isUpcoming ? (
              // 不显示任何内容
              <View />
            ) : isSold ? (
              <View>
                <Text>成交价:</Text>
                <Text style={styles.priceText}>
                  {formatCurrency(
                    soldPrice,
                    getSelectedExchangeRate.code
                  )}
                </Text>
                <Text>竞投已结束</Text>
              </View>
            ) : (isUnsold || isEnded) ? (
              <View>
                <Text>竞投已结束</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: pxToVw(8),
    overflow: 'hidden',
    marginBottom: pxToVh(10),
  },
  imageContainer: {
    width: '100%',
    height: pxToVh(300),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width: '100%',
    height: pxToVh(300),
  },
  infoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: pxToVh(10),
  },
  lotNumber: {
    fontSize: pxToVw(14),
    color: '#103947',
    marginBottom: pxToVh(2.5),
  },
  brandText: {
    fontSize: pxToVw(14),
    color: '#103947',
  },
  title: {
    fontSize: pxToVw(14),
    lineHeight: pxToVw(20),
    color: '#103947',
    display: 'flex',
  },
  smallText: {
    fontSize: pxToVw(14),
    color: '#103947',
  },
  bidPriceContainer: {
    gap: pxToVh(5),
  },
  priceText: {
    fontSize: pxToVw(16),
    color: '#103947',
    fontWeight: '600',
  },
  markText: {
    fontSize: pxToVw(28),
    marginBottom: pxToVh(16),
  },
  timerText: {
    fontSize: pxToVw(14),
    color: '#103947',
  },
});

export default AuctionProductItem;