import { pxToVh, pxToVw } from "@/utils/pxToVx";
import { FC } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useEditorial from "./useEditorial";
import RenderHTML from "react-native-render-html";

const Editorial:FC = () => {
    const insets = useSafeAreaInsets();

    const { posts, handlePostClick } = useEditorial()

    return (
        <ScrollView>
            <View style={[styles.container, {
                paddingTop: insets.top + 20
            }]}>
                <Text style={styles.rowTitle}>论社</Text>
                <View style={styles.contentList}>
                    {posts?.map(item => (
                        <TouchableOpacity onPress={() => handlePostClick(item._id)} activeOpacity={0.9} key={item._id} style={styles.contentItem}>
                            <Image style={styles.contentItemImage} source={{ uri: item.content.main.images[0] }}/>
                            <View style={styles.contentItemText}>
                                <Text>{ item?.published_at }</Text>
                                <Text>{ item.content.hero.title['cn'] }</Text>
                                <RenderHTML
                                    source={{ html: item.content.hero.description['cn'] }}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: pxToVh(16),
        paddingVertical: pxToVh(24),
        paddingHorizontal: pxToVw(16)
    },
    rowTitle: {
        fontSize: pxToVw(21),
        textAlign: 'center'
    },
    contentList: {
        gap: pxToVh(70)
    },
    contentItem: {
        gap: pxToVh(12)
    },
    contentItemText: {
        gap: pxToVh(16)
    },
    contentItemImage: {
        width: '100%',
        height: pxToVh(400)
    }
})

export default Editorial;