import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import GlycemicIndex from '../screens/GlycemicIndex';
//import MessagesScreen from '../screens/MessagesScreen';
//import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator
      activeColor="#ffcc00"
      inactiveColor="#f2f2f2"
      barStyle={{ backgroundColor: '#224870' }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const icons = {
              Home: 'home',
              Profile: 'account',
            };
            
            return (
              <MaterialCommunityIcons
                name={icons[route.name]}
                color={color}
                size={26}
              />
            );
          },
          
        })}
      shifting={false}
      //labeled={false}
      //tabBarBadge={false}
    >
     
      <Tab.Screen
        name="Home"
        component={FeedStack}
          options={{
            title: 'Home',   
                
          }}
         
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
          options={{
            title: 'Profil',      
          }}
      />

    </Tab.Navigator>
    );
}

const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    
    <Stack.Screen
      name="HomeProfile"
      component={ProfileScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
      }}
      
    />
  </Stack.Navigator>
);


const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile2"
      component={ProfileScreen}
      options={{title: 'Water Screen',
                headerTitleStyle: {
                    color: '#224870',
                   
                },
                headerStyle: {
                backgroundColor: '#224870',
                //color: TEXT_COLORS.WHITE,
                
                },
                //headerTintColor: TEXT_COLORS.WHITE,
                headerTitleAlign: 'center',
                headerShown: false,
              }}
    />
    <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
          options={{title: 'Water Screen',
                    headerTitleStyle: {
                    color: '#224870',
                         
                  },
                  headerStyle: {
                  backgroundColor: '#224870',
                  //color: TEXT_COLORS.WHITE,
                        
                  },
                  //headerTintColor: TEXT_COLORS.WHITE,
                  headerTitleAlign: 'center',
                  headerShown: false,
                  }}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    
    <Stack.Screen
      name="HomeProfile"
      component={ProfileScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
      }}
      
    />
  </Stack.Navigator>
  );
};

export default AppStack;