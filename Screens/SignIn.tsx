import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {string} from 'yup';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteParams} from '../App';
// import { useStorage } from './Home';
import MMKVStorage, {
  MMKVLoader,
  useMMKVStorage,
  create,
} from 'react-native-mmkv-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

type FormValues = {
  email: string;
  password: string;
  // name?: string,
};

const storage = new MMKVLoader().withEncryption().initialize();
let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
let payload = epochTimeSeconds + 'some message';

const rnBiometrics = new ReactNativeBiometrics();

const SignIn = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  const [mmkvEmail, setMmkvEmail] = useMMKVStorage<string | undefined>(
    'email',
    storage,
  );
  const [mmkvPassword, setMmkvPassword] = useMMKVStorage<string | undefined>(
    'password',
    storage,
  );

  const onSubmit = (values: FormValues) => {
    auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        console.log('You are connected!');
        console.log(values);
        setMmkvEmail(values.email);
        setMmkvPassword(values.password);
        navigation.replace('UserPage');
      })
      .catch(error => {
        // if (error.code === 'auth/email-already-in-use') {
        //   console.log('That email address is already in use!');
        // }

        // if (error.code === 'auth/invalid-email') {
        //   console.log('That email address is invalid!');
        // }
        console.error(error);
      });
  };

  const biometryLogin = () => {
    rnBiometrics
      .biometricKeysExist()
      .then(resultObject => {
        const {keysExist} = resultObject;

        if (keysExist) {
          rnBiometrics
            .createSignature({
              promptMessage: 'Sign in',
              payload: payload,
            })
            .then(resultObject => {
              const {success, signature} = resultObject;

              if (success) {
                // console.log(signature);
                // verifySignatureWithServer(signature, payload);
                auth()
                  .signInWithEmailAndPassword("test1@test.com", "123456")
                  .then(() => {
                    setMmkvEmail("test1@test.com");
                    setMmkvPassword("123456");
                    navigation.replace('UserPage');
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }
            })
            .catch(err => console.log(err));
        } else {
          rnBiometrics
            .createKeys()
            .then(resultObject => {
              const {publicKey} = resultObject;
              console.log(publicKey);
              // sendPublicKeyToServer(publicKey);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  const loginValidationSchema = yup.object({
    email: string()
      .email('Invalid email address')
      .required('Email is required'),
    password: string().required('Password is required'),
  });

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginValidationSchema}
        onSubmit={onSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <View style={styles.combo}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.combo}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                // secureTextEntry={true}
              />
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
            </View>
            <Button onPress={handleSubmit} title="Submit" disabled={!isValid} />
            <Button
              onPress={biometryLogin}
              title="Login with biometry"
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightseagreen',
  },
  form: {
    width: '80%',
    height: '40%',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'dodgerblue',
  },
  combo: {
    // flex: 1,
    width: '100%',
  },
  label: {
    width: '100%',
    fontSize: 20,
    marginBottom: 5,
    color: 'white',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
  },
  error: {
    color: 'black',
  },
});
