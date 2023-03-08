import { StyleSheet, Text, View, Animated, ImageBackground, StatusBar, Dimensions, ToastAndroid, ActivityIndicator, Pressable } from 'react-native'
import React, {useState, useEffect, useContext, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedFAB, DefaultTheme, Provider as PaperProvider, Appbar, TextInput } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import RBSheet from "react-native-raw-bottom-sheet";
import { format } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import BigList from "react-native-big-list";
import { UNIT } from '../../styles/units';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const WeightLogScreen = ({ route,
  navigation,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode }) => {

const {t, i18n} = useTranslation();

const _goBack = () => navigation.navigate('HomeScreen');

const [isExtended, setIsExtended] = useState(true);

  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  //---------------------------------------------------------------
  const {user} = useContext(AuthContext);
  const [userAge, setUserAge] = useState(0);   //Wiek
  const [userWeight, setUserWeight] = useState(0); //waga KG
  const [userWeightLB, setUserWeightLB] = useState(0); //waga funt
 
  const [userHeigth, setUserHeight] = useState(0); //wzrost
  const [userTargetWeight, setUserTargetWeight] = useState(0); //waga docelowa
  const [userTarget, setUserTarget] = useState(0); //roznica
  const [userGender, setUserGender] = useState(0); 

  const refRBSheet = useRef();
  const [isOpen, setIsOpen] = useState(true);
  const heightModal = (Dimensions.get('window').height/2);

  //---------------------------------------------------------------------------------
  const [currentWeightInput, setCurrentWeightInput] = useState(''); //aktualna waga TextInput
  const [hipGirth, setHipGirth] = useState(''); //Obwód bioder TextInput
  //---------------------------------------------------------------------------------

  const [dataWeight, setDataWeight] = useState([]);
  const [weightWag, setWeightWag] = useState(0); //waga z dziennika
  const [targetWeight, setTargetWeight] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);

  //---------------------------------------------------------------------------------
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); //button
  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const getUser = async () => {
    await firestore()
     .collection('users')
     .doc(user.uid)
     .collection('profile')
     .doc('profil')
     .get()
     .then(( doc ) => {
       if( doc.exists ) {
         setUserData(doc.data());
         const dateB = new Date(doc.data().birthday.seconds * 1000);
         setUserAge(new Date().getFullYear() - dateB.getFullYear());
         setUserWeight(doc.data().weightName);
         setUserWeightLB(doc.data().weightNameLB);
         setUserHeight(doc.data().heightName);
         setUserTargetWeight(doc.data().targetWeight);
         setUserTarget(doc.data().weightName - doc.data().targetWeight);
         setUserGender(doc.data().gender);


       }
     })
   };

   useEffect(() => {
    getUser();
    
    const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
   }, [navigation, loading, currentWeightInput]);

   useEffect(() => {
    
      getWeight();
    
   }, []);

   const getWeight = () => {
    firestore().collection('users').doc(user.uid).collection('weightLog')
      .orderBy('createdAt', 'desc')
      .limit(1)
      
      .onSnapshot(
         querySnapshot => {
          const arrayWeight = [];
            querySnapshot.forEach(doc => {
          
             if( doc.exists ) {
              const subWag =  doc.data().targetWeight - doc.data().currentWeight;
              arrayWeight.push({...doc.data(), id: doc.id, subWag: subWag}); 
              setWeightWag(doc.data().currentWeight);
              setTargetWeight(doc.data().targetWeight);
              setCurrentWeight(doc.data().currentWeight);
              setDataWeight(arrayWeight);
             }
             
            });
            
              
            },
              error => {
               console.log(error)
            }
        
    )
  }

  const _getWeightUnit = () => {
    try{
        if(userData.weightUnit === UNIT.KG){
            return Number(userData.weightName).toFixed(2);
        }else{
            return Number(userData.weightNameLB).toFixed(2);
        }
      }catch(e){
      console.log(e);
    }
  }

  const _getTargetUnit = () => {
    try{
      if(userData.weightUnit === UNIT.KG){
          return Number(userData.targetWeight).toFixed(2);
      }else{
          return Number(userData.targetWeightLB).toFixed(2);;
      }
    }catch(e){
      console.log(e);
    }
  }

  //hipGirth
  //Zamiana jednostek wysokości
  const _getHightUnit = () => {
    try{
      if(userData.growthUnit === UNIT.CM){
        return hipGirth;
      }else{
        return hipGirth * 2.54;
      }
    }catch(e){
      console.log(e);
    }
  }

  //console.log(_getHightUnit())

  const sing = (item) => {

    if(item.difference === 0){
        return (
            <Text>-</Text>
        )
    }
    else if(item.difference > 0 ){
      
      if(userData.weightUnit === UNIT.KG){
         return (
            <Text style={{color: colors.TEXT.RED, fontSize: fontScale(typography.FONT_SIZE_13)}}>+{ (item.difference).toFixed(2)}</Text>
        )
      }else{
        return (
          <Text style={{color: colors.TEXT.RED, fontSize: fontScale(typography.FONT_SIZE_13)}}>+{ (item.differenceLB).toFixed(2)}</Text>
      )
      }
       

    }else{
      
        if(userData.weightUnit === UNIT.KG){
          return (
            <Text style={{color: colors.TEXT.GREEN, fontSize: fontScale(typography.FONT_SIZE_13)}}>{ (item.difference).toFixed(2)}</Text>
        )
      }else{
        return (
          <Text style={{color: colors.TEXT.GREEN, fontSize: fontScale(typography.FONT_SIZE_13)}}>{ (item.differenceLB).toFixed(2)}</Text>
      )
     }
    }

}


  const getBMI = () => {

    if(userData.weightUnit === UNIT.KG){
      const bmi = parseFloat(currentWeightInput) / ((parseFloat(userHeigth) * parseFloat(userHeigth)) / 10000);
      return bmi;
    }else{
      const bmi = parseFloat(currentWeightInput * 0.45359237) / ((parseFloat(userHeigth) * parseFloat(userHeigth)) / 10000);
      return bmi;
    }


    
    
    
  }
  
  const getLMB = () => {
    //LMB
      //LBM (kobiety) = 1,07 x całkowita masa ciała (kg) - 148 [całkowita masa ciała/ wzrost (cm)]2
      //LBM (mężczyźni) = 1,1 x całkowita masa ciała (kg) -128 [całkowita masa ciała/ wzrost (cm)]2 
      let lbm = 0;
      let kwadrat = 0;

      if(userGender === 1){
        kwadrat = (currentWeightInput / userHeigth) * (currentWeightInput / userHeigth);
        lbm = 1.07 * parseFloat(currentWeightInput) - 148 * ( parseFloat(currentWeightInput) / (parseFloat(userHeigth) * parseFloat(userHeigth) ));
        return lbm;
      }else{
        kwadrat = (currentWeightInput / userHeigth) * (currentWeightInput / userHeigth);
        lbm = 1.1 * parseFloat(currentWeightInput) - 128 * kwadrat;
        return lbm;
      }
  }

  

  const _handleAdd = async () => {

    let diffKG = 0;
    let diffLB = 0;

    if(userData.weightUnit === UNIT.KG){
      diffKG = parseFloat(currentWeightInput) - parseFloat(userWeight);
      diffLB = parseFloat(currentWeightInput / 0.4536) - parseFloat(userWeight / 0.4536);
    }else{
      diffKG = parseFloat(currentWeightInput * 0.45359237) - parseFloat(userWeight);
      diffLB = parseFloat(currentWeightInput) - parseFloat(userWeightLB);
    }


    if(userData.weightUnit === UNIT.KG){
      lbmKG = getLMB();
      lbmLB = getLMB() / 0.4536;
    }else{
      lbmKG = getLMB() * 0.45359237;
      lbmLB = getLMB();
    }
    


    let weightKG = 0;
    let weightLB = 0;
  
    if(userData.weightUnit === UNIT.KG){
      weightKG = parseFloat(currentWeightInput);               
      weightLB = parseFloat(currentWeightInput) / 0.4536;              
    }else{
      weightKG = parseFloat(currentWeightInput) * 0.45359237;  
      weightLB = parseFloat(currentWeightInput);                     
    }
     
    const bai = _getHightUnit() / Math.pow((userHeigth/100), 1.5)-18;

    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('profil')
    .update({
      weightName: parseFloat(weightKG.toFixed(2)),
      weightNameLB: parseFloat(weightLB.toFixed(2)),
    });

   await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('weightLog')
    .add({
      createdAt: firestore.Timestamp.fromDate(new Date()),
      bmi: getBMI(),
      currentWeight: weightKG,
      currentWeightLB: weightLB,
      lbm: lbmKG,
      lbmLB: lbmLB,
      targetWeight: parseFloat(userData.targetWeight),
      targetWeightLB: parseFloat(userData.targetWeightLB),
      bai: hipGirth ? bai : 0,
      difference: dataWeight.length === 0 ? 0 : diffKG,
      differenceLB: dataWeight.length === 0 ? 0 : diffLB,
    })
    .then(() => {
      console.log('Added');
      refRBSheet.current.close();
      setIsLoading(false);  
      ToastAndroid.show(t('weightLogScreen.measurement-added'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      
    })
  }

 
  const diff = (item) => {
    if(dataWeight.length === 0) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text style={[styles.textCard,{color: colors.TEXT.RED}]}>+{(userTarget).toFixed(2)}</Text>
          <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>({userData.weightUnit})</Text>
        </View>
      );
    } else {
      if(item.currentWeight - userTargetWeight > 0){
        
          if(userData.weightUnit === UNIT.KG){
            return (
                    <View style={{alignItems: 'center'}}>
                      <Text style={[styles.textCard,{color: colors.TEXT.RED}]}>+{(item.currentWeight - item.targetWeight).toFixed(2)}</Text>
                      <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>({userData.weightUnit})</Text>
                    </View>
            );
          } else {
            return (
              <View style={{alignItems: 'center'}}>
                <Text style={[styles.textCard,{color: colors.TEXT.RED}]}>+{(item.currentWeightLB - item.targetWeightLB).toFixed(2)}</Text>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>({userData.weightUnit})</Text>
              </View>
            );
          }

      }else{
        return (
                
                <View style={{alignItems: 'center'}}>
                  <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.COLORS.DEEP_BLUE, fontWeight: 'bold'}}>{t('weightLogScreen.set')}</Text>
                  
                  <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.COLORS.DEEP_BLUE, fontWeight: 'bold'}}>{t('weightLogScreen.objective')}</Text>
                  <Pressable 
                    onPress={() => {
                      navigation.navigate('EditProfile');
                  }} style={{marginTop: 2}}
                    >
                    <View style={{borderWidth: 1, borderColor: colors.COLORS.DEEP_BLUE, borderRadius: 5, padding: spacing.SCALE_10, backgroundColor: colors.COLORS.DEEP_BLUE}}>
                      <MaterialIcons name='edit' size={spacing.SCALE_14} color={colors.COLORS.WHITE}/>
                    </View>
                  </Pressable>
                  </View>
                
              )
      }
    }
  }

  const colorBMI = (item) => {
    let color;
    if(item.bmi < 16.00){
      color = colors.BMI.BMI_1;
    } else if ((item.bmi >= 16.00) && (item.bmi <= 16.99)){
      color = colors.BMI.BMI_2;
    } else if ((item.bmi >= 17.00) && (item.bmi <= 18.49)){
        color = colors.BMI.BMI_3;
    } else if ((item.bmi >= 18.50) && (item.bmi <= 24.99)){
        color = colors.BMI.BMI_4;
    } else if ((item.bmi >= 25.00) && (item.bmi <= 29.99)){
        color = colors.BMI.BMI_5;
    } else if ((item.bmi >= 30.00) && (item.bmi <= 34.99)){
        color = colors.BMI.BMI_6;
    } else if ((item.bmi >= 35.00) && (item.bmi <= 39.99)){
        color = colors.BMI.BMI_7;
    }else {
      color = colors.BMI.BMI_8;
    }
    return color;
  }

  const textBMI = (item) => {
    if(item.bmi < 16.00){
        return( 
          <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
            <Text style={styles.textTitle}>{t('value.starvation')}</Text>
          </View>
         );
    } else if ((item.bmi >= 16.00) && (item.bmi <= 16.99)){
        return( 
          <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
            <Text style={styles.textTitle}>{t('value.emaciation')}</Text>
          </View>
         );
    } else if ((item.bmi >= 17.00) && (item.bmi <= 18.49)){
        return( 
          <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
            <Text style={styles.textTitle}>{t('value.underweight')}</Text>
          </View>
         );
    } else if ((item.bmi >= 18.50) && (item.bmi <= 24.99)){
       return( 
        <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
            <Text style={styles.textA}>{t('value.normal')}</Text>
        </View>
       );
    } else if ((item.bmi >= 25.00) && (item.bmi <= 29.99)){
        return( 
          <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
            <Text style={styles.textTitle}>{t('value.overweight')}</Text>
        </View>
         );
    } else if ((item.bmi >= 30.00) && (item.bmi <= 34.99)){
        return( 
          <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
              <Text style={styles.textTitle}>{t('"value.1st')}</Text>
          </View>
         );
    } else if ((item.bmi >= 35.00) && (item.bmi <= 39.99)){
        return( 
          <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
              <Text style={styles.textTitle}>{t('value.2st')}</Text>
          </View>
         );
    }else {
        return( 
          <View style={{backgroundColor: colorBMI(item), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
              <Text style={styles.textTitle}>{t('value.3st')}</Text>
          </View>
         );
    }
  }
  
  const textBAI = (item) => { 
      
    if(userGender === 2){

      if(userAge < 20){
        return(
          <Text>{t('value.low-age')}</Text>
        )
      }
      if((userAge >= 20) && (userAge <= 39)){
        if(item.bai < 8){
          return (
            <View style={[styles.boxRoot, {backgroundColor: colors.BAI.BAI_1}]}>
              <Text>{t('value.underweight')}</Text>
            </View>
          )
        }
        if((item.bai >= 8) && (item.bai <= 21)){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
              <Text>{t('value.normal')}</Text>
            </View>
          )
        }
        if((item.bai >= 21) && (item.bai <= 26)){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_3}]}>
              <Text>{t('value.overweight')}</Text>
            </View>
            )
        }else{
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_4}]}>
              <Text>{t('value.obesity')}</Text>
            </View>
            )
        }
      }

      if((userAge >= 40) && (userAge <= 59)){
          if(item.bai < 11){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
                <Text>{t('value.underweight')}</Text>
              </View>
            )
          }
          if((item.bai >= 11) && (item.bai <= 23)){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                <Text>{t('value.normal')}</Text>
              </View>
            )
          }
          if((item.bai >= 23) && (item.bai)){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_3}]}>
                <Text>{t('value.overweight')}</Text>
              </View>
              )
          }else{
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_4}]}>
                <Text>{t('value.obesity')}</Text>
              </View>
              )
          }
      }

      if((userAge >= 60) && (userAge <= 79)){
          if(item.bai < 13){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
                <Text>{t('value.underweight')}</Text>
              </View>
            )
          }
          if((item.bai >= 13) && (item.bai <= 25)){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                <Text>{t('value.normal')}</Text>
              </View>
            )
          }
          if((item.bai >= 25) && (item.bai <= 31)){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_3}]}>
                <Text>{t('value.overweight')}</Text>
              </View>
              )
          }else{
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_4}]}>
                <Text>{t('value.obesity')}</Text>
              </View>
              )
          }

      } else {
        return(
          <Text>{t('value.too-age')}</Text>
        )
      }
  //Kobieta    
  } else {
    
    if(userAge < 20){
      return(
        <Text>{t('value.low-age')}</Text>
      )
    }
    if((userAge >= 20) && (userAge <= 39)){
      if(item.bai < 21){
        return (
          <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
            <Text>{t('value.underweight')}</Text>
          </View>
        )
      }
      if((item.bai >= 21) && (item.bai <= 33)){
        return (
          <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
            <Text>{t('value.normal')}</Text>
          </View>
        )
      }
      if((item.bai >= 33) && (item.bai <= 39)){
        return (
          <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_3}]}>
            <Text>{t('value.overweight')}</Text>
          </View>
          )
      }else{
        return (
          <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_4}]}>
            <Text>{t('value.obesity')}</Text>
          </View>
          )
      }
    }

    if((userAge >= 40) && (userAge <= 59)){
        if(item.bai < 23){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
              <Text>{t('value.underweight')}</Text>
            </View>
          )
        }
        if((item.bai >= 23) && (item.bai <= 35)){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
              <Text>{t('value.normal')}</Text>
            </View>
          )
        }
        if((item.bai >= 35) && (item.bai <= 41)){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_3}]}>
              <Text>{t('value.overweight')}</Text>
            </View>
            )
        }else{
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_4}]}>
              <Text>{t('value.obesity')}</Text>
            </View>
            )
        }
    }

    if((userAge >= 60) && (userAge <= 79)){
        if(item.bai < 25){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
              <Text>{t('value.underweight')}</Text>
            </View>
          )
        }
        if((item.bai >= 25) && (item.bai <= 38)){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
              <Text>{t('value.normal')}</Text>
            </View>
          )
        }
        if((item.bai >= 38) && (item.bai <= 43)){
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_3}]}>
              <Text>{t('value.overweight')}</Text>
            </View>
            )
        }else{
          return (
            <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_4}]}>
              <Text>{t('value.obesity')}</Text>
            </View>
            )
        }

    } else {
      return(
        <Text>{t('value.too-age')}</Text>
      )
    }
  }
  }
  
const [isExpanded, setIsExpanded] = useState(false);
const [isExpanded2, setIsExpanded2] = useState(false);
const [isExpanded3, setIsExpanded3] = useState(false);


  const ExpandableView = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));
  
    useEffect(() => {
      Animated.timing(height, {
        toValue: expanded ? 60 : 0,
        duration: 150,
        useNativeDriver: false
      }).start();
    }, [expanded, height]);
  
    // console.log('rerendered');
  
    return (
      <Animated.View
        style={{ height, backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
      >
        <Text style={{fontSize: fontScale(typography.FONT_SIZE_12), color: colors.TEXT.DEEP_BLUE}}>
          {t('weightLogScreen.text-lbm')}
        </Text>
      </Animated.View>
    );
  };
  
  const ExpandableView2 = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));
  
    useEffect(() => {
      Animated.timing(height, {
        toValue: expanded ? 40 : 0,
        duration: 150,
        useNativeDriver: false
      }).start();
    }, [expanded, height]);
  
    // console.log('rerendered');
  
    return (
      <Animated.View
        style={{ height , backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
      >
        <Text style={{fontSize: fontScale(typography.FONT_SIZE_12), color: colors.TEXT.DEEP_BLUE}}>
          {t('weightLogScreen.text-bai')}
        </Text>
      </Animated.View>
    );
  };

  const ExpandableView3 = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));
  
    useEffect(() => {
      Animated.timing(height, {
        toValue: expanded ? 76 : 0,
        duration: 150,
        useNativeDriver: false
      }).start();
    }, [expanded, height]);
  
    return (
      <Animated.View
        style={{ height , backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
      >
        <Text style={{fontSize: fontScale(typography.FONT_SIZE_12), color: colors.TEXT.DEEP_BLUE}}>
          {t('weightLogScreen.text-bmi')}
        </Text>
      </Animated.View>
    );
  };

  const emptyBtn = (currentWeightInput != null && currentWeightInput != '' && currentWeightInput != 0);

  const imageBG = require('../../assets/images/waga1.jpg');

  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('memu-weight.weight-log')} />
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
          opacity: 0.5,
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
          //opacity: 0.8
        }}
        >

          <View style={styles.rootContainer}>
           
          { dataWeight.length === 0 ?
            (
              <View style={{flexDirection: 'row'}}>

                <View style={[styles.boxCard,{marginRight: spacing.SCALE_6}]}>
                  <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>{t('weightLogScreen.current-weight')}</Text>
                    <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                      <Text style={styles.textCard}>{ _getWeightUnit() }</Text>
                      <Text style={{fontSize: 10}}>({userData.weightUnit})</Text>
                  </View>
                </View>

                <View style={[styles.boxCard,{marginRight: spacing.SCALE_6}]}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>{t('weightLogScreen.target-weight')}</Text>
                  <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                    <Text style={styles.textCard}>{_getTargetUnit()}</Text>
                    <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>({userData.weightUnit})</Text>
                  </View>
                </View>

                <View style={styles.boxCard}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>{t('weightLogScreen.difference')}</Text>
                  <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                    <Text style={[styles.textCard,{color: colors.TEXT.RED}]}>+{(_getWeightUnit() - _getTargetUnit()).toFixed(2)}</Text>
                    <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>({userData.weightUnit})</Text>
                   
                  </View>
                </View>

              </View> 
              ) : ('')
            }
              
            
              { dataWeight.length > 0 ?
                  (
                  <BigList
                      data={dataWeight}
                      onEndReachedThreshold={1}
                      itemHeight={ isTablet ? 770 : 510}
                      renderItem={({item}) => (
                      <>
                        <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>

                          <View style={[styles.boxCard,{marginRight: spacing.SCALE_6}]}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>{t('weightLogScreen.current-weight')}</Text>
                              <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                                <Text style={styles.textCard}>

                                  { userData.weightUnit === UNIT.KG && Number(item.currentWeight).toFixed(2) }
                                  { userData.weightUnit === UNIT.LB && (Number(item.currentWeightLB)).toFixed(2) }
                                                                 
                                </Text>
                                <Text style={{fontSize: 10}}>({userData.weightUnit})</Text>
                            </View>
                          </View>

                          <View style={[styles.boxCard,{marginRight: spacing.SCALE_6}]}>
                          <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>{t('weightLogScreen.target-weight')}</Text>
                            <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                              <Text style={styles.textCard}>
                                                              
                                { _getTargetUnit() }
                               
                              </Text>
                              <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>({userData.weightUnit})</Text>
                            </View>
                          </View>

                          <View style={styles.boxCard}>
                          <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}>{t('weightLogScreen.difference')}</Text>
                            <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                              {diff(item)}
                            </View>
                          </View>

                        </View>
                        
                        <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_8, borderRadius: 5, elevation: 4}}>
                          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
             
                          <View>
                            <MaterialCommunityIcons name='clock-time-five' size={spacing.SCALE_14} color={colors.COLORS.DEEP_BLUE} />
                          </View>
                        
                          <View>
                            <Text style={{marginLeft: spacing.SCALE_3, fontSize: fontScale(typography.FONT_SIZE_11), color: colors.TEXT.DEEP_BLUE}}>{format(item.createdAt.toDate(), 'dd/MM/yyyy, HH:mm')}</Text>
                          </View>

                        </View>

                        <View style={{flexDirection: 'row', padding: spacing.SCALE_10, borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, borderTopWidth: 1, borderTopColor: colors.COLORS.LIGHT_GREY}}>
              
                            <View style={{flex: 1, flexDirection: 'row'}}>
                          
                              <View style={{justifyContent: 'center'}}>
                                <MaterialCommunityIcons name='scale-bathroom' size={ isTablet ? spacing.SCALE_15 : spacing.SCALE_24 } color={colors.COLORS.GREY_AAA} />
                              </View>
                            
                              <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_14)}}>{t('weightLogScreen.weight')}</Text>
                              </View>
                          
                            </View>
                              
                              <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                        
                        <View style={{marginRight: spacing.SCALE_5}}>
                            {
                                item.difference > 0 ? <MaterialCommunityIcons name='arrow-up-thin' size={spacing.SCALE_24} color={colors.COLORS.RED} /> : <MaterialCommunityIcons name='arrow-down-thin' size={spacing.SCALE_24} color={colors.COLORS.GREEN} />
                            }
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_16), fontWeight: 'bold'}}>
                              { userData.weightUnit === UNIT.KG && Number(item.currentWeight).toFixed(2) }
                              { userData.weightUnit === UNIT.LB && Number(item.currentWeightLB).toFixed(2) }
                            </Text>                          
                            {sing(item)}
                            
                        </View>
                        <View>
                        <Text style={{fontSize: 12, fontWeight: '400', color: colors.TEXT.DEEP_BLUE}}> {userData.weightUnit}</Text>
                        </View>
                     </View>


                              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                {textBMI(item)}
                              </View>

                          </View>

                         <Pressable style={{flexDirection: 'row', padding: spacing.SCALE_10}}
                          onPress={() => {setIsExpanded3(!isExpanded3);}}
                          >
                  
                          <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center'}}>
                              <MaterialCommunityIcons name='alpha-b-box-outline' size={isTablet ? spacing.SCALE_15 : spacing.SCALE_24} color={colors.COLORS.GREY_AAA} />
                            </View>
                            <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                              <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_14)}}>BMI</Text>
                            </View>
                          </View>

                          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_16), color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ (item.bmi).toFixed(1) }</Text>
                          </View>

                          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          
                            {textBMI(item)}
                          </View>
                        
                        </Pressable>
                    
                        <ExpandableView3 expanded={isExpanded3} />

                        { item.bai !== 0 &&
                          <>
                          <Pressable style={{flexDirection: 'row', padding: spacing.SCALE_10, borderTopWidth: 1, borderTopColor: colors.COLORS.LIGHT_GREY}} 
                          onPress={() => {setIsExpanded2(!isExpanded2);}}
                          >
                            
                            <View style={{flex: 1, flexDirection: 'row'}}>
                              <View style={{justifyContent: 'center'}}>
                                <SimpleLineIcons name='drop' size={isTablet ? spacing.SCALE_12 : spacing.SCALE_20} color={colors.COLORS.GREY_AAA} />
                              </View>
                              <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_16)}}>BAI</Text>
                              </View>
                            </View>

                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                              <Text style={{fontSize: fontScale(typography.FONT_SIZE_16), color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ (item.bai).toFixed(2) }<Text style={{fontSize: 12, fontWeight: '400'}}> %</Text></Text>
                            </View>

                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                {textBAI(item)}
                            </View>

                          </Pressable>
                          <ExpandableView2 expanded={isExpanded2} />
                          </>
                        }

                        <Pressable style={{flexDirection: 'row', padding: spacing.SCALE_10, borderTopWidth: 1, borderTopColor: colors.COLORS.LIGHT_GREY}}
                          onPress={() => {setIsExpanded(!isExpanded);}}
                        >
                    
                          <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center'}}>
                              <MaterialCommunityIcons name='human-child' size={isTablet ? spacing.SCALE_15 : spacing.SCALE_24} color={colors.COLORS.GREY_AAA} />
                            
                            </View>
                            <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                              <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_16)}}>LBM</Text>
                            </View>
                          </View>

                          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_16), color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>
                              { userData.weightUnit === UNIT.KG && Number(item.lbm).toFixed(2) }
                              { userData.weightUnit === UNIT.LB && Number(item.lbmLB).toFixed(2) }
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_12), fontWeight: '400'}}> {userData.weightUnit}</Text></Text>
                          </View>

                          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                          
                          </View>

                        </Pressable>
                        <ExpandableView expanded={isExpanded} />


                        </View>
                        </>
                      )}
                    />
                    ) : (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                     
                        <Text style={{fontSize: fontScale(typography.FONT_SIZE_18), color: colors.TEXT.DEEP_BLUE}}>{t('glucoseDiaryScreen.no-data')}</Text>
                    
                    </View>
                    )
           
            }
            </View>

      </ImageBackground>

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
            <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>{t('weightLogScreen.give-data')}</Text>
        </View>

          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('weightLogScreen.modal-current-weight') + ' [' + userData.weightUnit + ']'} 
                        value={currentWeightInput.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setCurrentWeightInput}
                        keyboardType="numeric"
                    />
                </View>
          </View>
          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('weightLogScreen.hip-circumference') + ' [' + userData.growthUnit + ']'}
                        value={hipGirth.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setHipGirth}
                        keyboardType="numeric"
                        placeholder=""
                    />
                </View>
          </View>

          <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
        <Pressable onPress={() => {_handleAdd(); toggleLoading(true)}} style={styles.btnModal} disabled={!emptyBtn}>

        <View style={{flexDirection: 'row'}}>
          <View style={{marginRight: spacing.SCALE_10}}>
             { isLoading && <ActivityIndicator size="small" color={colors.TEXT.WHITE} /> }
          </View>
          <View>
             <Text style={styles.textBtn}>{t('weightLogScreen.modal-save')}</Text>
          </View>
        </View>
          
        </Pressable>

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
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default WeightLogScreen;

const styles = StyleSheet.create({
    rootContainer: {
      marginHorizontal: spacing.SCALE_6,
      flex: 1,
    },
    modalRoot: {
        flex: 1,
        marginHorizontal: spacing.SCALE_6,
    },
    fabStyle: {
        bottom: spacing.SCALE_16,
        right: spacing.SCALE_16,
        position: 'absolute',
      },
      btnModal: {
        borderWidth: 0,
        padding: spacing.SCALE_10,
        width: Dimensions.get('window').width-12,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: colors.COLORS.DEEP_BLUE,
        elevation: 3,
        marginBottom: spacing.SCALE_10,
        
      },
      
      textBtn: {
        color: colors.COLORS.WHITE
      },
      boxCard: {
        backgroundColor: colors.COLORS.WHITE,
        padding: spacing.SCALE_10,
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 5
      },
      textCard: {
        fontSize: fontScale(typography.FONT_SIZE_24),
        color: colors.TEXT.DEEP_BLUE,
        fontWeight: 'bold'
      }, 
      textA: {
        fontSize: fontScale(typography.FONT_SIZE_14),
      },
      boxRoot: {
        paddingHorizontal: spacing.SCALE_10, 
        paddingVertical: spacing.SCALE_3, 
        borderRadius: 10
      },
      emptyData: {
        backgroundColor: colors.COLORS.WHITE,
        padding: spacing.SCALE_10,
        marginTop: spacing.SCALE_6,
        padding: spacing.SCALE_10,
        borderRadius: 5
      },
      emptyText: {
        fontSize: fontScale(typography.FONT_SIZE_12),
        color: colors.TEXT.DEEP_BLUE,
      }

})