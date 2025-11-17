import { pxToVh, pxToVw } from '@/utils/pxToVx';
import { FC } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import useLogin from './useLogin';
import { Controller, useForm } from 'react-hook-form';

const Login: FC = () => {

  const { onSubmitLogin, handleRegister, navigatorForgetPwd } = useLogin()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.loginTitle}>Login</Text>
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
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
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
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>
            )}
          />
        </View>
        <View>
          <Text style={styles.forgetPasswordText} onPress={navigatorForgetPwd}>Forgot Password?</Text>
          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmitLogin)}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountTitle}>Create Account</Text>
          <Text style={styles.createAccountDesc}>Register a free account to start bidding.</Text>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    paddingVertical: pxToVh(200),
    paddingHorizontal: pxToVw(24),
    gap: pxToVh(48)
  },
  loginTitle: {
    color: '#103947',
    fontSize: pxToVw(18),
    marginBottom: pxToVh(48)
  },
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
  createAccountContainer: {
    gap: pxToVh(32),
    paddingTop: pxToVh(68)
  },
  createAccountTitle: {
    fontSize: pxToVw(18),
    color: '#103947'
  },
  createAccountDesc: {
    color: '#103947'
  },
  forgetPasswordText: {
    color: '#103947',
    paddingBottom: pxToVh(28),
  },
  button: {
    backgroundColor: '#103947',
    paddingVertical: pxToVh(24),
    width: pxToVw(120)
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

export default Login;