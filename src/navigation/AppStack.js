import React, {useState, useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { IG } from '../styles/constants';
import { HomeScreen } from '../screens/home';
import { colors } from '../styles';
import { ProfileScreen, EditProfileScreen } from '../screens/profile';
import { GlycemicIndex, AddGlycemicIndex, EditItemGlycemicIndex, GlycemicIndexNoPay } from '../screens/glycemicIndex';
import { DiaryScreen, DiaryItemScreen, MealScreen } from '../screens/mealLog';
import { BmiScreen, BmrScreen, WhrScreen, WhtrScreen } from '../screens/calculateBmr';
import { HomairScreen, QuickiScreen } from '../screens/insulinResistance';
import { WeightLogScreen, WeightDetailScreen, WeightCharts, HistoryWeightScreen } from '../screens/bodyWeight';
import { GlucoseDiaryScreen, GlucoseViewItemScreen, GlucoseEditItemScreen, GlucoseChartScreen } from '../screens/glucose';
import { BloodPressureScreen, BloodPressureViewItemScreen, BloodPressureEditItemScreen, BloodCharts, StandardPressureScreen } from '../screens/bloodPreesure';
import { NotesScreen, NotesAddScreen, NotesEditScreen } from '../screens/notes';
import { PurineListScreen, PurineAddScreen, PurineEditScreen, PurineListScreenNoPay } from '../screens/purine';
import { FindingScreen, FindingAddScreen, FindingEditScreen, FindingViewScreen } from '../screens/findings';
import { SettingScreen, UnitSettingScreen, ShopScreen, PrivacyPolicyScreen, AboutTheAppScreen } from '../screens/settings';
import { t } from 'i18next';



const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {

  const {t, i18n} = useTranslation();
  
    return (
        <Tab.Navigator
      activeColor={colors.COLORS.YELLOW}
      inactiveColor={colors.COLORS.LIGHT_GREY}
      barStyle={{ backgroundColor: colors.COLORS.DEEP_BLUE }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const icons = {
              HomeScreen: 'home',
              MealScreen: 'clipboard-edit',
              DiaryScreen: 'format-list-bulleted',
              Profile: 'account',
              SettingScreen: 'cog'
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
    >
     
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
          options={{
            title: t('menu-start'),   
                
          }}
         
      />

      <Tab.Screen
        name="MealScreen"
        component={MealScreen}
          options={{
            title: t('menu-meal-creator'),      
          }}
      />

      <Tab.Screen
        name="DiaryScreen"
        component={DiaryScreen}
          options={{
            title: t('menu-diary'),
          }}
      />

      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
          options={{
            title: t('menu-settings'),      
          }}
      />

      

    </Tab.Navigator>
    );
}

const TopTab = createMaterialTopTabNavigator();

function TopTabs() {
  return (
    <Tab.Navigator
    activeColor={colors.COLORS.YELLOW}
      inactiveColor={colors.COLORS.LIGHT_GREY}
      barStyle={{ backgroundColor: colors.COLORS.BLACK }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const icons = {
              BmiScreen: 'human-male',
              BmrScreen: 'human-handsdown',
              WhrScreen: 'human',
              WthrScreen: 'human-handsup'
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
    >
      
      <Tab.Screen
          name="BmiScreen" 
          component={BmiScreen}
          options={{
                title: 'BMI',
                headerShown: false
          }} 
      />

      <Tab.Screen 
          name="BmrScreen"
          component={BmrScreen} 
          options={{
            title: 'BMR',
            headerShown: false
      }} 
      />

      <Tab.Screen 
          name="WhrScreen"
          component={WhrScreen} 
          options={{
            title: 'WHR',
            headerShown: false
      }} 
      />

      <Tab.Screen 
          name="WthrScreen"
          component={WhtrScreen} 
          options={{
            title: 'WtHR',
            headerShown: false
      }} 
      />

    </Tab.Navigator>
  );
}


function TopTabs2() {
  return (
    <Tab.Navigator
    activeColor={colors.COLORS.YELLOW}
      inactiveColor={colors.COLORS.LIGHT_GREY}
      barStyle={{ backgroundColor: colors.COLORS.DEEP_BLUE }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const icons = {
              HomairScreen: 'calculator-variant',
              QuickiScreen: 'calculator-variant',
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
    >
      
      <Tab.Screen
          name="HomairScreen" 
          component={HomairScreen}
          options={{
                title: 'HOMA-IR',
                headerShown: false
          }} 
      />

      <Tab.Screen 
          name="QuickiScreen"
          component={QuickiScreen} 
          options={{
            title: 'QUICKI',
            headerShown: false
      }} 
      />
    </Tab.Navigator>
  );
}

function WeightTabs() {
  return (
    <Tab.Navigator
    activeColor={colors.COLORS.YELLOW}
      inactiveColor={colors.COLORS.LIGHT_GREY}
      barStyle={{ backgroundColor: colors.COLORS.DEEP_BLUE }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const icons = {
              WeightLogScreen: 'scale-bathroom',
              WeightCharts: 'chart-line',
              HistoryWeightScreen: 'history',
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
    >
      
      <Tab.Screen
          name="WeightLogScreen" 
          component={WeightLogScreen}
          options={{
                title: t('memu-weight.weight-log'),
                headerShown: false
          }} 
      />

      <Tab.Screen 
          name="WeightCharts"
          component={WeightCharts} 
          options={{
            title: t('menu-weight.chart'),
            headerShown: false
      }} 
      />

      <Tab.Screen 
          name="HistoryWeightScreen"
          component={HistoryWeightScreen} 
          options={{
            title: t('menu-weight.history'),
            headerShown: false
      }} 
      />
    </Tab.Navigator>
  );
}

function BloodPressureTabs() {
  return (
    <Tab.Navigator
    activeColor={colors.COLORS.YELLOW}
      inactiveColor={colors.COLORS.LIGHT_GREY}
      barStyle={{ backgroundColor: colors.COLORS.DEEP_BLUE }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const icons = {
              BloodPressureScreen: 'heart-pulse',
              BloodCharts: 'chart-line',
              StandardPressureScreen: 'drag',
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
    >
      
      <Tab.Screen
          name="BloodPressureScreen" 
          component={BloodPressureScreen}
          options={{
                title: t('menu.blood-pressure'),
                headerShown: false
          }} 
      />

      <Tab.Screen 
          name="BloodCharts"
          component={BloodCharts} 
          options={{
            title: t('menu.blood-pressure-chart'),
            headerShown: false
      }} 
      />

      <Tab.Screen 
          name="StandardPressureScreen"
          component={StandardPressureScreen} 
          options={{
            title: t('menu.blood-standrads'),
            headerShown: false
      }} 
      />
     
    </Tab.Navigator>
  );
}

function GlucoseTabs() {
  return (
    <Tab.Navigator
    activeColor={colors.COLORS.YELLOW}
      inactiveColor={colors.COLORS.LIGHT_GREY}
      barStyle={{ backgroundColor: colors.COLORS.DEEP_BLUE }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => {
            const icons = {
              GlucoseDiaryScreen: 'water-check',
              GlucoseChartScreen: 'chart-line',
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
    >
      
      <Tab.Screen
          name="GlucoseDiaryScreen" 
          component={GlucoseDiaryScreen}
          options={{
                title: t('menu.glucose.glucose measurements'),
                headerShown: false
          }} 
      />

      <Tab.Screen 
          name="GlucoseChartScreen"
          component={GlucoseChartScreen} 
          options={{
            title: t('menu.glucose.chart'),
            headerShown: false
      }} 
      />
     
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const AppStack = () => {

  

  return (
    <Stack.Navigator>
    
    <Stack.Screen 
            name="Start"
            component={HomeTabs}
            options={{
                headerShown: false
            }}    
        />

    <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
          options={{title: 'Water Screen',
                    headerTitleStyle: {
                    color: colors.COLORS.DEEP_BLUE,
                         
                  },
                  headerStyle: {
                  backgroundColor: colors.COLORS.DEEP_BLUE,
                  //color: TEXT_COLORS.WHITE,
                        
                  },
                  //headerTintColor: TEXT_COLORS.WHITE,
                  headerTitleAlign: 'center',
                  headerShown: false,
                  }}
    />

    <Stack.Screen
      name="UnitSettingScreen"
      component={UnitSettingScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    {/* <Tab.Screen
        name="Profile"
        component={ProfileScreen}
          options={{
            title: t('menu-profile'),      
          }}
      /> */}

    <Stack.Screen
      name="PrivacyPolicyScreen"
      component={PrivacyPolicyScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="AboutTheAppScreen"
      component={AboutTheAppScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="ShopScreen"
      component={ShopScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
        name="GlycemicIndex"
        component={GlycemicIndex}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerShown: false,
        }}
    />
       
    <Stack.Screen
        name="GlycemicIndexNoPay"
        component={GlycemicIndexNoPay}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerShown: false,
        }}
    />
    
    <Stack.Screen
      name="EditItemGlycemicIndex"
      component={EditItemGlycemicIndex}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="AddGlycemicIndex"
      component={AddGlycemicIndex}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="DiaryItemScreen"
      component={DiaryItemScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="TopTabs"
      component={TopTabs}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Kalkulator'
      }}
    />

    <Stack.Screen
      name="TopTabs2"
      component={TopTabs2}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Kalkulator'
      }}
    />

    <Stack.Screen
      name="WeightTabs"
      component={WeightTabs}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Kalkulator'
      }}
    />

    <Stack.Screen
      name="BloodPressureTabs"
      component={BloodPressureTabs}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Kalkulator'
      }}
    />

    <Stack.Screen
      name="GlucoseTabs"
      component={GlucoseTabs}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Kalkulator'
      }}
    />

  <Stack.Screen
      name="WeightDetailScreen"
      component={WeightDetailScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Detale'
      }}
    />

    <Stack.Screen
      name="GlucoseViewItemScreen"
      component={GlucoseViewItemScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Detale'
      }}
    />

    <Stack.Screen
      name="GlucoseEditItemScreen"
      component={GlucoseEditItemScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Edycja'
      }}
    />

    <Stack.Screen
      name="BloodPressureViewItemScreen"
      component={BloodPressureViewItemScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Detale'
      }}
    />

    <Stack.Screen
      name="BloodPressureEditItemScreen"
      component={BloodPressureEditItemScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Edycja'
      }}
    />    

    <Stack.Screen
      name="NotesScreen"
      component={NotesScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Notatki'
      }}
    />    

    <Stack.Screen
      name="NotesAddScreen"
      component={NotesAddScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Notatka'
      }}
    />   

    <Stack.Screen
      name="NotesEditScreen"
      component={NotesEditScreen}
      options={{
        headerBackTitleVisible: false,
        headerShown: false,
        title: 'Edycja notatki'
      }}
    />   

   
    <Stack.Screen
      name="PurineListScreen"
      component={PurineListScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
    
    <Stack.Screen
      name="PurineListScreenNoPay"
      component={PurineListScreenNoPay}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />
    
    <Stack.Screen
      name="PurineAddScreen"
      component={PurineAddScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="PurineEditScreen"
      component={PurineEditScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="FindingScreen"
      component={FindingScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="FindingAddScreen"
      component={FindingAddScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

<Stack.Screen
      name="FindingViewScreen"
      component={FindingViewScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="FindingEditScreen"
      component={FindingEditScreen}
      options={{
        title: '',
        headerBackTitleVisible: false,
        headerShown: false,
      }}
    />

  </Stack.Navigator>
  );
};

export default AppStack;