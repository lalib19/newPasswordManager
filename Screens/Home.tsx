import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RouteParams} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth, {firebase} from '@react-native-firebase/auth';
import Header from '../Components/Header';
import MMKVStorage, {
  MMKVLoader,
  useMMKVStorage,
  create,
} from 'react-native-mmkv-storage';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

rnBiometrics.isSensorAvailable().then(resultObject => {
  const {available, biometryType} = resultObject;

  if (available && biometryType === BiometryTypes.Biometrics) {
    // console.log('Biometrics is supported')
    console.log(resultObject);
  } else {
    console.log('Biometrics not supported');
  }
});

const storage = new MMKVLoader().withEncryption().initialize();

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  const currentUserId: string | undefined = firebase.auth().currentUser?.uid;

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const mmkvEmail: string | undefined | null = storage.getString('email');
  const mmkvPassword: string | undefined | null = storage.getString('password');

  if (mmkvEmail && mmkvPassword && !currentUserId) {
    auth()
      .signInWithEmailAndPassword(mmkvEmail, mmkvPassword)
      .then(() => {
        console.log('You are connected!');
        console.log(`logged in ? ${loggedIn}`);
        navigation.replace('UserPasswords');
      })
      .catch(error => {
        console.error(error);
      });
  }

  // useEffect(() => {
  //   const unsubscribe = auth().onAuthStateChanged(() =>
  //     currentUserId ? setLoggedIn(true) : setLoggedIn(false),
  //   );
  //   console.log(storage.getString('email'));
  //   console.log(storage.getString('password'));
  //   return unsubscribe;
  // });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () =>
      auth().onAuthStateChanged(() =>
        currentUserId ? setLoggedIn(true) : setLoggedIn(false),
      ),
    );
    // console.log(`connected? : ${loggedIn}`);
    // console.log(storage.getString('email'));
    // console.log(storage.getString('password'));
    // console.log(firebase.auth().currentUser?.email)
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* {currentUserId && <Header id={currentUserId} />} */}
      <View style={styles.subcontainer}>
        {!currentUserId && (
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('SignIn');
              }}>
              <Text style={{fontSize: 20, color: 'white'}}>To SignIn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('SignUp');
              }}>
              <Text style={{fontSize: 20, color: 'white'}}>To SignUp</Text>
            </TouchableOpacity>
          </View>
        )}
        {currentUserId && (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'teal', width: 200}]}
              onPress={() => {
                navigation.navigate('UserPasswords');
              }}>
              <Text style={{fontSize: 20, color: 'white'}}>UserPasswords</Text>
            </TouchableOpacity>
          )}
        {currentUserId && (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'teal', width: 200}]}
              onPress={() => {
                navigation.navigate('UserImages');
              }}>
              <Text style={{fontSize: 20, color: 'white'}}>UserImages</Text>
            </TouchableOpacity>
          )}
        {/* <View style={styles.error}>
        <Text onPress={() => setNoUserError('')} style={{borderBottomWidth: 1, borderBottomColor: "grey"}}>
          {noUserError}
        </Text>
      </View> */}
      </View>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'ivory',
  },
  subcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 70,
    width: 140,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    elevation: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // error: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   position: 'absolute',
  //   bottom: 40,
  //   width: '80%',
  //   height: '10%',
  //   flexDirection: 'row',
  //   backgroundColor: 'red',
  // },
});
