import { pxToVh, pxToVw, screenWidth } from "@/utils/pxToVx";
import { FC } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useHome from "./useHome";
// import Carousel from "react-native-reanimated-carousel";

const Home: FC = () => {
    const insets = useSafeAreaInsets();
    // const { progress, carouselRef, featuredTabs, auctionsType, currentFeaturedTab, onPressPagination, setCurrentFeaturedTab } = useHome();
    const { featuredTabs, filterAuctions, currentFeaturedTab, getCoverImage, handleAuctionType, setCurrentFeaturedTab } = useHome();
    return (
        <ScrollView>
            <View style={[styles.container, {
                paddingTop: insets.top + 20
            }]}>
                <Text style={styles.rowTitle}>精选拍卖</Text>
                <View style={styles.featuredTabs}>
                    {featuredTabs.map(featuredTabItem => (
                        <TouchableOpacity activeOpacity={0.8} style={styles.featuredTabItem} key={featuredTabItem.value} onPress={() => setCurrentFeaturedTab(featuredTabItem.value)}>
                            <Text style={[styles.featuredTabItemText, featuredTabItem.value === currentFeaturedTab && styles.activeTabText]}>{featuredTabItem.title}</Text>
                            {featuredTabItem.value === currentFeaturedTab && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>
                <View>
                    {
                        filterAuctions.map(item => {
                            return (
                                <TouchableOpacity onPress={() => handleAuctionType(item._id)} activeOpacity={0.8} key={item._id}>
                                    <Image width={pxToVw(300)} height={pxToVh(400)} source={{ uri: item.images[0] }}/>
                                    <Text>{item.title['cn']}</Text>
                                    <Text>
                                                {item.start_datetime}
                                                <Text v-if="item.end_datetime && item.start_datetime != item.end_datetime">
                                                    -
                                                    {item.end_datetime}
                                                </Text>
                                            </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                    {/* <Carousel
                        ref={carouselRef}
                        width={screenWidth}
                        height={screenWidth / 2}
                        data={auctionsType}
                        onProgressChange={progress}
                        renderItem={({ index }) => (
                            <View
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
                            </View>
                        )}
                    /> */}

                    {/* <Pagination.Basic
            progress={progress}
            data={auctionsType}
            dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
            containerStyle={{ gap: 5, marginTop: 10 }}
            onPress={onPressPagination}
        /> */}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: pxToVh(16)
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
    }
})

export default Home;