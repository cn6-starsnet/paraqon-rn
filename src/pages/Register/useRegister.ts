import { CompanyFormData, IndividualFormData, RegisterType } from "@/types/register";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { RadioButtonProps } from "react-native-radio-buttons-group";

const useRegister = () => {
    const [registerType, setRegisterType] = useState<string | undefined>("individual")
    const navigation = useNavigation();

    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: "individual",
            label: "Individual",
            value: "individual",
            color: "#103947",
            size: 22
        },
        {
            id: "company",
            label: "Company",
            value: "company",
            color: "#103947",
            size: 22
        },
    ]), [])

    const onSubmitIndividual = (data: IndividualFormData) => {
        console.log('individual form data', data)
    };
    const onSubmitCompany = (data: CompanyFormData) => {
        console.log("company form data", data)
    };

    const handleGoLogin = () => {
        navigation.dispatch(StackActions.push('Login'))
    }

    return {
        registerType,
        radioButtons,

        handleGoLogin,
        setRegisterType,
        onSubmitCompany,
        onSubmitIndividual,
    }
}

export default useRegister;