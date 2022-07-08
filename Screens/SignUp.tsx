import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {string} from 'yup';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteParams} from '../App';

type FormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
  // name?: string,
};

const SignUp = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();

  const onSubmit = (values: FormValues) => {
    auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        console.log('User account created & signed in!');
        console.log(values);
        navigation.replace('UserPage');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const loginValidationSchema = yup.object({
    // name: string().required('Name is required'),
    email: string()
      .email('Invalid email address')
      .required('Email is required'),
    password: string().required('Password is required'),
    confirmPassword: string()
      .oneOf([yup.ref('password'), null], 'Passwords do not match')
      .required('Confirm your password'),
  });

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          // name: '',
          email: '',
          password: '',
          confirmPassword: '',
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
            {/* <View style={styles.combo}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {errors.name && touched.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}
            </View> */}
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
            <View style={styles.combo}>
              <Text style={styles.label}>Confirm your password</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                // secureTextEntry={true}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}
            </View>
            <Button onPress={handleSubmit} title="Submit" disabled={!isValid} />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gold',
  },
  form: {
    width: '80%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  combo: {
    flex: 1,
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
