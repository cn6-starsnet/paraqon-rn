import { pxToVh, pxToVw } from '@/utils/pxToVx';
import { FC } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useRegister from './useRegister';
import { FormProvider, useForm } from 'react-hook-form';
import IndividualForm from './components/IndividualForm';
import CompanyForm from './components/CompanyForm';
import { RadioGroup } from 'react-native-radio-buttons-group';

const Register: FC = () => {

  const { radioButtons, registerType, handleGoLogin, onSubmitCompany, setRegisterType, onSubmitIndividual } = useRegister()

  const individualForm = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmEmail: '',
      confirmPassword: ''
    }
  });

  const companyForm = useForm({
    defaultValues: {
      companyName: '',
      companyAddress: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      aboutUsType: '',
      confirmEmail: '',
      confirmPassword: ''
    }
  });

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mainContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.registerTitle}>Create Account</Text>
          <Text style={styles.registerDesc}>Additional information may be required. We may contact you for further details.</Text>
        </View>

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Please select your account type *</Text>
          <RadioGroup
            containerStyle={styles.radiosContainer}
            radioButtons={radioButtons}
            onPress={setRegisterType}
            selectedId={registerType}
            labelStyle={styles.radioLabel}
          />
        </View>
        {
          registerType === 'individual' ?
            <FormProvider {...individualForm}>
              <IndividualForm onSubmit={individualForm.handleSubmit(onSubmitIndividual)} />
            </FormProvider>
            :
            <FormProvider {...companyForm}>
              <CompanyForm onSubmit={companyForm.handleSubmit(onSubmitCompany)} />
            </FormProvider>
        }
        <Text style={styles.haveAccountText}>
          Already Have an Account?
          <Text style={styles.linkText} onPress={handleGoLogin}> Sign In</Text>
        </Text>
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
    gap: pxToVh(52)
  },
  headerContent: {
    paddingHorizontal: pxToVw(12)
  },
  registerTitle: {
    color: '#103947',
    fontSize: pxToVw(18),
    marginBottom: pxToVh(32),
    fontWeight: '500',
    textAlign: 'center'
  },
  registerDesc: {
    color: '#103947',
    textAlign: 'center',
    lineHeight: pxToVh(48)
  },
  fieldItem: {
    gap: pxToVh(10)
  },
  fieldLabel: {
    color: '#103947',
    fontSize: pxToVw(16)
  },
  radiosContainer: {
    flexDirection: 'row'
  },
  radioLabel: {
    fontSize: pxToVw(16),
    color: '#103947'
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
  haveAccountText: {
    color: '#103947',
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#103947',
  },
});

export default Register;