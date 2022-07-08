import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {RouteParams} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Header: React.FC<any> = ({id}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();

  const signingOut = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('Home'))
      .catch(error => {
        // if (error.code === 'auth/no-current-user') {
        //   setNoUserError('You are already logged out my friend ');
        // }
        console.log(error.code);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}>{id}</Text>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'salmon'}]}
        onPress={() => {
          signingOut();
        }}>
        <Text style={{fontSize: 15, color: 'white'}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'dodgerblue',
    paddingLeft: 10,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
  },
  button: {
    height: 40,
    width: 100,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    elevation: 5,
  },
});
