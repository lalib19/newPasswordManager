/* eslint-disable prettier/prettier */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RouteParams} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  const [noUserError, setNoUserError] = useState<string>('');

  const signingOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .catch(error => {
        if (error.code === 'auth/no-current-user') {
          setNoUserError('You are already logged out my friend ');
        }
        console.log(error.code);
      });
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'salmon'}]}
        onPress={() => {
          signingOut();
        }}>
        <Text style={{fontSize: 20, color: 'white'}}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'teal'}]}
        onPress={() => {
          navigation.navigate("UserPage")
        }}>
        <Text style={{fontSize: 20, color: 'white'}}>UserPage</Text>
      </TouchableOpacity>
      <View style={styles.error}>
        <Text onPress={() => setNoUserError('')} style={{borderBottomWidth: 1, borderBottomColor: "grey"}}>
          {noUserError}
        </Text>
      </View>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'ivory',
  },
  button: {
    height: 70,
    width: '30%',
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
  error: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    width: '80%',
    height: '10%',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
});
