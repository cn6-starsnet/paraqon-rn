import { StackActions, useNavigation } from "@react-navigation/native";

const useMine = () => {
    const navigation = useNavigation();

    const handleGoLogin = () => {
        // navigation.dispatch(StackActions.push(
        //     'Login'));
    }

    return {
        handleGoLogin
    }
}

export default useMine;