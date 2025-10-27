import { pxToVh, pxToVw } from "@/utils/pxToVx";
import { StackActions, useNavigation } from "@react-navigation/native";
import { FC, useCallback, useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconArrow from '@/assets/svgs/common/arrow.svg'

const Services:FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const serviceMenuData = useMemo(() => {
        return [
            {
                text: "私人洽购",
                path: "PrivateSales",
            },
            {
                text: "估价咨询",
                path: "ExpertServices",
            },
            {
                text: "珠宝采购", 
                path: "ExpertServices",
            },
            {
                text: "订制珠宝",
                path: "ExpertServices",
            },
            {
                text: "珠宝融资",
                path: "ExpertServices",
            },
        ]
    }, [])

    const handleCellClick = useCallback((cellItem: any, index: number) => {
        navigation.dispatch(StackActions.push(cellItem.path, {
            scrollIndex: index - 1
        }))
    }, [])

    return (
        <ScrollView>
            <View style={[styles.container, {
                paddingTop: insets.top + 20
            }]}>
                <Text style={styles.rowTitle}>服务</Text>
                <View style={styles.cellList}>
                    {serviceMenuData.map((cellItem,index) => (
                        <TouchableOpacity style={styles.cellItem} key={index} onPress={() => handleCellClick(cellItem, index)}>
                            <Text style={styles.cellTitle}>{ cellItem.text }</Text>
                            <IconArrow width={20}/>
                        </TouchableOpacity>
                    )) }
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: pxToVh(24),
        paddingVertical: pxToVh(24),
        paddingHorizontal: pxToVw(16)
    },
    rowTitle: {
        fontSize: pxToVw(21),
        textAlign: 'center'
    },
    cellList: {
        width: '100%',
        gap: pxToVh(32),
    },
    cellItem: {
        paddingHorizontal: pxToVw(12),
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: pxToVh(30),
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#000',
    },
    cellTitle: {
        fontSize: pxToVw(16)
    }
})

export default Services;