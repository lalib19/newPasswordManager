/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import Home from './Screens/Home';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import UserPage from './Screens/UserPage';
import CreatePassword from './Screens/CreatePassword';

const Stack = createNativeStackNavigator<RouteParams>();

export type RouteParams = {
  Home: undefined;
  SignUp: undefined;
  SignIn: undefined;
  UserPage: undefined | {user: string};
  CreatePassword: undefined | {currentUserId: string | undefined};
};
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="UserPage" component={UserPage} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
