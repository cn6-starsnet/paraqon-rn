import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Mine:FC = () => {
    const insets = useSafeAreaInsets();

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

export default Mine;