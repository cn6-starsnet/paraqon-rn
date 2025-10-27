import { pxToVh, pxToVw } from "@/utils/pxToVx";
import { StackActions, useNavigation } from "@react-navigation/native";
import { FC, useCallback, useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconArrow from '@/assets/svgs/common/arrow.svg'

const Careers:FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const serviceMenuData = useMemo(() => {
        return [
            {
                text: "如何购买",
                path: "Information",
                informationType: "how-to-buy"
            },
            {
                text: "如何出售",
                path: "Information",
                informationType: "how-to-sell"
            },
            {
                text: "条款与协议", 
                path: "Information",
                informationType: "terms-and-conditions"
            },
            {
                text: "隐私政策",
                path: "Information",
                informationType: "privacy-policy"
            },
            {
                text: "买家业务规则",
                path: "Information",
                informationType: "conditions-of-business"
            },
            {
                text: "重要通知",
                path: "Information",
                informationType: "important-notice"
            },
            {
                text: "付款与特别条款",
                path: "Information",
                informationType: "payment-terms-and-special-fees"
            },
            {
                text: "运送及退货安排", 
                path: "Information",
                informationType: "delivery-and-return"
            },
            {
                text: "工作机会",
                path: "WrokChance",
            },
        ]
    }, [])

    const handleCellClick = useCallback((cellItem: any, index: number) => {
        navigation.dispatch(StackActions.push(cellItem.path, {
            type: cellItem.informationType ?? 'default'
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

export default Careers;