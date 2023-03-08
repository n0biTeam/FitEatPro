import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/SignupScreen";

const Stack = createNativeStackNavigator();

function StackApp() {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const [isFirstLauch, setFirstLauch] = useState(null);
   
    useEffect(() => {
        AsyncStorage.getItem('alreadyLauched').then(value => {
            if(value == null) {
                AsyncStorage.setItem('alreadyLauched', 'true');
                setFirstLauch(true);
            } else {
                setFirstLauch(false);
            }
        }); 
    }, []);

    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }
  
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber;     }, []);
  
    if (initializing) return null;
    
   
            if (!user) {

            //**************************************** */
            if( isFirstLauch === null) {
                return null;
            } else if (isFirstLauch === true) {

                return (
                    <Stack.Navigator>
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false }}/>
                         <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false }} />
                         <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                         <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                    </Stack.Navigator>
                );
            }else {
                return (
                    <Stack.Navigator initialRouteName="Login">
                        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false }} />
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </Stack.Navigator>
                );
            }
            
            } 

            return (
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false }} />
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            );
   
}

export const StackProvider = () => {
     
        return(
        <NavigationContainer>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
            <StackApp />
        </NavigationContainer>
        );
    
}

