import Tabs from '@/pages/Tabs';
import {RootStackParamList} from '../../types/navigation'
import Welcome from "@/pages/Welcome";
import { NavigationContainer, NavigationState } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FC } from "react";

export const defaultRouteName: keyof RootStackParamList = "Welcome";
const Stack = createNativeStackNavigator<RootStackParamList>();

interface NavigationConfigProps {
    onStateChange?: (state: NavigationState) => void;
}

type StackScreenProps = React.ComponentProps<typeof Stack.Screen>;

const StackList: StackScreenProps[] = [
    {
        name: "Welcome",
        component: Welcome
    },
    {
        name: "Tabs",
        component: Tabs
    }
]

const NavigationConfig: FC<NavigationConfigProps> = ({ onStateChange }) => {
    return (
        <NavigationContainer
            onStateChange={(state) => {
                console.log('[NavigationConfig] onStateChange', state);
                if (!state) {
                    return;
                }

                if (onStateChange) {
                    onStateChange(state);
                }
            }}
        >
            <Stack.Navigator
                initialRouteName={defaultRouteName}
                screenOptions={{
                    headerShown: false
                }}
            >
                {StackList.map((item) => (
                    <Stack.Screen {...item} key={item.name}/>
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationConfig;