import { pxToVh, pxToVw, screenWidth } from "@/utils/pxToVx";
import { FC } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useHome from "./useHome";
import Carousel, {
    Pagination,
} from "react-native-reanimated-carousel";
import PrevIcon from '@svgs/common/arrow_left.svg'
import NextIcon from '@svgs/common/arrow_right.svg'
import SearchIcon from '@svgs/common/icon_search.svg'
import RefreshIcon from '@svgs/tabs/icon_refresh.svg'
import AuctionProductItem from "@/components/auction/AuctionProductItem";

const Home: FC = () => {
    const insets = useSafeAreaInsets();
    const { progress, carouselRef, topTwoPosts, featuredTabs, searchKeyword, filterProduct, setSearchKeyword, filterAuctions, currentFeaturedTab, getRandomAuctionProducts, handlePostClick, handleViewAllPost, onPressPagination, handleAuctionType, setCurrentFeaturedTab } = useHome();

    const renderProductItem = ({ item }) => {
        return (
            <View style={styles.goodsItem}>
                <AuctionProductItem
                    product={item}
                />
            </View>
        )
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={[styles.container, {
                paddingTop: insets.top + 20
            }]}>
                <View style={styles.searchContainer}>
                    <SearchIcon />
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearchKeyword}
                        value={searchKeyword}
                        placeholder="请输入搜索的内容"
                    />
                </View>
                <Text style={styles.rowTitle}>精选拍卖</Text>
                <View style={styles.featuredTabs}>
                    {featuredTabs.map(featuredTabItem => (
                        <TouchableOpacity activeOpacity={0.8} style={styles.featuredTabItem} key={featuredTabItem.value} onPress={() => setCurrentFeaturedTab(featuredTabItem.value)}>
                            <Text style={[styles.featuredTabItemText, featuredTabItem.value === currentFeaturedTab && styles.activeTabText]}>{featuredTabItem.title}</Text>
                            {featuredTabItem.value === currentFeaturedTab && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>
                {filterAuctions.length > 0 ? <View style={styles.carouselContainer}>
                    <Carousel
                        ref={carouselRef}
                        width={screenWidth - pxToVw(50)}
                        height={pxToVh(650)}
                        data={filterAuctions}
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 0.9,
                            parallaxScrollingOffset: 50,
                        }}
                        onProgressChange={progress}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity activeOpacity={0.7} style={styles.carouseItem} onPress={() => handleAuctionType(item._id)}>
                                    <Image resizeMode="stretch" height={pxToVh(650)} source={{ uri: item.images[0] }} />
                                    <View style={styles.descContent}>
                                        <Text style={styles.descText}>{item.title['cn']}</Text>
                                        <Text style={styles.descText}>
                                            {item.start_datetime}
                                            {item.end_datetime && item.start_datetime != item.end_datetime && (
                                                item.end_datetime
                                            )}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />

                    <Pagination.Basic
                        progress={progress}
                        data={filterAuctions}
                        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
                        containerStyle={{ gap: 5, marginTop: 10 }}
                        onPress={onPressPagination}
                    />

                    <View style={styles.nextPrevBtns}>
                        <TouchableOpacity style={[styles.arrowBtn]} activeOpacity={0.7} onPress={() => { onPressPagination(progress.value - 1) }}>
                            <PrevIcon />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.arrowBtn]} activeOpacity={0.7} onPress={() => { onPressPagination(progress.value + 1) }}>
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
                <View style={styles.otherPartContainer}>
                    <View style={styles.recommandAuctionContainer}>
                        <View style={styles.recommandHeader}>
                            <Text style={styles.headerTitle}>推荐拍品</Text>
                            <TouchableOpacity onPress={getRandomAuctionProducts} activeOpacity={0.7} style={styles.headerRight}>
                                <RefreshIcon width={20} />
                                <Text style={styles.rightDesc}>换一换</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.goodsContainer}>
                            {
                                filterProduct && filterProduct.length > 0 && (
                                    <View style={styles.goodsList}>
                                        <FlatList
                                            scrollEnabled={false}
                                            data={filterProduct}
                                            renderItem={renderProductItem}
                                            keyExtractor={item => item._id}
                                            numColumns={2}
                                            columnWrapperStyle={styles.row}
                                        />
                                    </View>
                                )
                            }
                        </View>
                    </View>
                    <View style={styles.recommandAuctionContainer}>
                        <View style={styles.recommandHeader}>
                            <Text style={styles.headerTitle}>最新专题</Text>
                            <TouchableOpacity activeOpacity={0.7} style={styles.headerRight} onPress={handleViewAllPost}>
                                <Text style={styles.rightDesc}>查看全部</Text>
                                <NextIcon width={16} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.latestFeatureList}>
                            {
                                topTwoPosts.map((postItem) => (
                                    <TouchableOpacity style={styles.postItemContainer} activeOpacity={0.8} key={postItem._id} onPress={() => handlePostClick(postItem._id)}>
                                        <Image style={styles.postImage} source={{
                                            uri: postItem.content.main.images[0]
                                        }} />
                                        <View style={styles.postItemContent}>
                                            <Text style={styles.postDateTime}>{postItem?.published_at}</Text>
                                            <Text style={styles.postTitle}>{postItem.content.hero.title['cn']}</Text>
                                            <Text
                                                style={styles.postDescription}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                {postItem.content.hero.description['cn'].replace(/<[^>]*>/g, '')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: pxToVh(16),
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: pxToVw(8),
        borderColor: "#103947",
        borderWidth: 1,
        width: '80%',
        paddingHorizontal: pxToVw(8),
        marginBottom: pxToVh(10)
    },
    input: {
        flex: 1,
    },
    rowTitle: {
        fontSize: pxToVw(21),
        textAlign: 'center'
    },
    featuredTabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: pxToVw(24),
        paddingTop: pxToVh(12)
    },
    featuredTabItem: {
        position: 'relative',
        paddingHorizontal: pxToVw(16),
        paddingVertical: pxToVh(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredTabItemText: {
        fontSize: pxToVw(14),
        color: '#103947',
        opacity: 0.6,
    },
    activeTabText: {
        opacity: 1,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '80%',
        height: 2,
        backgroundColor: '#869599ff',
        alignSelf: 'center',
    },
    carouseItem: {
        position: 'relative'
    },
    descContent: {
        color: '#fff',
        position: 'absolute',
        bottom: pxToVh(40),
        left: pxToVw(30),
        maxWidth: '80%',
        fontSize: pxToVw(12)
    },
    descText: {
        color: '#fff',
        fontSize: pxToVw(12),
        paddingTop: pxToVh(10)
    },
    carouselContainer: {
        paddingTop: pxToVh(14),
        paddingBottom: pxToVh(20)
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
    },
    otherPartContainer: {
        width: '100%',
        backgroundColor: "#eeeeee90",
        paddingHorizontal: pxToVw(20),
        paddingVertical: pxToVh(12),
        gap: pxToVh(20)
    },
    recommandAuctionContainer: {
        width: '100%',
    },
    recommandHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: pxToVh(20)
    },
    headerTitle: {
        fontSize: pxToVw(16),
        color: '#103947'
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: pxToVw(5)
    },
    rightDesc: {
        color: '#333333',
        fontSize: pxToVw(12)
    },
    latestFeatureList: {
        gap: pxToVh(32),
        paddingVertical: pxToVh(32)
    },
    postItemContainer: {
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: pxToVw(12),
        borderBottomRightRadius: pxToVw(12)
    },
    postImage: {
        width: '100%',
        height: pxToVh(300)
    },
    postItemContent: {
        paddingHorizontal: pxToVw(12),
        paddingVertical: pxToVh(12),
        gap: pxToVh(12),
    },
    postDateTime: {
        fontSize: pxToVw(12),
        color: '#103947',
    },
    postTitle: {
        fontSize: pxToVw(16),
        color: '#103947',
    },
    postDescription: {
        fontSize: pxToVw(14),
        lineHeight: pxToVw(22.4),
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
        justifyContent: 'space-between',
        gap: pxToVw(12),
        marginBottom: pxToVh(10),
    },
})

export default Home;