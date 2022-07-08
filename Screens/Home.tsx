import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RouteParams} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth, {firebase} from '@react-native-firebase/auth';
import Header from '../Components/Header';

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  // const [noUserError, setNoUserError] = useState<string>('');
  // const [initializing, setInitializing] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const currentUserId: string | undefined = firebase.auth().currentUser?.uid;

  useEffect(() => {
    // console.log(loggedIn);
    const unsubscribe = auth().onAuthStateChanged(() =>
      currentUserId ? setLoggedIn(true) : setLoggedIn(false),
    );
    return unsubscribe;
  }, [loggedIn]);

  return (
    <View style={styles.container}>
      {loggedIn && <Header id={currentUserId} />}
      <View style={styles.subcontainer}>
        {!loggedIn && (
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
        {loggedIn && (
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'teal'}]}
            onPress={() => {
              navigation.navigate('UserPage');
            }}>
            <Text style={{fontSize: 20, color: 'white'}}>UserPage</Text>
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
