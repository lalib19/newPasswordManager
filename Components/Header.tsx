import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {RouteParams} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MMKVStorage, {
  MMKVLoader,
  useMMKVStorage,
  create,
} from 'react-native-mmkv-storage';

const storage = new MMKVLoader().initialize();

const Header: React.FC<any> = ({email}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  const [mmkvEmail, setMmkvEmail] = useMMKVStorage<string | undefined>(
    'email',
    storage,
  );
  const [mmkvPassword, setMmkvPassword] = useMMKVStorage<string | undefined>(
    'password',
    storage,
  );

  const signingOut = () => {
    auth()
      .signOut()
      .then(() => {
        setMmkvEmail("")
        setMmkvPassword("")
        navigation.navigate('Home'), console.log('User disconnected');
      })
      .catch(error => {
        console.log(error.code);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}>{email}</Text>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'tomato'}]}
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
    width: '100%',
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
