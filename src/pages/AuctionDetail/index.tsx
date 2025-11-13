// AuctionDetail.tsx
import React, { FC } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import RenderHTML from 'react-native-render-html';

import BidDisplay from '@/components/auction/BidDisplay';
import LotDescription from '@/components/auction/LotDescription';
import PrevIcon from '@svgs/common/arrow_left.svg';
import NextIcon from '@svgs/common/arrow_right.svg';

import { formatCurrency } from '@/utils/format';
import { pxToVh, pxToVw } from '@/utils/pxToVx';
import useAuctionDetail from './useAuctionDetail';

const { width: screenWidth } = Dimensions.get('window');

const AuctionDetail: FC = () => {
  const insets = useSafeAreaInsets();

  const {
    showDropdown,

    carouselRef,
    progress,

    getAuction,
    getAuctionLot,
    getAuctionLotBids,
    getLotList,

    getDisplayProductImages,
    canNavigatePrev,
    canNavigateNext,

    isEnded,
    isActive,
    changeLot,
    prevLot,
    nextLot,
    onPressPagination,
    toggleDropdown,
    closeDropdown,
  } = useAuctionDetail();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
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
              disabled={!canNavigatePrev}
            >
              <PrevIcon color={!canNavigatePrev ? '#ccc' : '#103947'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdown}
              onPress={toggleDropdown}
            >
              <Text style={styles.dropdownText}>拍品{getAuctionLot?.lot_number}</Text>
              {/* <Icon name="down" size={16} color="#103947" /> */}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={nextLot}
              disabled={!canNavigateNext}
            >
              <NextIcon color={!canNavigateNext ? '#ccc' : '#103947'} />
            </TouchableOpacity>
          </View>

          {/* 下拉框内容 */}
          <Modal
            visible={showDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={closeDropdown}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={closeDropdown}
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
          {getDisplayProductImages.length > 0 ? (
            <View style={styles.carouselContainer}>
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
                renderItem={({ item }: { item: string }) => {
                  return (
                    <Image
                      resizeMode="stretch"
                      style={{ height: pxToVh(600) }}
                      source={{ uri: item }}
                    />
                  );
                }}
              />

              <Pagination.Basic
                progress={progress}
                data={getDisplayProductImages}
                dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
                containerStyle={{ gap: 5, marginTop: 10 }}
                onPress={onPressPagination}
              />

              <View style={styles.nextPrevBtns}>
                <TouchableOpacity
                  style={styles.arrowBtn}
                  activeOpacity={0.7}
                  onPress={() => onPressPagination(progress.value - 1)}
                >
                  <PrevIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.arrowBtn}
                  activeOpacity={0.7}
                  onPress={() => onPressPagination(progress.value + 1)}
                >
                  <NextIcon />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Image
                style={{ width: pxToVw(140), height: pxToVw(140) }}
                source={{
                  uri: "https://starsnet-production.oss-cn-hongkong.aliyuncs.com/png/a19291d0-74b6-4e1e-84b0-5725409ff3ca.png"
                }}
              />
              <Text style={styles.noDataText}>敬请期待</Text>
            </View>
          )}
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
            <RenderHTML
              source={{
                html: getAuctionLot?.short_description?.cn || ''
              }}
            />
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
  // ... 保持你的 styles 不变
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
  description: {},
  smallSize: {
    fontSize: 14,
    color: '#666',
  },
  nextPrevBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: pxToVw(12),
    marginTop: pxToVh(40)
  },
  arrowBtn: {
    width: pxToVw(34),
    height: pxToVw(34),
    borderRadius: pxToVw(17),
    borderWidth: pxToVw(2),
    borderColor: '#103947',
    justifyContent: 'center',
    alignItems: 'center'
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