import { StyleSheet, Text, View, TouchableOpacity, Animated, ImageBackground, StatusBar, Dimensions, ToastAndroid, Alert, ActivityIndicator } from 'react-native'
import React, {useState, useEffect, useContext, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedFAB, DefaultTheme, Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import RBSheet from "react-native-raw-bottom-sheet";
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import { format, getISODay } from 'date-fns';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CircularProgress from 'react-native-circular-progress-indicator';
import BigList from "react-native-big-list";
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const BloodPressureScreen = ({ 
  navigation,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode }) => {

  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === 'ios';
  
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  const {t, i18n} = useTranslation();

  const {user} = useContext(AuthContext);
  const [userAge, setUserAge] = useState(0);   //Wiek
  const [loading, setLoading] = useState(true);
  
  //-------------------------------------------------------------------
  //const [dateForm, setDateForm] = useState(new Date());
  //const [timeForm, setTimeForm] = useState(new Date());
  //const [open1, setOpen1] = useState(false);
  //const [open2, setOpen2] = useState(false);
  
  const refRBSheet = useRef();
  const [isOpen, setIsOpen] = useState(true);
  const heightModal = (Dimensions.get('window').height/1.5);
 
  //--------------------------------------------------------------------
  const [systolic, setSystolic] = useState('');   //skurczowe
  const [diastolic, setDiastolic] = useState(''); //rozkurczowe
  const [pulse, setPulse] = useState('');         //puls 

  const [getSystolic, setGetSystolic] = useState(0);
  const [getDiastolic, setGetDiastolic] = useState(0);
  const [getPulse, setGetPulse] = useState(0);
  const [getData, setGetData] = useState([]);

  const emptyBtn = (systolic != null && systolic != '') 
                && (diastolic != null && diastolic != '')
                && (pulse != null && pulse != '');

  const [isLoading, setIsLoading] = useState(false); //button
  const toggleLoading = () => { setIsLoading(!isLoading); };

  const getUser = async () => {
    await firestore()
     .collection('users')
     .doc(user.uid)
     .collection('profile')
     .doc('profil')
     .get()
     .then(( doc ) => {
       if( doc.exists ) {
         //setUserData(doc.data());
         const dateB = new Date(doc.data().birthday.seconds * 1000);
         setUserAge(new Date().getFullYear() - dateB.getFullYear());        
       }
     })
   };

   const getMeasurement = () => {
    firestore().collection('users').doc(user.uid).collection('bloodPressure')
      .orderBy('createdAt', 'desc')
      //.limit(30)
      .onSnapshot(
         querySnapshot => {
          const getData = [];
            querySnapshot.forEach(doc => {
          
             if( doc.exists ) {
              getData.push({...doc.data(), id: doc.id}); 
             }
             
            });
            setGetData(getData);
              
            },
              error => {
               console.log(error)
            }
        
      )
  }

   const getLastMeasurement = () => {
    firestore().collection('users').doc(user.uid).collection('bloodPressure')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot(
         querySnapshot => {
          //const dataWeight = [];
            querySnapshot.forEach(doc => {
            //console.log('User data: ', doc.data());
             if( doc.exists ) {
              //dataWeight.push({...doc.data(), id: doc.id}); 
              setGetSystolic(doc.data().systolic);
              setGetDiastolic(doc.data().diastolic);
              setGetPulse(doc.data().pulse);
             }
             
            });
              
            },
              error => {
               console.log(error)
            }
        
      )
  }

  const lastPressure = () => {

    let sbpt;
    let dbpt;
    // komunikaty = new Array(5);
    // komunikaty[0]=new Array(5);
    // komunikaty[1]=new Array(5);
    // komunikaty[2]=new Array(5);
    // komunikaty[3]=new Array(5);
    // komunikaty[4]=new Array(5);

    // komunikaty[0][0]="Prawidłowe";
    // komunikaty[0][1]="Wysokie prawidłowe";
    // komunikaty[0][2]="Nadciśnienie Tętnicze I stopnia";
    // komunikaty[0][3]="Nadciśnienie Tętnicze II stopnia";
    // komunikaty[0][4]="Nadciśnienie Tętnicze III stopnia";
    // komunikaty[1][0]="Wysokie prawidłowe";
    // komunikaty[1][1]="Wysokie prawidłowe";
    // komunikaty[1][2]="Nadciśnienie Tętnicze I stopnia";
    // komunikaty[1][3]="Nadciśnienie Tętnicze II stopnia";
    // komunikaty[1][4]="Nadciśnienie Tętnicze III stopnia";
    // komunikaty[2][0]="Izolowane Skurczowe Nadciśnienie Tętnicze I stopnia";
    // komunikaty[2][1]="Izolowane Skurczowe Nadciśnienie Tętnicze I stopnia";
    // komunikaty[2][2]="Nadciśnienie Tętnicze I stopnia";
    // komunikaty[2][3]="Nadciśnienie Tętnicze II stopnia";
    // komunikaty[2][4]="Nadciśnienie Tętnicze III stopnia";
    // komunikaty[3][0]="Izolowane Skurczowe Nadciśnienie Tętnicze II stopnia";
    // komunikaty[3][1]="Izolowane Skurczowe Nadciśnienie Tętnicze II stopnia";
    // komunikaty[3][2]="Nadciśnienie Tętnicze II stopnia";
    // komunikaty[3][3]="Nadciśnienie Tętnicze II stopnia";
    // komunikaty[3][4]="Nadciśnienie Tętnicze III stopnia";
    // komunikaty[4][0]="Izolowane Skurczowe Nadciśnienie Tętnicze III stopnia";
    // komunikaty[4][1]="Izolowane Skurczowe Nadciśnienie Tętnicze III stopnia";
    // komunikaty[4][2]="Nadciśnienie Tętnicze III stopnia";
    // komunikaty[4][3]="Nadciśnienie Tętnicze III stopnia";
    // komunikaty[4][4]="Nadciśnienie Tętnicze III stopnia";

    if ( getSystolic >= 180 ) { sbpt=4;  };
    if ( getSystolic < 180 ) { sbpt=3; };
    if ( getSystolic < 160 ) { sbpt=2;  };
    if ( getSystolic < 140 ) { sbpt=1;  };
    if ( getSystolic < 130 ) { sbpt=0;  };
    
    if ( getDiastolic >= 110 ) { dbpt=4;  };
    if ( getDiastolic < 110 ) { dbpt=3;  };
    if ( getDiastolic < 100 ) { dbpt=2;  };
    if ( getDiastolic < 90 ) { dbpt=1;  };
    if ( getDiastolic < 85 ) { dbpt=0;  };
    

    if(sbpt === 0 && dbpt === 0) {
      return(
        <View style={{backgroundColor: colors.PRESSURE.P1, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }

    // return(
    // <View>
    //   <Text>{komunikaty[sbpt][dbpt]}</Text>
    // </View>
    // )

    // if((getSystolic < 120) && (getDiastolic < 80)){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P1, padding: spacing.SCALE_5, marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.optimal')}</Text>
    //     </View>
    //   )
    // } else if(((getSystolic >= 120) && (getSystolic <= 129)) || ((getDiastolic >= 80) && (getDiastolic <= 84))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P1, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.correct')}</Text>
    //     </View>
    //   )
    // } else if(((getSystolic >= 130) && (getSystolic <= 139)) || ((getDiastolic >= 85) && (getDiastolic <= 89))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
    //     </View>
    //     )
    // } else if(((getSystolic >= 140) && (getSystolic <= 159)) || ((getDiastolic >= 90) && (getDiastolic <= 99))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
    //     </View>
    //   )
    // } else if(((getSystolic >= 160) && (getSystolic <= 179)) || ((getDiastolic >= 100) && (getDiastolic <= 109))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
    //     </View>
    //     )
    // } else if((getSystolic >= 180) && (getDiastolic >= 110)){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.WHITE}}>{t('bloodPressureScreen.value-3st')}</Text>
    //     </View>
    //   )
    // }else{
    //   return(
    //       <View style={{backgroundColor: colors.PRESSURE.P5, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.measurement-error')}</Text>
    //     </View>
    //   )
    // }
  }
 //console.log('------')
  const pressure = (item) => {
    //console.log(item.systolic + ' ' + item.diastolic)
    let sbpt;
    let dbpt;
  

    if ( item.systolic >= 180 ) { sbpt=4;  };
    if ( item.systolic < 180 ) { sbpt=3; };
    if ( item.systolic < 160 ) { sbpt=2;  };
    if ( item.systolic < 140 ) { sbpt=1;  };
    if ( item.systolic < 130 ) { sbpt=0;  };
    
    if ( item.diastolic >= 110 ) { dbpt=4;  };
    if ( item.diastolic < 110 ) { dbpt=3;  };
    if ( item.diastolic < 100 ) { dbpt=2;  };
    if ( item.diastolic < 90 ) { dbpt=1;  };
    if ( item.diastolic < 85 ) { dbpt=0;  };

    if(sbpt === 0 && dbpt === 0) {
      return(
        <View style={{backgroundColor: colors.PRESSURE.P1, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3,paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4,paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12,  color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12,  color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12,  color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }

    
    // if((item.systolic < 120) && (item.diastolic < 80)){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P1, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{ffontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.optimal')}</Text>
    //     </View>
    //   )
    // }else if(((item.systolic >= 120) && (item.systolic <= 129)) || ((item.diastolic >= 80) && (item.diastolic <= 84))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P1, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.correct')}</Text>
    //     </View>
    //   )
    //   }else if(((item.systolic >= 130) && (item.systolic <= 139)) || ((item.diastolic >= 85) && (item.diastolic <= 89))){
    //     return(
    //       <View style={{backgroundColor: colors.PRESSURE.P2, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
    //         <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
    //       </View>
    //     )
    //   }else if(((item.systolic >= 140) && (item.systolic <= 159)) || ((item.diastolic >= 90) && (item.diastolic <= 99))){
    //     return(
    //       <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
    //         <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
    //       </View>
    //     )
    //   }else if(((item.systolic >= 160) && (item.systolic <= 179)) || ((item.diastolic >= 100) && (item.diastolic <= 109))){
    //     return(
    //       <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
    //         <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
    //       </View>
    //     )
    //   }else if((item.systolic >= 180) && (item.diastolic >= 110)){
    //     return(
    //       <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
    //         <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-3st')}</Text>
    //       </View>
    //     )
    // }else{
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P5, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.measurement-error')}</Text>
    //     </View>
    //   )
    // }
  }


   useEffect(() => {
      
    getUser();
    getMeasurement();
    getLastMeasurement();
    const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
  }, [navigation, loading]);


//   const getDateTime = () => {
//     //Data i czas 2022-12-12T20:16:03.151Z
//     const dates = moment(dateForm).format("YYYY-MM-DD");
//     const times = moment(timeForm).format("HH:mm");
//     // const dateTime = dates + 'T' + times + ':00';
//     const dateTime = new Date(dates + 'T' + times + ':00Z');
//     return dateTime;
//  }

  const handleAdd = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('bloodPressure')
      .add({
        //createdAt: getDateTime(),
        createdAt: firestore.Timestamp.fromDate(new Date()),
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        pulse: parseInt(pulse),
      }).then(() => {
        console.log('Added');
        ToastAndroid.show(t('bloodPressureScreen.toast.measurement-added'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
        refRBSheet.current.close();
        setIsLoading(false);
 
      }).catch((error) => {
        console.log('Error: 1' + error);
     })
  };

  const getBackGroundColor = () => {
    let color;

    if(emptyBtn === false){
      color = colors.COLORS.GREY_CCC;
    }else{
      color = colors.COLORS.DEEP_BLUE;
    }
    return color;
  }

  const _alertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '',
      //body
      t('bloodPressureScreen.alert.text-1'),
      [
        { text: t('bloodPressureScreen.alert.yes'), onPress: () => _handleDeleteAllBloodPreesure() },
        {
          text: t('bloodPressureScreen.alert.no'),
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  const _handleDeleteAllBloodPreesure = async () => {
    const bloodPreesureQuerySnapshot = 
        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('bloodPressure')
        .get();
      
        const batch = firestore().batch();
      
        bloodPreesureQuerySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        navigation.navigate('BloodPressureScreen');
        return batch.commit();
  }

  
  const _goBack = () => navigation.navigate('HomeScreen');
  const imageBG = require('../../assets/images/bloodpreesure1.jpg');
  
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_33}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('bloodPressureScreen.title')} />
       <Appbar.Action icon="trash-can" onPress={_alertHandler} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={1}
    resizeMode="cover"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.2
      }}
    
  >
    <ImageBackground
      source={require('../../assets/images/wave.png')}
      style={{
        flex: 1, 
        height: Dimensions.get('window').height,
        //width: Dimensions.get('window').width,
         height: 126,
      }}
      imageStyle={{
        //opacity: 0.8
      }}
      >
        <View style={styles.rootContainer}>
          <View style={styles.boxTitle}>
            <Text style={styles.boxText}>{t('bloodPressureScreen.last-measurement')}</Text> 
          </View>
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>

            <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, marginRight: spacing.SCALE_6, padding: spacing.SCALE_10, alignItems: 'center'}}>
                <CircularProgress
                value={getSystolic}
                radius={40}
                maxValue={200}
                inActiveStrokeOpacity={0.8}
                activeStrokeWidth={10}
                inActiveStrokeWidth={10}
                progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_26, marginBottom: -spacing.SCALE_8 }}
                activeStrokeColor={colors.COLORS.DEEP_BLUE}
                inActiveStrokeColor={colors.COLORS.GREY_999}
                duration={2000}
                title={'mmHg'}
                titleColor={colors.COLORS.DEEP_BLUE}
                titleStyle={{fontWeight: '300', fontSize: spacing.SCALE_10}}
                dashedStrokeConfig={{
                    count: 30,
                    width: 8,
                }}
                // progressFormatter={(value, total) => {
                //     'worklet';   
                //     return value.toFixed(2);
                // }}
                 />
                 <Text style={{marginTop: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_10, textTransform: 'uppercase'}}>{t('bloodPressureScreen.systolic')}</Text>
            </View>

            <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, marginRight: spacing.SCALE_3, padding: spacing.SCALE_10, alignItems: 'center'}}>
              <CircularProgress
                  value={getDiastolic}
                  radius={40}
                  maxValue={200}
                  inActiveStrokeOpacity={0.8}
                  activeStrokeWidth={10}
                  inActiveStrokeWidth={10}
                  progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_26, marginBottom: -spacing.SCALE_8 }}
                  activeStrokeColor={colors.COLORS.DEEP_BLUE}
                  inActiveStrokeColor={colors.COLORS.GREY_999}
                  duration={2000}
                  title={'mmHg'}
                  titleColor={colors.COLORS.DEEP_BLUE}
                  titleStyle={{fontWeight: '300', fontSize: typography.FONT_SIZE_10}}
                  dashedStrokeConfig={{
                      count: 30,
                      width: 8,
                  }}
                  // progressFormatter={(value, total) => {
                  //     'worklet';   
                  //     return value.toFixed(2);
                  // }}
                  />
                  <Text style={{marginTop: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_10, textTransform: 'uppercase'}}>{t('bloodPressureScreen.diastolic')}</Text>
              </View>

            <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, marginLeft: spacing.SCALE_3, padding: spacing.SCALE_10, alignItems: 'center'}}>
            <CircularProgress
                  value={getPulse}
                  radius={40}
                  maxValue={150}
                  inActiveStrokeOpacity={0.8}
                  activeStrokeWidth={10}
                  inActiveStrokeWidth={10}
                  progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_26, marginBottom: -spacing.SCALE_8 }}
                  activeStrokeColor={colors.COLORS.DEEP_BLUE}
                  inActiveStrokeColor={colors.COLORS.GREY_999}
                  duration={2000}
                  title={t('bloodPressureScreen.bpm')}
                  titleColor={colors.COLORS.DEEP_BLUE}
                  titleStyle={{fontWeight: '300', fontSize: typography.FONT_SIZE_10}}
                  dashedStrokeConfig={{
                      count: 30,
                      width: 8,
                  }}
                  // progressFormatter={(value, total) => {
                  //     'worklet';   
                  //     return value.toFixed(2);
                  // }}
                  />
                  <Text style={{marginTop: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_10, textTransform: 'uppercase'}}>{t('bloodPressureScreen.pulse')}</Text>
              
            </View>

          </View>

         { getData.length > 0 &&
            lastPressure()
         }

          <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, marginBottom: spacing.SCALE_6, borderRadius: 5}}>
            <View style={{alignItems: 'center', backgroundColor: colors.COLORS.DEEP_BLUE, borderTopRightRadius: 5, borderTopLeftRadius: 5, padding: spacing.SCALE_5}}>
              <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.WHITE}}>{t('bloodPressureScreen.measurement-history')}</Text>
            </View>
          
          { 
          getData.length > 0 ?
          (
          <BigList
              data={getData}
              onEndReachedThreshold={1}
              itemHeight={80}
              renderItem={({item}) => (
              
                <TouchableOpacity
                onPress={() => 
                  navigation.navigate('BloodPressureViewItemScreen', {itemId: item.id})
                }
                >
                <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, paddingBottom: spacing.SCALE_7, marginTop: spacing.SCALE_6}}>
                  
                  <View style={{alignItems: 'flex-start', marginLeft: spacing.SCALE_10, flex: 2}}>
                         <Text style={{fontSize: typography.FONT_SIZE_11}}>{format(item.createdAt.toDate(), 'yyyy/MM/dd')}</Text>
                         <Text style={{fontSize: typography.FONT_SIZE_9}}>{format(item.createdAt.toDate(), 'HH:mm')}</Text>
                  </View>

                  <View style={{flexDirection: 'column', flex: 6}}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 2 }}>
                          <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.RED}}>{t('bloodPressureScreen.sys')}</Text>
                            <Text style={{fontSize: typography.FONT_SIZE_22, color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{item.systolic} </Text> 
                          </View>

                          <View style={{alignItems: 'center'}}>
                            <Text></Text>
                             <Text style={{fontSize: typography.FONT_SIZE_18}}>/</Text>
                          </View>

                          <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.ORANGE}}>{t('bloodPressureScreen.dia')}</Text>
                            <Text style={{fontSize: typography.FONT_SIZE_22, color: colors.TEXT.BLACK, fontWeight: 'bold'}}> {item.diastolic}</Text> 
                         </View>

                         <View style={{alignItems: 'center'}}>
                            <Text></Text>
                            <Text style={{fontSize: typography.FONT_SIZE_10}}> mmHg</Text>
                         </View>

                      </View>

                      
                      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                           <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.LIGHT_BLUE}}>{t('bloodPressureScreen.pulse')}</Text>
                           <Text style={{fontSize: typography.FONT_SIZE_22, color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{item.pulse}</Text> 
                        </View>

                         <View style={{alignItems: 'center'}}>
                           <Text></Text>
                           <Text style={{fontSize: typography.FONT_SIZE_10}}> {t('bloodPressureScreen.bpm')}</Text>
                        </View>
                      </View>
                    
                      </View>

                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: typography.FONT_SIZE_12}}>{pressure(item)}</Text>
                    </View>

                  </View>

                  <View style={{marginHorizontal: spacing.SCALE_10, alignItems: 'flex-end'}}>
                    <MaterialIcons name='keyboard-arrow-right' size={spacing.SCALE_22} color={colors.COLORS.GREY_AAA} />
                  </View>

                </View>
                
                </TouchableOpacity>
                
              )}
            />
            ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: typography.FONT_SIZE_18, color: colors.TEXT.DEEP_BLUE}}>{t('bloodPressureScreen.no-data')}</Text>
            </View>
            )
            // (
            //     <ActivityIndicator size="large" color="#224870" />
            //   )
            }

          </View>

        </View>

        <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
       // closeOnPressBack={true}
        onClose={() => setIsOpen(false)}
        //animationType='slide'
        height={heightModal}
        openDuration={400}
        closeDuration={200}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: colors.COLORS.DEEP_BLUE,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            elevation: 15, 
            backgroundColor: colors.COLORS.GREY_DDD
          }
        }}
      >
       <View style={styles.modalRoot}>
        {/* <Text>{userData.weightName}</Text> */}
        <View style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginBottom: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_8, borderRadius: 5}}>
            <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>{t('bloodPressureScreen.give-data')}</Text>
        </View>

        {/* <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: 3}}>
            
              <TouchableOpacity onPress={() => setOpen1(true)} style={{borderWidth: 1, borderColor: colors.COLORS.GREY_DDD, padding: 8, backgroundColor: colors.COLORS.WHITE}}>
                <Text style={{fontSize: 12, marginBottom: 5}}>Data</Text>
                <Text style={{fontSize: 16, color: colors.TEXT.BLACK}}>{moment(dateForm).format('DD-MM-YYYY')}</Text>
              </TouchableOpacity>
                         
                  <DatePicker
                    modal
                    mode='date'
                    locale='PL-pl'
                    title='Data dodania'
                    confirmText='Ustaw'
                    cancelText='Anuluj'
                    open={open1}
                    date={dateForm}
                    onConfirm={(dateForm) => {
                      setOpen1(false)
                      setDateForm(dateForm)
                    }}
                    onCancel={() => {
                      setOpen1(false)
                    }}
                  />
            </View>

            <View style={{flex: 1, marginLeft: 3}}>
            <TouchableOpacity onPress={() => setOpen2(true)} style={{borderWidth: 1, borderColor: colors.COLORS.GREY_DDD, padding: 8, backgroundColor: colors.COLORS.WHITE}}>
                <Text style={{fontSize: 12, marginBottom: 5}}>Godzina</Text>
                <Text style={{fontSize: 16, color: colors.TEXT.BLACK}}>{moment(timeForm).format("HH:mm")}</Text>
              </TouchableOpacity>
                         
                  <DatePicker
                    modal
                    mode='time'
                    locale='PL-pl'
                    title='Godzina dodania'
                    confirmText='Ustaw'
                    cancelText='Anuluj'
                    open={open2}
                    date={timeForm}
                    onConfirm={(timeForm) => {
                      setOpen2(false)
                      setTimeForm(timeForm)
                    }}
                    onCancel={() => {
                      setOpen2(false)
                    }}
                  />
            </View>
          </View> */}

          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('bloodPressureScreen.systolic') + ' (mmHg)'}
                        value={systolic.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setSystolic}
                        keyboardType="numeric"
                    />
                </View>
          </View>
          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('bloodPressureScreen.diastolic') + ' (mmHg)'}
                        value={diastolic.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setDiastolic}
                        keyboardType="numeric"
                    />
                </View>
          </View>
          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('bloodPressureScreen.pulse') + ' (' + t('bloodPressureScreen.bpm') + ')'}
                        value={pulse.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setPulse}
                        keyboardType="numeric"
                    />
                </View>
          </View>

          <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
              <TouchableOpacity onPress={() => {handleAdd(); toggleLoading(true)}} style={[styles.btnModal, {backgroundColor: getBackGroundColor()}]} disabled={!emptyBtn}>

              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: spacing.SCALE_10}}>
                  { isLoading && <ActivityIndicator size="small" color={colors.TEXT.WHITE} /> }
                </View>
                <View>
                  <Text style={styles.textBtn}>{t('bloodPressureScreen.save')}</Text>
                </View>
              </View>
                
              </TouchableOpacity>

          </View>

       </View>
       </RBSheet>

      <AnimatedFAB
        icon={'plus'}
        label={'Dodaj'}
       // extended={isExtended}
        onPress={() => {
            refRBSheet.current.open();
        }}
        visible={visible}
        theme={'tertiary'}
        animateFrom={'right'}
        iconMode={'static'}
       

        style={[styles.fabStyle, style, fabStyle]}
      />
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default BloodPressureScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginHorizontal: spacing.SCALE_6,
    flex: 1
  },
  fabStyle: {
    bottom: spacing.SCALE_16,
    right: spacing.SCALE_16,
    position: 'absolute',
  },
  modalRoot: {
    flex: 1,
    marginHorizontal: spacing.SCALE_6,
},
  btnModal: {
    borderWidth: 0,
    padding: spacing.SCALE_10,
    width: Dimensions.get('window').width-12,
    borderRadius: 10,
    alignItems: 'center',
    //backgroundColor: getBackGroundColor(),
    elevation: 2,
    marginBottom: spacing.SCALE_10,
  },
  textBtn: {
    color: colors.TEXT.WHITE
  },
  boxTitle: {
    backgroundColor: colors.COLORS.WHITE,
    padding: spacing.SCALE_5,
    borderRadius: 5,
    marginBottom: spacing.SCALE_6,    
  },
  boxText: {
    textTransform: 'uppercase',
    fontSize: typography.FONT_SIZE_10,
    color: colors.TEXT.DEEP_BLUE
  },
})