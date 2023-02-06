import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, Animated, Alert, ToastAndroid } from 'react-native'
import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';

const WeightDetailScreen = ({ route, navigation }) => {
  
    const {t, i18n} = useTranslation();
    
    const _goBack = () => navigation.navigate('HistoryWeightScreen');
    const item = route.params.itemId;

    const {user} = useContext(AuthContext); 
    const [userData, setUserData] = useState('');
    const [dataWeight, setDataWeight] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateWag, setDateWag] = useState(new Date());
    const [age, setAge] = useState(0);
    const [weight, setWeight] = useState(0);
    const [weightLB, setWeightLB] = useState(0);
    const [targetWeight, setTargetWeight] = useState(0);
    const [lastId, setLastId] = useState([]);
    const [difference, setDifference] = useState(0);
    const [differenceLB, setDifferenceLB] = useState(0);

    useEffect(() => {
      getUser();
      getWeight();
      lastIdWeight();
      navigation.addListener("focus", () => setLoading(!loading));
    }, [navigation, loading]);

    const getUser = async () => {
      const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('profile')
      .doc('profil')
      .get()
      .then(( doc ) => {
        if( doc.exists ) {
          setUserData(doc.data());
          const dateB = new Date(doc.data().birthday.seconds * 1000);
          setAge(new Date().getFullYear() - dateB.getFullYear());
          setWeight(doc.data().weightName);
          setWeightLB(doc.data().weightNameLB);
          //setSum(doc.data().weightName - doc.data().targetWeight);
          setTargetWeight(doc.data().targetWeight);
        }
      })
    }

    const lastIdWeight = () => {
      firestore().collection('users').doc(user.uid).collection('weightLog')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(
           querySnapshot => {
            const newData = [];
              querySnapshot.forEach(doc => {
              //console.log('User data: ', doc.data());
               if( doc.exists ) {
                //lastId.push({...doc.data(), id: doc.id}); 
                setDifference(doc.data().difference);
                setDifferenceLB(doc.data().differenceLB);
                setLastId(doc.id);
               }
               
               
              });
                
              },
                error => {
                 console.log(error)
              }
          
        )
    }

    //console.log(difference)
 
    const getWeight = () => {
       firestore()
      .collection('users')
      .doc(user.uid)
      .collection('weightLog')
      .doc(item)
      .get()
      .then(doc => {
        //console.log('User exists: ', doc.exists);

        if (doc.exists) {
          //console.log('Data: ', doc.data());
          setDataWeight(doc.data());
        }
      });
    };
  
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
                <Text style={styles.textTitle}>{t('value.1st')}</Text>
            </View>
           );
      } else if ((wagBmi >= 35.00) && (wagBmi <= 39.99)){
          return( 
            <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                <Text style={styles.textTitle}>{t('value.2st')}</Text>
            </View>
           );
      }else {
          return( 
            <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                <Text style={styles.textTitle}>{t('value.3st')}</Text>
            </View>
           );
      }
    }
    
    const textBAI = (wagBai) => { 
        
      if(userData.gender === 2){

        if(age < 20){
          return(
            <Text>{t('value.low-age')}</Text>
          )
        }
        if((age >= 20) && (age <= 39)){
          if(wagBai < 8){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: colors.BAI.BAI_1}]}>
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

        if((age >= 40) && (age <= 59)){
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

        if((age >= 60) && (age <= 79)){
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
      
      if(age < 20){
        return(
          <Text>{t('value.low-age')}</Text>
        )
      }
      if((age >= 20) && (age <= 39)){
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

      if((age >= 40) && (age <= 59)){
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

      if((age >= 60) && (age <= 79)){
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
          <View>
            <Text>{t('value.too-age')}</Text>
          </View>
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
          style={{ height , backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
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

    const _alertHandler = () => {
      Alert.alert(
        //title
        '',
        //body
        t('weightDetalScreen.alert.delete-one'),
        [
          { text: t('weightDetalScreen.alert.yes'), onPress: () => _handleDelete() },
          {
            text: t('weightDetalScreen.alert.no'),
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    }

    const _handleDelete = async () => {
        let weightKG = 0;
        let weightLB2 = 0;
      if(userData.widthUnit === UNIT.KG){
        weightKG = parseFloat(weight - difference);
        weightLB2 = parseFloat(weightLB - differenceLB);
      }else{
        weightKG = parseFloat(weight - difference);
        weightLB2 = parseFloat(weightLB - differenceLB);
      }

      await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('weightLog')
      .doc(item)
      .delete();

      await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('profile')
      .doc('profil')
      .update({
        weightName: parseFloat(weightKG.toFixed(2)),
        weightNameLB: parseFloat(weightLB2.toFixed(2)),
    })
      .then(() => {
         ToastAndroid.show(t('weightDetalScreen.toast.delete-text'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
         navigation.navigate('HistoryWeightScreen');
      })

     
 }
  
 const imageBG = require('../../assets/images/waga1.jpg');

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('weightDetalScreen.title')} />
       { item === lastId ?
        <Appbar.Action icon="trash-can" onPress={_alertHandler} /> : ''
       }
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
        opacity: 0.5
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
      <SafeAreaProvider style={styles.rootContainer}>
     
       <View style={styles.box}>
         { dataWeight &&
          <View style={{}}>

            
            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
             
             <View>
               <MaterialCommunityIcons name='clock-time-five' size={spacing.SCALE_14} color={colors.COLORS.DEEP_BLUE} />
             </View>
             <View>
               <Text style={{marginLeft: spacing.SCALE_3, fontSize: typography.FONT_SIZE_11, color: colors.TEXT.DEEP_BLUE}}>{format(dataWeight.createdAt.toDate(), 'dd/MM/yyyy, HH:mm')}</Text>
               
             </View>

           </View>

           
          
              
            <View style={{flexDirection: 'row', padding: spacing.SCALE_10, borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, borderTopWidth: 1, borderTopColor: colors.COLORS.LIGHT_GREY}}>
              
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{justifyContent: 'center'}}>
                  <MaterialCommunityIcons name='scale-bathroom' size={spacing.SCALE_24} color={colors.COLORS.GREY_AAA} />
                  
                </View>
                <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_14}}>{t('weightDetalScreen.text-1')}</Text>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>
                  {/* { (dataWeight.currentWeight).toFixed(2) } */}
                  { userData.weightUnit === UNIT.KG && Number(dataWeight.currentWeight).toFixed(2) }
                  { userData.weightUnit === UNIT.LB && Number(dataWeight.currentWeightLB).toFixed(2) }
                  <Text style={{fontSize: typography.FONT_SIZE_12, fontWeight: '400'}}>
                     {' '+ userData.weightUnit}</Text></Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                 
                  {textBMI(dataWeight.bmi)}
              </View>

            </View>

            <TouchableOpacity style={{flexDirection: 'row', padding: spacing.SCALE_10}}
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
                <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ (dataWeight.bmi).toFixed(1) }</Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                 
                 {textBMI(dataWeight.bmi)}
              </View>
              
            </TouchableOpacity>
            <ExpandableView3 expanded={isExpanded3} />
            
            { dataWeight.bai !== 0 &&
            <>
            <TouchableOpacity style={{flexDirection: 'row', padding: spacing.SCALE_10, borderTopWidth: 1, borderTopColor: colors.COLORS.LIGHT_GREY}} 
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
                <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ (dataWeight.bai).toFixed(2) }<Text style={{fontSize: typography.FONT_SIZE_12, fontWeight: '400'}}> %</Text></Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  
                  {textBAI(dataWeight.bai)}
              </View>

            </TouchableOpacity>
            <ExpandableView2 expanded={isExpanded2} />
            </>
           }

            <TouchableOpacity style={{flexDirection: 'row', padding: spacing.SCALE_10, borderTopWidth: 1, borderTopColor: colors.COLORS.LIGHT_GREY}}
              onPress={() => {setIsExpanded(!isExpanded);}}
            >
              
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{justifyContent: 'center'}}>
                  <MaterialCommunityIcons name='human-child' size={spacing.SCALE_24} color={colors.COLORS.GREY_AAA} />
                 
                </View>
                <View style={{marginLeft: spacing.SCALE_10, justifyContent: 'center'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16}}>LBM</Text>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>
                  {/* { dataWeight.lbm.toFixed(2) } */}
                  { userData.weightUnit === UNIT.KG && Number(dataWeight.lbm).toFixed(2) }
                  { userData.weightUnit === UNIT.LB && Number(dataWeight.lbmLB).toFixed(2) }
                  <Text style={{fontSize: typography.FONT_SIZE_12, fontWeight: '400'}}> 
                  {' ' + userData.weightUnit}
                  </Text></Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                 
                  
              </View>

            </TouchableOpacity>
            <ExpandableView expanded={isExpanded} />

           

          </View> 
        }
       </View>
      
      </SafeAreaProvider>
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default WeightDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginHorizontal: spacing.SCALE_6
  },
  box: {
    backgroundColor: colors.COLORS.WHITE,
    padding: spacing.SCALE_10,
    borderRadius: 5,
  },
  boxRoot: {
    paddingHorizontal: spacing.SCALE_10, 
    paddingVertical: spacing.SCALE_3, 
    borderRadius: 10
  },
})