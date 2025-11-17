import { StackActions, useNavigation } from "@react-navigation/native";
import { useState } from "react";

const useLogin = () => {
    const navigation = useNavigation();

    const onSubmitLogin = (data: {
        email: string,
        password: string
    }) => {
        console.log('表单数据:', data);
    };

    const handleRegister = () => {
        navigation.dispatch(StackActions.push("Register"))
    }

    const navigatorForgetPwd = () => {
        navigation.dispatch(StackActions.push("ForgetPassword"))
    }

    return {
        handleRegister,
        onSubmitLogin,
        navigatorForgetPwd
    }
}

export default useLogin;