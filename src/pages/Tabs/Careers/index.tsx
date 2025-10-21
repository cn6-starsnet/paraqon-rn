import { CURRENCY } from "@/constants";
import { RootState } from "@/store";
import { getStoreItem } from "@/utils/storage";
import { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Careers:FC = () => {
    const insets = useSafeAreaInsets();
    const currency = useSelector((state: RootState) => state.currency.currency);

    useEffect(() => {
        console.log("获取的数据为：", currency)
    }, [])

    return (
        <View style={[styles.container,{
            paddingTop: insets.top
        }]}>
            <Text>测试</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    }
})

export default Careers;