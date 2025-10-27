import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { pxToVh, pxToVw } from '@/utils/pxToVx';

interface BidDisplayProps {
  auction: {
    auction_type?: 'ONLINE' | 'LIVE';
    status?: string;
  };
  lot: {
    is_bid_placed?: boolean;
    current_bid?: number;
    is_no_reserve_lot?: boolean;
    is_reserve_price_met?: boolean;
    status?: string;
    is_disabled?: boolean;
    is_closed?: boolean;
    sold_price?: number;
    commission_rate?: number;
    winning_bid_customer_id?: string;
  };
  winningBid?: {
    type?: string;
    bid?: number;
  };
  customer?: {
    _id?: string;
  };
  lotBids?: Array<any>;
  lotAllCustomersBids?: Array<{
    customer_id?: string;
  }>;
  isActive: boolean;
  isEnded: boolean;
}

const BidDisplay: React.FC<BidDisplayProps> = ({
  auction,
  lot,
  winningBid,
  customer,
  lotBids = [],
  lotAllCustomersBids = [],
  isActive,
  isEnded,
}) => {
  // 格式化货币
  const formatCurrency = (price: number, currency: string = 'HKD') => {
    if (!price) return '--';
    return `${currency} ${price.toLocaleString()}`;
  };

  // 计算状态
  const isSold = () => {
    if (auction.auction_type === "ONLINE") return false;
    return (
      lot.status === "ACTIVE" &&
      lot.is_disabled &&
      !lot.is_closed
    );
  };

  const isUnsold = () => {
    if (auction.auction_type === "ONLINE") return false;
    return (
      lot.status === "ACTIVE" &&
      lot.is_disabled &&
      lot.is_closed
    );
  };

  const isLotOpen = () => {
    if (auction.auction_type === "ONLINE") return false;
    if (
      auction.status === "ACTIVE" &&
      lot.status === "ACTIVE" &&
      !lot.is_disabled &&
      !lot.is_closed
    )
      return true;
    return false;
  };

  const isUpcoming = () => {
    if (auction.auction_type === "ONLINE") return false;
    return (
      auction.status === "ACTIVE" &&
      lot.status === "ARCHIVED" &&
      !lot.is_disabled &&
      !lot.is_closed
    );
  };

  const isOutbid = () => {
    if (!lot || !isActive) return false;
    if (lot.winning_bid_customer_id === customer?._id) return false;

    return lotAllCustomersBids.some(
      (bid) => bid.customer_id === customer?._id
    );
  };

  const soldPrice = () => {
    return (
      lot.sold_price ||
      (lot.commission_rate
        ? Math.floor(
            (lot.commission_rate / 100 + 1) * (lot.current_bid || 0)
          )
        : lot.current_bid
      )
    );
  };

  const getSelectedExchangeRate = {
    code: 'HKD',
    value: 1,
  };

  return (
    <View style={styles.container}>
      {auction.auction_type === 'ONLINE' ? (
        <>
          {isActive ? (
            <View style={styles.section}>
              <Text style={styles.label}>
                {lot.is_bid_placed ? '目前出价' : '起价'}
                {lot.is_bid_placed && lotBids && lotBids.length > 0 && (
                  <Text style={styles.bidCount}>
                    ({lotBids.length} 我的出价)
                  </Text>
                )}
              </Text>
              <Text style={styles.price}>
                {formatCurrency(
                  lot.current_bid || 0,
                  getSelectedExchangeRate.code
                )}
              </Text>
              
              {!lot.is_no_reserve_lot && lot.is_bid_placed && (
                <Text style={[
                  styles.statusText,
                  lot.is_reserve_price_met ? styles.successText : styles.dangerText
                ]}>
                  {lot.is_reserve_price_met ? '已达到保留价' : '未达到保留价'}
                </Text>
              )}
            </View>
          ) : isEnded ? (
            <View style={styles.section}>
              {lot.is_reserve_price_met && lot.is_bid_placed && (
                <>
                  <Text style={styles.label}>成交价:</Text>
                  <Text style={[styles.price, styles.marginBottom]}>
                    {formatCurrency(
                      soldPrice(),
                      getSelectedExchangeRate.code
                    )}
                  </Text>
                </>
              )}
              <Text style={styles.label}>竞投已结束</Text>
            </View>
          ) : null}
        </>
      ) : (
        <>
          {isLotOpen() ? (
            <View style={styles.section}>
              <Text style={styles.label}>
                {lot.is_bid_placed ? '目前出价' : '起价'}:
              </Text>
              <Text style={styles.price}>
                {formatCurrency(
                  lot.current_bid || 0,
                  getSelectedExchangeRate.code
                )}
              </Text>
              
              {!lot.is_no_reserve_lot && (
                <Text style={[
                  styles.statusText,
                  (lot.is_reserve_price_met && lot.is_bid_placed) 
                    ? styles.successText 
                    : styles.dangerText
                ]}>
                  {(!lot.is_reserve_price_met || !lot.is_bid_placed) 
                    ? '未达到保留价' 
                    : '达到保留价'
                  }
                </Text>
              )}
            </View>
          ) : isSold() ? (
            <View style={styles.section}>
              <Text style={styles.label}>成交价:</Text>
              <Text style={[styles.price, styles.marginBottom]}>
                {formatCurrency(
                  soldPrice(),
                  getSelectedExchangeRate.code
                )}
              </Text>
              <Text style={styles.label}>竞投已结束</Text>
            </View>
          ) : (isUnsold() || isEnded) ? (
            <View style={styles.section}>
              <Text style={styles.label}>竞投已结束</Text>
            </View>
          ) : null}
        </>
      )}

      {isActive && (
        <View style={styles.activeSection}>
          {/* 最高出价者提示 - 暂时注释
          {winningBid && (
            <Text style={[styles.infoText, styles.winningText]}>
              您目前是最高出價者
              {winningBid.type === "DIRECT" ? '您的出價' : '您的最高出價'}:
              {formatCurrency(
                winningBid.bid || 0,
                getSelectedExchangeRate.code
              )}
            </Text>
          )} */}

          {isOutbid() && (
            <Text style={[styles.infoText, styles.outbidText]}>
              您的出价已被超越
              {'\n'}
              同价竞标优先权依时间顺序决定，将由较早提交竞标价格者获得。
            </Text>
          )}

          <TouchableOpacity style={styles.bidStepButton}>
            <Text style={styles.bidStepText}>查看竞价阶梯</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  section: {
    marginBottom: pxToVh(6),
  },
  label: {
    fontSize: pxToVw(14),
    color: '#103947',
    marginBottom: pxToVh(4),
  },
  price: {
    fontSize: pxToVw(16),
    fontWeight: '600',
    color: '#103947',
    marginBottom: pxToVh(4),
  },
  bidCount: {
    fontSize: pxToVw(12),
    color: '#666',
  },
  statusText: {
    fontSize: pxToVw(12),
    marginTop: pxToVh(4),
  },
  successText: {
    color: '#28a745',
  },
  dangerText: {
    color: '#dc3545',
  },
  marginBottom: {
    marginBottom: pxToVh(8),
  },
  activeSection: {
    marginTop: pxToVh(8),
  },
  infoText: {
    fontSize: pxToVw(12),
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: pxToVh(12),
    lineHeight: pxToVw(18),
  },
  winningText: {
    color: '#17a2b8',
  },
  outbidText: {
    color: '#17a2b8',
  },
  bidStepButton: {
    padding: 0,
    marginBottom: pxToVh(12),
  },
  bidStepText: {
    fontSize: pxToVw(14),
    color: '#103947',
    textTransform: 'capitalize',
    textDecorationLine: 'underline',
  },
});

export default BidDisplay;