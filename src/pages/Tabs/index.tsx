import { TabRouteParams } from "@/types/navigation";
import { pxToVh, pxToVw } from "@/utils/pxToVx";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import IconHome from '@svgs/tabs/icon_home_active.svg'
import IconHomeActive from '@/assets/svgs/tabs/icon_home_active.svg'
import Home from "./Home";
import Careers from "./Careers";
import Editorial from "./Editorial";
import Mine from "./Mine";
import Services from "./Services";

const Tab = createBottomTabNavigator();
const Tabs: FC = () => {
    const route = useRoute<RouteProp<{ params: TabRouteParams }>>()
    const initialRouteName = route.params?.initRouteName
        ? route.params.initRouteName
        : 'Home';

    const HomeTabBarIcon = useCallback((props: { focused: boolean }) => {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={[
                    styles.tabBarItemStyle,
                    {
                        backgroundColor: props.focused ? '#000000' : 'transparent'
                    }
                ]} />
                {props.focused ? <IconHomeActive width={20} /> : <IconHome width={20} />}
            </View>
        )
    }, [])

    return (
        <Tab.Navigator
            id={undefined}
            initialRouteName={initialRouteName}
            screenOptions={() => ({
                tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: "#435950",
                tabBarInactiveTintColor: "#7A7E83",
                tabBarLabel: ({ focused, color, children }) => (
                    <Text style={{
                        fontSize: pxToVw(12),
                        lineHeight: pxToVw(14),
                        fontWeight: focused ? '600' : '400',
                        color: color
                    }}>
                        {children}
                    </Text>
                )
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    title: "拍卖",
                    headerShown: false,
                    tabBarIcon: HomeTabBarIcon
                }}
            />
            {/* <Tab.Screen 
                name="Editorial"
                component={Editorial}
                options={{
                    title: "文章",
                    headerShown: false,
                    tabBarIcon: HomeTabBarIcon
                }}
            />
            <Tab.Screen 
                name="Services"
                component={Services}
                options={{
                    title: "服务",
                    headerShown: false,
                    tabBarIcon: HomeTabBarIcon
                }}
            /> */}
            {/* <Tab.Screen
                name="Careers"
                component={Careers}
                options={{
                    title: "资讯",
                    headerShown: false,
                    tabBarIcon: HomeTabBarIcon
                }}
            /> */}
            <Tab.Screen
                name="Mine"
                component={Mine}
                options={{
                    title: "我的",
                    headerShown: false,
                    tabBarIcon: HomeTabBarIcon
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#FFFFFF',
    },
    tabBarItemStyle: {
        height: pxToVh(2),
        width: pxToVw(40),
        borderRadius: pxToVw(10),
        marginBottom: pxToVh(6)
    }
})

export default Tabs;