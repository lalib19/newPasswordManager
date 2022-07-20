import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {string} from 'yup';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {RouteParams} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type FormValues = {
  login: string;
  password: string;
  name: string;
  type: string;
};

const CreatePassword = ({route}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();

  const loginValidationSchema = yup.object({
    login: string().required('Login is required'),
    password: string().required('Password is required'),
    name: string().required('Name is required'),
    type: string().required('Type is required'),
  });

  const onSubmit = (values: FormValues) => {
    firestore()
      .collection('Users')
      .doc(route.params.currentUserId)
      .collection('passwords')
      .add({
        login: values.login,
        name: values.name,
        password: values.password,
        type: values.type,
      })
      .then(() => {
        console.log('User added!');
        navigation.navigate('UserPasswords');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          login: '',
          password: '',
          name: '',
          type: '',
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
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                // secureTextEntry={true}
              />
              {errors.name && touched.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}
            </View>
            <View style={styles.combo}>
              <Text style={styles.label}>Type</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('type')}
                onBlur={handleBlur('type')}
                value={values.type}
                // secureTextEntry={true}
              />
              {errors.type && touched.type && (
                <Text style={styles.error}>{errors.type}</Text>
              )}
            </View>
            <View style={styles.combo}>
              <Text style={styles.label}>Login</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('login')}
                onBlur={handleBlur('login')}
                value={values.login}
              />
              {errors.login && touched.login && (
                <Text style={styles.error}>{errors.login}</Text>
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
          </View>
        )}
      </Formik>
    </View>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightcoral',
  },
  form: {
    width: '80%',
    height: '70%',
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
