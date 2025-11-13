import { pxToVh, pxToVw } from "@/utils/pxToVx";
import { FC } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface IndividualFormProps {
    onSubmit: () => void
}

const IndividualForm: FC<IndividualFormProps> = ({
    onSubmit
}) => {

    const { control, watch, formState: { errors } } = useFormContext();

    const email = watch('email');
    const password = watch('password')
    return (
        <>
            <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Email *</Text>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: '邮箱不能为空',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '邮箱格式不正确'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <TextInput
                                style={[styles.inputItem, errors.email && styles.inputError]}
                                placeholder="邮箱"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && typeof errors.email.message === 'string' && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Confirm Email *</Text>
                <Controller
                    control={control}
                    name="confirmEmail"
                    rules={{
                        required: '确认邮箱不能为空',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '邮箱格式不正确'
                        },
                        validate: (value) => value === email || '两次输入的邮箱不一致'
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <TextInput
                                style={[styles.inputItem, errors.confirmEmail && styles.inputError]}
                                placeholder="确认邮箱"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.confirmEmail && typeof errors.confirmEmail.message === 'string' && (
                                <Text style={styles.errorText}>{errors.confirmEmail.message}</Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>First Name *</Text>
                <Controller
                    control={control}
                    name="firstName"
                    rules={{
                        required: 'First name不能为空',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <TextInput
                                style={[styles.inputItem, errors.firstName && styles.inputError]}
                                placeholder="First Name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.firstName && typeof errors.firstName.message === 'string' && (
                                <Text style={styles.errorText}>{errors.firstName.message}</Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Last Name *</Text>
                <Controller
                    control={control}
                    name="lastName"
                    rules={{
                        required: 'Last name不能为空',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <TextInput
                                style={[styles.inputItem, errors.lastName && styles.inputError]}
                                placeholder="Last Name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.lastName && typeof errors.lastName.message === 'string' && (
                                <Text style={styles.errorText}>{errors.lastName.message}</Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Password *</Text>
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: '密码不能为空',
                        minLength: {
                            value: 8,
                            message: "密码长度不能小于8位"
                        },
                        pattern: {
                            value: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                            message: "密码必须包含字母和数字"
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <TextInput
                                style={[styles.inputItem, errors.password && styles.inputError]}
                                placeholder="密码"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                            />
                            {errors.password && typeof errors.password.message === 'string' && (
                                <Text style={styles.errorText}>{errors.password.message}</Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Confirm Password *</Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: '确认密码不能为空',
                        validate: (value) => value === password || "两次输入的密码不一致"
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <TextInput
                                style={[styles.inputItem, errors.confirmPassword && styles.inputError]}
                                placeholder="确认密码"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                            />
                            {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default IndividualForm;

const styles = StyleSheet.create({
    fieldItem: {
        gap: pxToVh(10)
    },
    fieldLabel: {
        color: '#103947',
        fontSize: pxToVw(16)
    },
    inputItem: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: pxToVw(16),
        height: pxToVh(110)
    },
    button: {
        backgroundColor: '#103947',
        paddingVertical: pxToVh(24),
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});