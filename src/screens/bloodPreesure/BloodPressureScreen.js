import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ToastAndroid, Alert, ActivityIndicator } from 'react-native'
import React, {useState, useEffect, useContext, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedFAB, DefaultTheme, Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import RBSheet from "react-native-raw-bottom-sheet";
import { format} from 'date-fns';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CircularProgress from 'react-native-circular-progress-indicator';
import BigList from "react-native-big-list";
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { fontScale, isTablet } from 'react-native-utils-scale';
import { scaleFont } from '../../styles/mixins';

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
         const dateB = new Date(doc.data().birthday.seconds * 1000);
         setUserAge(new Date().getFullYear() - dateB.getFullYear());        
       }
     })
   };

   const getMeasurement = () => {
    firestore().collection('users').doc(user.uid).collection('bloodPressure')
      .orderBy('createdAt', 'desc')
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
            querySnapshot.forEach(doc => {
            
             if( doc.exists ) {
          
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
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage2}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage2}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage2}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage2}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage2}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage2}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
          <Text style={styles.textMessage1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }

   
  }
 
  const pressure = (item) => {
   
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
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3,paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 0 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P2, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.high-correct')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 1 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4,paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-4st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-1st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 2 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-5st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P3, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-2st')}</Text>
        </View>
      )
    }else if(sbpt === 3 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 0){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 1){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox2}>{t('bloodPressureScreen.value-6st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 2){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 3){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }else if(sbpt === 4 && dbpt === 4){
      return(
        <View style={{backgroundColor: colors.PRESSURE.P4, paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5, alignItems: 'center'}}>
          <Text style={styles.textMessageBox1}>{t('bloodPressureScreen.value-3st')}</Text>
        </View>
      )
    }

  }


   useEffect(() => {
      
    getUser();
    getMeasurement();
    getLastMeasurement();
    const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
  }, [navigation, loading]);

  const handleAdd = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('bloodPressure')
      .add({
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
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
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
        height: isTablet ? 300 : 126,
      }}
      imageStyle={{
       
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
                radius={isTablet ? 70 : 40}
                maxValue={200}
                inActiveStrokeOpacity={0.8}
                activeStrokeWidth={ isTablet ? 15 : 10 }
                inActiveStrokeWidth={isTablet ? 15 : 10 }
                progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? fontScale(typography.FONT_SIZE_35) : fontScale(typography.FONT_SIZE_26), marginBottom: -spacing.SCALE_8 }}
                activeStrokeColor={colors.COLORS.DEEP_BLUE}
                inActiveStrokeColor={colors.COLORS.GREY_999}
                duration={2000}
                title={'mmHg'}
                titleColor={colors.COLORS.DEEP_BLUE}
                titleStyle={{fontWeight: '300', fontSize: fontScale(typography.FONT_SIZE_14)}}
                dashedStrokeConfig={{
                    count: isTablet ? 40 : 30,
                    width: isTablet ? 10 : 8,
                }}
              
                 />
                 <Text style={{marginTop: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? scaleFont(typography.FONT_SIZE_14) : scaleFont(typography.FONT_SIZE_10), textTransform: 'uppercase'}}>{t('bloodPressureScreen.systolic')}</Text>
            </View>

            <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, marginRight: spacing.SCALE_3, padding: spacing.SCALE_10, alignItems: 'center'}}>
              <CircularProgress
                  value={getDiastolic}
                  radius={isTablet ? 70 : 40}
                  maxValue={200}
                  inActiveStrokeOpacity={0.8}
                  activeStrokeWidth={ isTablet ? 15 : 10 }
                  inActiveStrokeWidth={isTablet ? 15 : 10 }
                  progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? fontScale(typography.FONT_SIZE_35) : fontScale(typography.FONT_SIZE_26), marginBottom: -spacing.SCALE_8 }}
                  activeStrokeColor={colors.COLORS.DEEP_BLUE}
                  inActiveStrokeColor={colors.COLORS.GREY_999}
                  duration={2000}
                  title={'mmHg'}
                  titleColor={colors.COLORS.DEEP_BLUE}
                  titleStyle={{fontWeight: '300', fontSize: fontScale(typography.FONT_SIZE_14)}}
                  dashedStrokeConfig={{
                    count: isTablet ? 40 : 30,
                    width: isTablet ? 10 : 8,
                  }}
                  
                  />
                  <Text style={{marginTop: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? fontScale(typography.FONT_SIZE_14) : fontScale(typography.FONT_SIZE_10), textTransform: 'uppercase'}}>{t('bloodPressureScreen.diastolic')}</Text>
              </View>

            <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, marginLeft: spacing.SCALE_3, padding: spacing.SCALE_10, alignItems: 'center'}}>
            <CircularProgress
                  value={getPulse}
                  radius={isTablet ? 70 : 40}
                  maxValue={150}
                  inActiveStrokeOpacity={0.8}
                  activeStrokeWidth={ isTablet ? 15 : 10 }
                  inActiveStrokeWidth={isTablet ? 15 : 10 }
                  progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? fontScale(typography.FONT_SIZE_35) : fontScale(typography.FONT_SIZE_26), marginBottom: -spacing.SCALE_8 }}
                  activeStrokeColor={colors.COLORS.DEEP_BLUE}
                  inActiveStrokeColor={colors.COLORS.GREY_999}
                  duration={2000}
                  title={t('bloodPressureScreen.bpm')}
                  titleColor={colors.COLORS.DEEP_BLUE}
                  titleStyle={{fontWeight: '300', fontSize: fontScale(typography.FONT_SIZE_14)}}
                  dashedStrokeConfig={{
                    count: isTablet ? 40 : 30,
                    width: isTablet ? 10 : 8,
                  }}
                
                  />
                  <Text style={{marginTop: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? scaleFont(typography.FONT_SIZE_14) : scaleFont(typography.FONT_SIZE_10), textTransform: 'uppercase'}}>{t('bloodPressureScreen.pulse')}</Text>
              
            </View>

          </View>

         { getData.length > 0 &&
            lastPressure()
         }

          <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, marginBottom: spacing.SCALE_6, borderRadius: 5}}>
            <View style={{alignItems: 'center', backgroundColor: colors.COLORS.DEEP_BLUE, borderTopRightRadius: 5, borderTopLeftRadius: 5, padding: spacing.SCALE_5}}>
              <Text style={{fontSize: fontScale(typography.FONT_SIZE_16), color: colors.TEXT.WHITE}}>{t('bloodPressureScreen.measurement-history')}</Text>
            </View>
          
          { 
          getData.length > 0 ?
          (
          <BigList
              data={getData}
              onEndReachedThreshold={1}
              itemHeight={ isTablet ? 110 : 80}
              renderItem={({item}) => (
              
                <TouchableOpacity
                onPress={() => 
                  navigation.navigate('BloodPressureViewItemScreen', {itemId: item.id})
                }
                >
                <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, paddingBottom: spacing.SCALE_7, marginTop: spacing.SCALE_6}}>
                  
                  <View style={{alignItems: 'flex-start', marginLeft: spacing.SCALE_10, flex: 2}}>
                         <Text style={{fontSize: fontScale(typography.FONT_SIZE_11)}}>{format(item.createdAt.toDate(), 'yyyy/MM/dd')}</Text>
                         <Text style={{fontSize: fontScale(typography.FONT_SIZE_9)}}>{format(item.createdAt.toDate(), 'HH:mm')}</Text>
                  </View>

                  <View style={{flexDirection: 'column', flex: 6}}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 2 }}>
                          <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.TEXT.RED}}>{t('bloodPressureScreen.sys')}</Text>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_22), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{item.systolic} </Text> 
                          </View>

                          <View style={{alignItems: 'center'}}>
                            <Text></Text>
                             <Text style={{fontSize: fontScale(typography.FONT_SIZE_18)}}>/</Text>
                          </View>

                          <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.TEXT.ORANGE}}>{t('bloodPressureScreen.dia')}</Text>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_22), color: colors.TEXT.BLACK, fontWeight: 'bold'}}> {item.diastolic}</Text> 
                         </View>

                         <View style={{alignItems: 'center'}}>
                            <Text></Text>
                            <Text style={{fontSize: typography.FONT_SIZE_10}}> mmHg</Text>
                         </View>

                      </View>

                      
                      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                           <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.TEXT.LIGHT_BLUE}}>{t('bloodPressureScreen.pulse')}</Text>
                           <Text style={{fontSize: fontScale(typography.FONT_SIZE_22), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{item.pulse}</Text> 
                        </View>

                         <View style={{alignItems: 'center'}}>
                           <Text></Text>
                           <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}> {t('bloodPressureScreen.bpm')}</Text>
                        </View>
                      </View>
                    
                      </View>

                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{pressure(item)}</Text>
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
          
            }

          </View>

        </View>

        <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => setIsOpen(false)}
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
       
        <View style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginBottom: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_8, borderRadius: 5}}>
            <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>{t('bloodPressureScreen.give-data')}</Text>
        </View>

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
    fontSize: scaleFont(typography.FONT_SIZE_12),
    color: colors.TEXT.DEEP_BLUE
  },
  textMessage1: {
    fontSize: isTablet ? scaleFont(typography.FONT_SIZE_14) : scaleFont(typography.FONT_SIZE_12),
    fontWeight: 'bold', color: colors.TEXT.BLACK,
    textTransform: 'uppercase',
  },
  textMessage2: {
    fontSize: isTablet ? scaleFont(typography.FONT_SIZE_14) : scaleFont(typography.FONT_SIZE_12),
    fontWeight: 'bold', color: colors.TEXT.WHITE,
    textTransform: 'uppercase',
  },
  textMessageBox1: {
    fontSize: isTablet ? scaleFont(typography.FONT_SIZE_14) : scaleFont(typography.FONT_SIZE_12),
    color: colors.TEXT.BLACK
  },
  textMessageBox2: {
    fontSize: isTablet ? scaleFont(typography.FONT_SIZE_14) : scaleFont(typography.FONT_SIZE_12),
    color: colors.TEXT.WHITE
  }
})