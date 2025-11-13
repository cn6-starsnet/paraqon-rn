import { pxToVh, screenHeight } from "@/utils/pxToVx";
import { FC } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import useMine from "./useMine";

const Mine: FC = () => {
    const insets = useSafeAreaInsets();
    const { handleGoLogin } = useMine();

    const webviewUrl = "https://www.paraqon.com/authentication/login/email"

    return (
        <View style={[styles.container, {
            paddingTop: insets.top
        }]}>
            {/* <WebView
                source={{ uri: webviewUrl }}
                // 显示加载指示器
                startInLoadingView={true}
                // 允许文件访问
                allowFileAccess={true}
                // 允许通用访问
                allowUniversalAccessFromFileURLs={true}
                // 允许 JavaScript
                javaScriptEnabled={true}
                // 允许 DOM 存储
                domStorageEnabled={true}
            /> */}
            <View style={styles.mainContainer}>
                <Button title="登录" onPress={handleGoLogin}></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: screenHeight
    },
    mainContainer: {
        paddingVertical: pxToVh(24)
    }
})

export default Mine;