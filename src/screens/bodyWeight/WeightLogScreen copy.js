import { StyleSheet, Text, View, Animated, ImageBackground, StatusBar, Dimensions, ToastAndroid, Image, ActivityIndicator, Pressable } from 'react-native'
import React, {useState, useEffect, useContext, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedFAB, DefaultTheme, Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import RBSheet from "react-native-raw-bottom-sheet";
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
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

    //---------------------------------------------------------------------------------
    const {user} = useContext(AuthContext);
    //const [userData, setUserData] = useState('');
    const [userAge, setUserAge] = useState(0);   //Wiek
    const [userWeight, setUserWeight] = useState(0); //waga
    const [userHeigth, setUserHeight] = useState(0); //wzrost
    const [userTargetWeight, setUserTargetWeight] = useState(0); //waga docelowa
    const [userTarget, setUserTarget] = useState(0); //roznica
    const [userGender, setUserGender] = useState(0); 
    //---------------------------------------------------------------------------------
    
    const refRBSheet = useRef();
    const [isOpen, setIsOpen] = useState(true);
    const heightModal = (Dimensions.get('window').height/2);

    // const [dateForm, setDateForm] = useState(new Date());
    // const [timeForm, setTimeForm] = useState(new Date());
    // const [open1, setOpen1] = useState(false);
    // const [open2, setOpen2] = useState(false);
    // const [loading, setLoading] = useState(true);
    //---------------------------------------------------------------------------------
    const [currentWeight, setCurrentWeight] = useState(0); //aktualna waga TextInput
    const [hipGirth, setHipGirth] = useState(0); //Obwód bioder TextInput
    //---------------------------------------------------------------------------------
 
    const [dataWeight, setDataWeight] = useState([]);
    const [weightWag, setWeightWag] = useState(0); //waga z dziennika
    const [subWeight, setSubWeight] = useState(0); //roznica z dziennika
    const [targetWeight, setTargetWeight] = useState(0);

    //---------------------------------------------------------------------------------
    const [wagBmi, setWagBmi] = useState(0);
    const [wagDate, setWagDate] = useState(new Date());
    const [wagBai, setWagBai] = useState(0);
    const [wagLBM, setWagLBM] = useState(0);

    const [isLoading, setIsLoading] = useState(false); //button
    const toggleLoading = () => {
      setIsLoading(!isLoading);
    };

    //console.log(RNLocalize.getTimeZone());

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
           setUserWeight(doc.data().weightName);
           setUserHeight(doc.data().heightName);
           //setSum(doc.data().weightName - doc.data().targetWeight);
           setUserTargetWeight(doc.data().targetWeight);
           setUserTarget(doc.data().weightName - doc.data().targetWeight);
           setUserGender(doc.data().gender);

         }
       })
     };

     useEffect(() => {
      
     getUser();
      //getWeight();
      //const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
      //return unsubscribe;
    }, []);


    const _handleAdd = async () => {
      
     
      const bai = hipGirth / Math.pow((userHeigth/100), 1.5)-18;

      await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('profile')
      .doc('profil')
      .update({
        weightName: parseFloat(currentWeight),
      });

     await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('weightLog')
      .add({
        //createdAt: getDataTime(),
        createdAt: firestore.Timestamp.fromDate(new Date()),
        bmi: getBMI(),
        currentWeight: parseFloat(currentWeight),
        lbm: getLMB(),
        targetWeight: parseFloat(userTargetWeight),
        weightDifference: parseFloat(subWeight),
        bai: hipGirth ? bai : 0,
        difference: dataWeight.length === 0 ? 0 : getDifference()
      })
      .then(() => {
        console.log('Added');
        refRBSheet.current.close();
        setIsLoading(false);  
        ToastAndroid.show(t('weightLogScreen.measurement-added'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
        
      })
      
      
    }

    //  const getWeight =  () => {
    //   firestore().collection('users').doc(user.uid).collection('weightLog')
    //     .orderBy('createdAt', 'desc')
    //     .limit(1)
    //     .onSnapshot(
    //        querySnapshot => {
    //         const dataWeight = [];
    //           querySnapshot.forEach(doc => {
    //           //console.log('User data: ', doc.data());
    //            if( doc.exists ) {
    //             dataWeight.push({...doc.data(), id: doc.id}); 
    //             setWeightWag(doc.data().currentWeight);
    //             setSubWeight(doc.data().targetWeight - doc.data().currentWeight)
    //             setTargetWeight(doc.data().targetWeight);
    //             setWagDate(doc.data().createdAt);
    //             setWagBmi(doc.data().bmi);
    //             setWagLBM(doc.data().lbm);
    //             setWagBai(doc.data().bai);
    //             setDataWeight(dataWeight);  
    //            }
                              
    //           })
                
    //           },
    //             error => {
    //              console.log(error)
    //            }
          
    //     )
    // }

    // function onResult(querySnapshot) {
    //   const dataWeight = [];
    //   querySnapshot.forEach(function(doc) {
    //    dataWeight.push({...doc.data(), id: doc.id}); 
    //    setWeightWag(doc.data().currentWeight);
    //    setSubWeight(doc.data().targetWeight - doc.data().currentWeight)
    //    setTargetWeight(doc.data().targetWeight);
    //    setWagDate(doc.data().createdAt);
    //    setWagBmi(doc.data().bmi);
    //    setWagLBM(doc.data().lbm);
    //    setWagBai(doc.data().bai);
    //    setDataWeight(dataWeight);
    //   });
    //   setDataWeight(dataWeight);  
    // }

    const onResult = async (querySnapshot) => {
      try {
        const dataWeight = [];
         await querySnapshot.forEach(function(doc) {
          dataWeight.push({...doc.data(), id: doc.id}); 
          setWeightWag(doc.data().currentWeight);
          setSubWeight(doc.data().targetWeight - doc.data().currentWeight)
          setTargetWeight(doc.data().targetWeight);
          setWagDate(doc.data().createdAt);
          setWagBmi(doc.data().bmi);
          setWagLBM(doc.data().lbm);
          setWagBai(doc.data().bai);
          setDataWeight(dataWeight);
          });
          setDataWeight(dataWeight);  
          
      } catch (error) {
        ToastAndroid.show(t('weightLogScreen.connection-problem'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
        console.log(error);
      }
     
}
    const onError = () => {
      ToastAndroid.show(t('weightLogScreen.connection-problem'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }

    useEffect(() => {
      // function onResult(querySnapshot) {
      //   const dataWeight = [];
      //       querySnapshot.forEach(function(doc) {
      //       dataWeight.push({...doc.data(), id: doc.id}); 
      //       setWeightWag(doc.data().currentWeight);
      //       setSubWeight(doc.data().targetWeight - doc.data().currentWeight)
      //       setTargetWeight(doc.data().targetWeight);
      //       setWagDate(doc.data().createdAt);
      //       setWagBmi(doc.data().bmi);
      //       setWagLBM(doc.data().lbm);
      //       setWagBai(doc.data().bai);
      //       setDataWeight(dataWeight);
      //       });
      //       setDataWeight(dataWeight);  
      //       }
     
            // function onError(error) {
            //    console.log(error);
            // }
    
      const unsubscribe = 
     firestore().collection('users').doc(user.uid).collection('weightLog')
         .orderBy('createdAt', 'desc')
         .limit(1)
         .onSnapshot(onResult, onError);
      return unsubscribe;
    }, []);

    

    

    // const getDataTime = () => {
    //    //Data i czas 2022-12-12T20:16:03.151Z
    //    const dates = moment(dateForm).format("YYYY-MM-DD");
    //    const times = moment(timeForm).format("HH:mm");
    //    // const dateTime = dates + 'T' + times + ':00';
    //    const dateTime = new Date(dates + 'T' + times + ':00Z');
    //    return dateTime;
    // }

    const getBMI = () => {

      const bmi = parseFloat(currentWeight) / ((parseFloat(userHeigth) * parseFloat(userHeigth)) / 10000);
      return bmi;
      
    }

    const getLMB = () => {
      //LMB
        //LBM (kobiety) = 1,07 x całkowita masa ciała (kg) - 148 [całkowita masa ciała/ wzrost (cm)]2
        //LBM (mężczyźni) = 1,1 x całkowita masa ciała (kg) -128 [całkowita masa ciała/ wzrost (cm)]2 
        let lbm = 0;
        let kwadrat = 0;

        if(userGender === 1){
          kwadrat = (currentWeight / userHeigth) * (currentWeight / userHeigth);
          lbm = 1.07 * parseFloat(currentWeight) - 148 * ( parseFloat(currentWeight) / (parseFloat(userHeigth) * parseFloat(userHeigth) ));
          return lbm;
        }else{
          kwadrat = (currentWeight / userHeigth) * (currentWeight / userHeigth);
          lbm = 1.1 * parseFloat(currentWeight) - 128 * kwadrat;
          return lbm;
        }
    }

    
    const getDifference = () => {
       //Różnica waga aktualna - waga docelowa 
       const weightDifference = parseFloat(currentWeight) - parseFloat(userWeight);
       return weightDifference;
    }

    //console.log(weightWag - targetWeight)
    
    const diff = () => {
      if(dataWeight.length === 0) {
        return (
          <View style={{alignItems: 'center'}}>
            <Text style={[styles.textCard,{color: colors.TEXT.RED}]}>+{(userTarget).toFixed(2)}</Text>
            <Text style={{fontSize: typography.FONT_SIZE_10}}>(kg)</Text>
          </View>
        );
      } else {
        if(weightWag - targetWeight > 0){
          return (
                  <View style={{alignItems: 'center'}}>
                    <Text style={[styles.textCard,{color: colors.TEXT.RED}]}>+{(weightWag - targetWeight).toFixed(2)}</Text>
                    <Text style={{fontSize: typography.FONT_SIZE_10}}>(kg)</Text>
                  </View>
          );
        }else{
          return (
                  
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.COLORS.DEEP_BLUE, fontWeight: 'bold'}}>{t('weightLogScreen.set')}</Text>
                    
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.COLORS.DEEP_BLUE, fontWeight: 'bold'}}>{t('weightLogScreen.objective')}</Text>
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

        
      const colorBMI = (wagBmi) => {
        let color;
        if(wagBmi < 16.00){
          color = colors.BMI.BMI_1;
        } else if ((wagBmi >= 16.00) && (wagBmi <= 16.99)){
          color = colors.BMI.BMI_2;
        } else if ((wagBmi >= 17.00) && (wagBmi <= 18.49)){
            color = colors.BMI.BMI_3;
        } else if ((wagBmi >= 18.50) && (wagBmi <= 24.99)){
            color = colors.BMI.BMI_4;
        } else if ((wagBmi >= 25.00) && (wagBmi <= 29.99)){
            color = colors.BMI.BMI_5;
        } else if ((wagBmi >= 30.00) && (wagBmi <= 34.99)){
            color = colors.BMI.BMI_6;
        } else if ((wagBmi >= 35.00) && (wagBmi <= 39.99)){
            color = colors.BMI.BMI_7;
        }else {
          color = colors.BMI.BMI_8;
        }
        return color;
      }

      const textBMI = (wagBmi) => {
        if(wagBmi < 16.00){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                <Text style={styles.textTitle}>{t('value.starvation')}</Text>
              </View>
             );
        } else if ((wagBmi >= 16.00) && (wagBmi <= 16.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                <Text style={styles.textTitle}>{t('value.emaciation')}</Text>
              </View>
             );
        } else if ((wagBmi >= 17.00) && (wagBmi <= 18.49)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                <Text style={styles.textTitle}>{t('value.underweight')}</Text>
              </View>
             );
        } else if ((wagBmi >= 18.50) && (wagBmi <= 24.99)){
           return( 
            <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                <Text style={styles.textA}>{t('value.normal')}</Text>
            </View>
           );
        } else if ((wagBmi >= 25.00) && (wagBmi <= 29.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                <Text style={styles.textTitle}>{t('value.overweight')}</Text>
            </View>
             );
        } else if ((wagBmi >= 30.00) && (wagBmi <= 34.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                  <Text style={styles.textTitle}>{t('"value.1st')}</Text>
              </View>
             );
        } else if ((wagBmi >= 35.00) && (wagBmi <= 39.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                  <Text style={styles.textTitle}>{t('"value.2st')}</Text>
              </View>
             );
        }else {
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                  <Text style={styles.textTitle}>{t('"value.3st')}</Text>
              </View>
             );
        }
      }
      
      const textBAI = (wagBai) => { 
          
        if(userGender === 2){

          if(userAge < 20){
            return(
              <Text>{t('value.low-age')}</Text>
            )
          }
          if((userAge >= 20) && (userAge <= 39)){
            if(wagBai < 8){
              return (
                <View style={[styles.boxRoot, {backgroundColor: colors.BAI.BAI_1}]}>
                  <Text>{t('value.underweight')}</Text>
                </View>
              )
            }
            if((wagBai >= 8) && (wagBai <= 21)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                  <Text>{t('value.normal')}</Text>
                </View>
              )
            }
            if((wagBai >= 21) && (wagBai <= 26)){
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
              if(wagBai < 11){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
                    <Text>{t('value.underweight')}</Text>
                  </View>
                )
              }
              if((wagBai >= 11) && (wagBai <= 23)){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                    <Text>{t('value.normal')}</Text>
                  </View>
                )
              }
              if((wagBai >= 23) && (wagBai <= 29)){
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
              if(wagBai < 13){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
                    <Text>{t('value.underweight')}</Text>
                  </View>
                )
              }
              if((wagBai >= 13) && (wagBai <= 25)){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                    <Text>{t('value.normal')}</Text>
                  </View>
                )
              }
              if((wagBai >= 25) && (wagBai <= 31)){
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
          if(wagBai < 21){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
                <Text>{t('value.underweight')}</Text>
              </View>
            )
          }
          if((wagBai >= 21) && (wagBai <= 33)){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                <Text>{t('value.normal')}</Text>
              </View>
            )
          }
          if((wagBai >= 33) && (wagBai <= 39)){
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
            if(wagBai < 23){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
                  <Text>{t('value.underweight')}</Text>
                </View>
              )
            }
            if((wagBai >= 23) && (wagBai <= 35)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                  <Text>{t('value.normal')}</Text>
                </View>
              )
            }
            if((wagBai >= 35) && (wagBai <= 41)){
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
            if(wagBai < 25){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
                  <Text>{t('value.underweight')}</Text>
                </View>
              )
            }
            if((wagBai >= 25) && (wagBai <= 38)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_2}]}>
                  <Text>{t('value.normal')}</Text>
                </View>
              )
            }
            if((wagBai >= 38) && (wagBai <= 43)){
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
            <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}>
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
            <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}>
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
      
        // console.log('rerendered');
      
        return (
          <Animated.View
            style={{ height , backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
          >
            <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}>
              {t('weightLogScreen.text-bmi')}
            </Text>
          </Animated.View>
        );
      };

      const emptyBtn = (currentWeight != null && currentWeight != '' && currentWeight != 0);
     
  
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Dziennik wagi" />
       {/* <Appbar.Action icon="history" onPress={() => navigation.navigate('HistoryWeightScreen')} /> */}
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={require('../../assets/images/bg5.jpg')}
    blurRadius={5}
    resizeMode="stretch"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.8,
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
          <ScrollView style={{marginBottom: spacing.SCALE_6}}>
            <View style={{flexDirection: 'row'}}>

              <View style={[styles.boxCard,{marginRight: spacing.SCALE_6}]}>
                <Text style={{fontSize: typography.FONT_SIZE_10}}>{t('weightLogScreen.current-weight')}</Text>
                  <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                    <Text style={styles.textCard}>{ dataWeight.length === 0 ? userWeight : weightWag }</Text>
                    <Text style={{fontSize: 10}}>(kg)</Text>
                </View>
              </View>

            <View style={[styles.boxCard,{marginRight: spacing.SCALE_6}]}>
              <Text style={{fontSize: typography.FONT_SIZE_10}}>{t('weightLogScreen.target-weight')}</Text>
                <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                  {/* <Text style={styles.textCard}>{dataWeight.length === 0 ? userTargetWeight : targetWeight}</Text> */}
                  <Text style={styles.textCard}>{userTargetWeight}</Text>
                  <Text style={{fontSize: typography.FONT_SIZE_10}}>(kg)</Text>
                </View>
            </View>

            <View style={styles.boxCard}>
              <Text style={{fontSize: typography.FONT_SIZE_10}}>{t('weightLogScreen.difference')}</Text>
                <View style={{marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                  {diff()}
                </View>
              </View>
    
          </View>
          

          { dataWeight.length === 1 &&
               <View style={{marginTop: spacing.SCALE_6, backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderRadius: 5, elevation: 5}}>
                  <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
             
                    <View>
                      <MaterialCommunityIcons name='clock-time-five' size={spacing.SCALE_14} color={colors.COLORS.DEEP_BLUE} />
                    </View>
                  
                    <View>
                      <Text style={{marginLeft: spacing.SCALE_3, fontSize: typography.FONT_SIZE_11, color: colors.TEXT.DEEP_BLUE}}>{format(wagDate.toDate(), 'dd/MM/yyyy, HH:mm')}</Text>
                    </View>

                  </View>

                <View style={{flexDirection: 'row', padding: spacing.SCALE_10, borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, borderTopWidth: 1, borderTopColor: colors.COLORS.LIGHT_GREY}}>
              
                  <View style={{flex: 1, flexDirection: 'row'}}>
                
                    <View style={{justifyContent: 'center'}}>
                      <MaterialCommunityIcons name='scale-bathroom' size={spacing.SCALE_24} color={colors.COLORS.GREY_AAA} />
                    </View>
                  
                    <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                      <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_14}}>{t('weightLogScreen.weight')}</Text>
                    </View>
                
                  </View>

                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ weightWag }<Text style={{fontSize: 12, fontWeight: '400'}}> kg</Text></Text>
                    </View>

                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                      {textBMI(wagBmi)}
                    </View>

                </View>

                <Pressable style={{flexDirection: 'row', padding: spacing.SCALE_10, borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY}}
                  onPress={() => {setIsExpanded3(!isExpanded3);}}
                >
              
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center'}}>
                      <MaterialCommunityIcons name='alpha-b-box-outline' size={spacing.SCALE_24} color={colors.COLORS.GREY_AAA} />
                    </View>
                    <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                      <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_14}}>BMI</Text>
                    </View>
                  </View>

                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ wagBmi.toFixed(1) }</Text>
                  </View>

                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  
                    {textBMI(wagBmi)}
                  </View>
                  
                </Pressable>
                
                <ExpandableView3 expanded={isExpanded3} />

                { wagBai !== 0 &&
                  <>
                  <Pressable style={{flexDirection: 'row', padding: spacing.SCALE_10}} 
                  onPress={() => {setIsExpanded2(!isExpanded2);}}
                  >
                    
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={{justifyContent: 'center'}}>
                        <SimpleLineIcons name='drop' size={spacing.SCALE_20} color={colors.COLORS.GREY_AAA} />
                      </View>
                      <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                        <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16}}>BAI</Text>
                      </View>
                    </View>

                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ (wagBai).toFixed(2) }<Text style={{fontSize: 12, fontWeight: '400'}}> %</Text></Text>
                    </View>

                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        {textBAI(wagBai)}
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
                    <MaterialCommunityIcons name='human-child' size={spacing.SCALE_24} color={colors.COLORS.GREY_AAA} />
                    {/* <Image source={require('../assets/images/icons/fat-cell.png')} style={{width: 24, height: 24}} /> */}
                  </View>
                  <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                    <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16}}>LBM</Text>
                  </View>
                </View>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ wagLBM.toFixed(2) }<Text style={{fontSize: typography.FONT_SIZE_12, fontWeight: '400'}}> kg</Text></Text>
                </View>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                
              </View>

            </Pressable>
            <ExpandableView expanded={isExpanded} />



               </View>
          }

        </ScrollView>
      </View>    
    </ImageBackground>

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
        <View style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginBottom: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_8, borderRadius: 5}}>
            <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>{t('weightLogScreen.give-data')}</Text>
        </View>

          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('weightLogScreen.modal-current-weight') + ' [kg]'}
                        value={currentWeight}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setCurrentWeight}
                        keyboardType="numeric"
                    />
                </View>
          </View>
          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('weightLogScreen.hip-circumference') + ' [cm]'}
                        value={hipGirth}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setHipGirth}
                        keyboardType="numeric"
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
        fontSize: typography.FONT_SIZE_24,
        color: colors.TEXT.DEEP_BLUE,
        fontWeight: 'bold'
      }, 
      textA: {
        fontSize: typography.FONT_SIZE_14,
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
        fontSize: typography.FONT_SIZE_12,
        color: colors.TEXT.DEEP_BLUE,
      }

})