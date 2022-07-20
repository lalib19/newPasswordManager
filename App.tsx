import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './Screens/Home';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import UserPasswords from './Screens/UserPasswords';
import CreatePassword from './Screens/CreatePassword';
import UserImages from './Screens/UserImages';

const Stack = createNativeStackNavigator<RouteParams>();

export type RouteParams = {
  Home: undefined;
  SignUp: undefined;
  SignIn: undefined;
  UserPasswords: undefined | {user: string};
  UserImages: undefined ;
  CreatePassword: undefined | {currentUserId: string | undefined};
};
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="UserPasswords" component={UserPasswords} />
        <Stack.Screen name="UserImages" component={UserImages} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
