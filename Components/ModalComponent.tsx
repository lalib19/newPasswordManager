import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as yup from 'yup';
import {string} from 'yup';
import firestore from '@react-native-firebase/firestore';

type FormValues = {
  login: string;
  password: string;
  name: string;
  type: string;
};

type EditFormProps = {
  itemValues: {
    login: string;
    password: string;
    name: string;
    type: string;
    id: string;
    currentUserId: string | undefined
  };
};

const ModalComponent: React.FC<EditFormProps> = ({itemValues}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loginValidationSchema = yup.object({
    login: string(),
    password: string(),
    name: string(),
    type: string(),
  });

  const onSubmit = (values: FormValues) => {
    firestore()
      .collection('Users')
      .doc(itemValues.currentUserId)
      .collection('passwords')
      .doc(itemValues.id)
      .update({
        login: values.login || itemValues.login,
        name: values.name || itemValues.name,
        password: values.password || itemValues.password,
        type: values.type || itemValues.type,
      })
      .then(() => {
        console.log('User added!');
        console.log(itemValues);
        setModalVisible(!modalVisible);
      })
      .catch(error => {
        console.log(error);
        console.log(itemValues);
      });
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.container}>
          <Formik
            initialValues={{
              login: '',
              password: '',
              name: '',
              type: '',
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values)=>onSubmit(values)}>
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
                  <Text style={styles.label}>Login</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('login')}
                    onBlur={handleBlur('login')}
                    value={values.login}
                    placeholder={itemValues.login}
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
                    placeholder={itemValues.password}
                    // secureTextEntry={true}
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>
                <View style={styles.combo}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder={itemValues.name}
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
                    placeholder={itemValues.type}
                    // secureTextEntry={true}
                  />
                  {errors.type && touched.type && (
                    <Text style={styles.error}>{errors.type}</Text>
                  )}
                </View>
                <Button
                  onPress={handleSubmit}
                  title="Submit"
                  disabled={!isValid}
                />
              </View>
            )}
          </Formik>

          {/* <View style={styles.modal}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text>Hide Modal</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </Modal>
      <Ionicons
        name="create-outline"
        size={30}
        onPress={() => setModalVisible(!modalVisible)}
      />
    </View>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  modal: {
    flexx: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  button: {
    height: 50,
    width: '80%',
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    elevation: 5,
  },
  form: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: "dodgerblue"
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
