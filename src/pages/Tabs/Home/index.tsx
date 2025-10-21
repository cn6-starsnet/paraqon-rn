import { pxToVh, pxToVw } from "@/utils/pxToVx";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useHome from "./useHome";

const Home:FC = () => {
    const insets = useSafeAreaInsets();
    const { featuredTabs, currentFeaturedTab, setCurrentFeaturedTab } = useHome();

    return (
        <View style={[styles.container,{
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
        </View>
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
        flexDirection:'row',
        justifyContent:'center',
        gap: pxToVw(24),
        paddingTop: pxToVh(12)
    },
    featuredTabItem: {
        position:'relative',
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