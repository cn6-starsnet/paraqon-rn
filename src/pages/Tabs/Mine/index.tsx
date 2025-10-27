import { screenHeight } from "@/utils/pxToVx";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const Mine:FC = () => {
    const insets = useSafeAreaInsets();

    const webviewUrl = "https://www.paraqon.com/authentication/login/email"

    return (
        <View style={[styles.container,{
            paddingTop: insets.top
        }]}>
            <WebView
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
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: screenHeight
    }
})

export default Mine;