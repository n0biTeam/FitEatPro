import React, {useState, useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, OnboardingScreen, SignupScreen, ForgetPasswordScreen  } from '../screens/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    // AsyncStorage.getItem('alreadyLaunched').then((value) => {
    //   if (value === null) {
    //    AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
    //     setIsFirstLaunch(true);
    //   } else {
    //     setIsFirstLaunch(false);
    //   }

    // }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
    
    async function setData() {
      const appData = await AsyncStorage.getItem("appLaunched");
      if (appData == null) {
        setIsFirstLaunch(true);
        AsyncStorage.setItem("appLaunched", "false");
      } else {
        setIsFirstLaunch(false);
      }
    }
    setData();
   
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'Login';
  }

  return (
    <Stack.Navigator initialRouteName={routeName}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgetPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;