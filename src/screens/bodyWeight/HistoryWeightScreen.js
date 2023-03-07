import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert, ImageBackground, Dimensions } from 'react-native'
import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import { format } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';

const HistoryWeightScreen = ({ navigation }) => {

    const {t, i18n} = useTranslation();

    const {user} = useContext(AuthContext); 
    const [userData, setUserData] = useState('');
    const [dataWeight, setDataWeight] = useState('');
    //const [initialItem, setInitialItem] = useState('');
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
      getUser();
      //getWeight();
      //navigation.addListener("focus", () => setLoading(!loading));
    }, []);


   

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
          }
        })
      };

      // const getWeight = () => {
      //   firestore().collection('users').doc(user.uid).collection('weightLog')
      //     .orderBy('createdAt', 'desc')
      //     //.limit(1)
      //     .onSnapshot(
      //        querySnapshot => {
      //         const dataWeight = [];
      //           querySnapshot.forEach(doc => {
      //           //console.log('User data: ', doc.data());
      //            if( doc.exists ) {
      //             dataWeight.push({...doc.data(), id: doc.id}); 
                  
      //            }
      //            setDataWeight(dataWeight);
      //           });
      //           },
      //             error => {
      //              console.log(error)
      //           }
            
      //     )
      // }

      const onResult = (querySnapshot) => {
        const dataWeight = [];
          querySnapshot.forEach(function(doc) {
            if( doc.exists ) {
              dataWeight.push({...doc.data(), id: doc.id});           
               }
          });
          setDataWeight(dataWeight);
      }

      const onError = () => {
        ToastAndroid.show(t('weightLogScreen.connection-problem'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }

      useEffect(() => {
      
        const unsubscribe = 
        firestore().collection('users').doc(user.uid).collection('weightLog')
          .orderBy('createdAt', 'desc')
          .onSnapshot(onResult, onError);
        return unsubscribe;
      }, []);
    
      

    const sing = (item) => {

        if(item.difference === 0){
            return (
                <Text>-</Text>
            )
        }
        else if(item.difference > 0 ){
            return (
                <Text style={{color: colors.TEXT.RED, fontSize: typography.FONT_SIZE_13}}>+{ (item.difference).toFixed(2)}</Text>
            )
        }else{
            return (
                <Text style={{color: colors.TEXT.GREEN, fontSize: typography.FONT_SIZE_13}}>{ (item.difference).toFixed(2)}</Text>
            )
        }

    }
    

    
      const textBMI = (item) => {
        const wagBmi = item.bmi;

        const colorBMI = () => {
          const sumBMI = item.bmi;

           let color;
           if(sumBMI < 16.00){
             color = colors.BMI.BMI_1;
           } else if ((sumBMI >= 16.00) && (sumBMI <= 16.99)){
             color = colors.BMI.BMI_2;
           } else if ((sumBMI >= 17.00) && (sumBMI <= 18.49)){
               color = colors.BMI.BMI_3;
           } else if ((sumBMI >= 18.50) && (sumBMI <= 24.99)){
               color = colors.BMI.BMI_4;
           } else if ((sumBMI >= 25.00) && (sumBMI <= 29.99)){
               color = colors.BMI.BMI_5;
           } else if ((sumBMI >= 30.00) && (sumBMI <= 34.99)){
               color = colors.BMI.BMI_6;
           } else if ((sumBMI >= 35.00) && (sumBMI <= 39.99)){
               color = colors.BMI.BMI_7;
           }else {
             color = colors.BMI.BMI_8;
           }
           return color;
         }
        
        if(wagBmi < 16.00){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5}}>
                <Text style={styles.textA}>{t('value.starvation')}</Text>
              </View>
             );
        } else if ((wagBmi >= 16.00) && (wagBmi <= 16.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5}}>
                <Text style={styles.textA}>{t('value.emaciation')}</Text>
              </View>
             );
        } else if ((wagBmi >= 17.00) && (wagBmi <= 18.49)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5}}>
                <Text style={styles.textA}>{t('value.underweight')}</Text>
              </View>
             );
        } else if ((wagBmi >= 18.50) && (wagBmi <= 24.99)){
           return( 
            <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5}}>
                <Text style={styles.textA}>{t('value.normal')}</Text>
            </View>
           );
        } else if ((wagBmi >= 25.00) && (wagBmi <= 29.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5}}>
                <Text style={styles.textA}>{t('value.overweight')}</Text>
            </View>
             );
        } else if ((wagBmi >= 30.00) && (wagBmi <= 34.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 5}}>
                  <Text style={styles.textA}>{t('value.1st')}</Text>
              </View>
             );
        } else if ((wagBmi >= 35.00) && (wagBmi <= 39.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                  <Text style={styles.textA}>{t('value.2st')}</Text>
              </View>
             );
        }else {
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: spacing.SCALE_10, paddingVertical: spacing.SCALE_3, borderRadius: 10}}>
                  <Text style={styles.textA}>{t('value.3st')}</Text>
              </View>
             );
        }
      }

      async function _massDeleteWeightLog() {

        const weightQuerySnapshot = 
        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('weightLog')
        .get();
      
        // Create a new batch instance
        const batch = firestore().batch();
      
        weightQuerySnapshot.forEach(documentSnapshot => {
          batch.delete(documentSnapshot.ref);
        });
      
        return batch.commit();
      }

      const handeDeleteAll = () => {
        _massDeleteWeightLog().then(() => console.log('Usunięto wszystkie pomiary wagi.'));
      }
      
    
  
    const _goBack = () => navigation.navigate('WeightLogScreen');

    const alertHandler = () => {
      //function to make two option alert
      Alert.alert(
        //title
        t('historyWeightScreen.alert.text-1'),
        //body
        t('historyWeightScreen.alert.text-2'),
        [
          { text: t('historyWeightScreen.alert.yes'), onPress: () => handeDeleteAll() },
          {
            text: t('historyWeightScreen.alert.no'),
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    };

    const imageBG = require('../../assets/images/waga1.jpg');

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('historyWeightScreen.title')} />
       <Appbar.Action icon="trash-can" onPress={alertHandler} />
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
    <View style={styles.rootContainer}>
        <View style={styles.boxContainer}>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.textTitle}>{t('historyWeightScreen.time')}</Text>
            </View>

            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.textTitle}>{t('historyWeightScreen.height')} ({userData.weightUnit})</Text>
            </View>

            <View style={{flex: 1, alignItems: 'center', marginRight: spacing.SCALE_22}}>
                <Text style={styles.textTitle}>BMI</Text>
            </View>
        </View>

        <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderBottomEndRadius: spacing.SCALE_5, borderBottomStartRadius: spacing.SCALE_5}}>
        { 
          dataWeight.length > 0 ?
          (
        <BigList
              data={dataWeight}
              onEndReachedThreshold={1}
              itemHeight={50}
              renderItem={({item}) => (
                <TouchableOpacity 
                onPress={() => {
                    navigation.navigate('WeightDetailScreen', {
                      itemId: item.id
                    });
                }}
                >
                 
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, paddingBottom: spacing.SCALE_6, marginTop: spacing.SCALE_6}}>
                  
                  <View style={{flex: 1, alignItems: 'flex-start', marginLeft: spacing.SCALE_10}}>
                        <Text style={{fontSize: typography.FONT_SIZE_12}}>{format(item.createdAt.toDate(), 'yyyy/MM/dd')}</Text>
                        <Text style={{fontSize: typography.FONT_SIZE_10}}>{format(item.createdAt.toDate(), 'HH:mm')}</Text>
                     </View>

                     <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                        
                        <View style={{marginRight: spacing.SCALE_5}}>
                            {
                                item.difference > 0 ? <MaterialCommunityIcons name='arrow-up-thin' size={spacing.SCALE_24} color={colors.COLORS.RED} /> : <MaterialCommunityIcons name='arrow-down-thin' size={spacing.SCALE_24} color={colors.COLORS.GREEN} />
                            }
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, fontWeight: 'bold'}}>
                              {/* {Number(item.currentWeight).toFixed(2)} */}
                              { userData.weightUnit === UNIT.KG && Number(item.currentWeight).toFixed(2) }
                              { userData.weightUnit === UNIT.LB && Number(item.currentWeightLB).toFixed(2) }
                            </Text>                          
                            {sing(item)}
                        </View>
                     </View>

                     <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, fontWeight: 'bold'}}>{(item.bmi).toFixed(1)}</Text>
                        {textBMI(item)}
                     </View>

                     <View style={{marginRight: spacing.SCALE_10}}>
                        <MaterialIcons name='keyboard-arrow-right' size={spacing.SCALE_22} color={colors.COLORS.GREY_AAA} />
                     </View>
                  </View>
            
                </TouchableOpacity>
              )}
            />
            ) : (
                // <ActivityIndicator size="large" color={colors.COLORS.DEEP_BLUE} />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{t('historyWeightScreen.empty-data')}</Text>
                </View>
              )
            }

        </View>
        </View>
    </ImageBackground>
    </ImageBackground>
    
    </SafeAreaProvider>
  )
}

export default HistoryWeightScreen;

const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      marginHorizontal: 6,
      marginBottom: 6,
      borderRadius: spacing.SCALE_5
    },
    boxContainer: {
        backgroundColor: colors.COLORS.LIGHT_GREY,
        flexDirection: 'row',
        paddingHorizontal: spacing.SCALE_10,
        paddingVertical: spacing.SCALE_10,
        borderTopStartRadius: spacing.SCALE_5,
        borderTopEndRadius: spacing.SCALE_5
    },
    textTitle: {
        color: colors.TEXT.DEEP_BLUE,
        fontWeight: 'bold', 
        fontSize: typography.FONT_SIZE_14
    },
    textA: {
        fontSize: typography.FONT_SIZE_10,
      },
})