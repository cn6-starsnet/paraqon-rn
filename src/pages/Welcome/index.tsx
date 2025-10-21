import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Welcome: FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const animationFinish = () => {
        navigation.navigate("Tabs" as never);
    }

    return (
        <View style={[styles.container,{
            paddingTop: insets.top
        }]}>
            <LottieView 
                style={styles.animation}
                source={require("@/assets/animation/welcome.json")}
                autoPlay
                loop={false}
                onAnimationFinish={animationFinish}
                progress={0.5}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    animation: {
        width: '100%',
        height: '100%'
    }
})

export default Welcome;