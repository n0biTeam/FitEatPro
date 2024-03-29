import React, {useState, useEffect, useContext, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ActivityIndicator, ToastAndroid, Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedFAB, DefaultTheme, Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import CircularProgress from 'react-native-circular-progress-indicator';
import RBSheet from "react-native-raw-bottom-sheet";
import { format } from 'date-fns';
import BigList from "react-native-big-list";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
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

const GlucoseDiaryScreen = ({ route,
    navigation,
    animatedValue,
    visible,
    extended,
    label,
    animateFrom,
    style,
    iconMode }) => {

    const [isExtended, setIsExtended] = useState(true);

    const isIOS = Platform.OS === 'ios';
      
    const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
        Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
     
        setIsExtended(currentScrollPosition <= 0);
    };
    
    const fabStyle = { [animateFrom]: 16 };

    const {t, i18n} = useTranslation();
    const refRBSheet = useRef();
    const [isOpen, setIsOpen] = useState(true);
    const heightModal = (Dimensions.get('window').height/2);

    //---------------------------------------------------------------------------------
    const {user} = useContext(AuthContext);
    const [getData, setGetData] = useState([]);
    const [glucose, setGlucose] = useState('');
    
    //---------------------------------------------------------------------------------
    const [getGlucoseMg, setGetGlucoseMg] = useState(0);
    const [getGlucoseMmol, setGetGlucoseMmol] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isLoading, setIsLoading] = useState(false); //button
    const toggleLoading = () => {
      setIsLoading(!isLoading);
    };

    const getGlucoseDiary = () => {
        firestore().collection('users').doc(user.uid).collection('glucoseDiary')
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

    const getLastGlucose = () => {
        firestore().collection('users').doc(user.uid).collection('glucoseDiary')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .onSnapshot(
             querySnapshot => {
                querySnapshot.forEach(doc => {
                 if( doc.exists ) {
                  setGetGlucoseMg(doc.data().glucoseMg);
                  setGetGlucoseMmol(doc.data().glucoseMmol);
                 }
                 
                });
                  
                },
                  error => {
                   console.log(error)
                }
            
        )
    }

    useEffect(() => {
      
        getGlucoseDiary();
        getLastGlucose();
 
        const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
        return unsubscribe;
      }, [navigation, loading]);

      
      const handleAdd = async () => {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('glucoseDiary')
          .add({
            createdAt: firestore.Timestamp.fromDate(new Date()),
            glucoseMg: parseInt(glucose),
            glucoseMmol: parseInt(glucose)/18,

          }).then(() => {
            console.log('Added');
            ToastAndroid.show(t('glucoseDiaryScreen.toast.measurement-added'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
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
    
      const getColor = () => {
        let color;
    
        if(emptyBtn === false){
          color = colors.COLORS.DEEP_BLUE;
        }else{
          color = colors.COLORS.WHITE;
        }
        return color;
      }

    const lastGlucose = () => {
      
        if((getGlucoseMg >= 70) && (getGlucoseMg <= 99)){
          return(
            <View style={{backgroundColor: colors.GLUCOSE.G1, padding: spacing.SCALE_5, marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
              <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.value-normal')}</Text>
            </View>
          )
        } else if((getGlucoseMg >= 100) && (getGlucoseMg <= 125)){
          return(
            <View style={{backgroundColor: colors.GLUCOSE.G2, padding: spacing.SCALE_5, marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
              <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.pre-diabetes')}</Text>
            </View>
          )
        } else if(getGlucoseMg > 126){
            return(
              <View style={{backgroundColor: colors.GLUCOSE.G3, padding: spacing.SCALE_5, marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.diabetes')}</Text>
              </View>
            )
        }else{
          return(
              <View style={{backgroundColor: colors.GLUCOSE.G4, padding: spacing.SCALE_5, marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center', elevation: 4}}>
              <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.measurement-error')}</Text>
            </View>
          )
        }
      }

    const emoticon = (item) => {
      
        if((item.glucoseMg >= 70) && (item.glucoseMg <= 99)){
            return(
                    <MaterialCommunityIcons name='emoticon-happy' size={spacing.SCALE_20} color={colors.EMOTICON.E1} />
            )
        } else if((item.glucoseMg >= 100) && (item.glucoseMg <= 125)){
            return(
                    <MaterialCommunityIcons name='emoticon-neutral' size={spacing.SCALE_20} color={colors.EMOTICON.E2} />
            )
        } else if(item.glucoseMg > 126){
            return(
                <MaterialCommunityIcons name='emoticon-sad' size={spacing.SCALE_20} color={colors.EMOTICON.E3} />
            )
        } else {
            return(
                    <MaterialCommunityIcons name='emoticon-neutral' size={spacing.SCALE_20} color={colors.EMOTICON.E4} />
            )
        }
    }

    const emptyBtn = (glucose != null && glucose != ''); 
    
    const _goBack = () => navigation.navigate('HomeScreen');

    const handeDeleteAll = async () => {
      const weightQuerySnapshot = 
      await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('glucoseDiary')
      .get();
    
      // Create a new batch instance
      const batch = firestore().batch();
    
      weightQuerySnapshot.forEach(documentSnapshot => {
        batch.delete(documentSnapshot.ref);
      });
      navigation.navigate('GlucoseDiaryScreen');
      return batch.commit();
    }

    const alertHandler = () => {
      //function to make two option alert
      Alert.alert(
        //title
        '',
        //body
        t('glucoseDiaryScreen.alert.text'),
        [
          { text: t('glucoseDiaryScreen.alert.yes'), onPress: () => handeDeleteAll() },
          {
            text: t('glucoseDiaryScreen.alert.no'),
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    };

    const imageBG = require('../../assets/images/glukometr4.jpg');
  
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('glucoseDiaryScreen.glucose-diary')} />
       <Appbar.Action icon="trash-can" onPress={alertHandler} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={1}
    resizeMode="cover"
    style={{ 
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
           <Text style={styles.boxText}>{t('glucoseDiaryScreen.last-measurement')}</Text> 
        </View>
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
          <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderRadius: spacing.SCALE_5, marginRight: spacing.SCALE_3, padding: spacing.SCALE_10, alignItems: 'center'}}>
                <CircularProgress
                value={getGlucoseMg}
                radius={isTablet ? 70 : 40}
                maxValue={200}
                inActiveStrokeOpacity={0.8}
                activeStrokeWidth={ isTablet ? 15 : 10 }
                inActiveStrokeWidth={isTablet ? 15 : 10 }
                progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? fontScale(typography.FONT_SIZE_35) : fontScale(typography.FONT_SIZE_26), marginBottom: -spacing.SCALE_8 }}
                activeStrokeColor={colors.COLORS.DEEP_BLUE}
                inActiveStrokeColor={colors.COLORS.GREY_999}
                duration={2000}
                title={'mg/dL'}
                titleColor={colors.COLORS.DEEP_BLUE}
                titleStyle={{fontWeight: '300', fontSize: fontScale(typography.FONT_SIZE_14)}}
                dashedStrokeConfig={{
                  count: isTablet ? 40 : 30,
                  width: isTablet ? 10 : 8,
                }}
                 />
               
            </View>

            <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, marginLeft: spacing.SCALE_3, padding: spacing.SCALE_10, alignItems: 'center'}}>
              <CircularProgress
                  value={getGlucoseMmol}
                  radius={isTablet ? 70 : 40}
                  maxValue={50}
                  inActiveStrokeOpacity={0.8}
                  activeStrokeWidth={ isTablet ? 15 : 10 }
                inActiveStrokeWidth={isTablet ? 15 : 10 }
                  progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: isTablet ? fontScale(typography.FONT_SIZE_35) : fontScale(typography.FONT_SIZE_26), marginBottom: -spacing.SCALE_8 }}
                  activeStrokeColor={colors.COLORS.DEEP_BLUE}
                  inActiveStrokeColor={colors.COLORS.GREY_999}
                  duration={2000}
                  title={'mmol/L'}
                  titleColor={colors.COLORS.DEEP_BLUE}
                  titleStyle={{fontWeight: '300', fontSize: fontScale(typography.FONT_SIZE_14)}}
                  dashedStrokeConfig={{
                    count: isTablet ? 40 : 30,
                    width: isTablet ? 10 : 8,
                  }}
                  progressFormatter={(value, total) => {
                      'worklet';   
                      return value.toFixed(1);
                  }}
                  />
              </View>

            </View>

            
            
            { getData.length > 0 &&
                        lastGlucose()
            }
           
           
           <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, marginBottom: spacing.SCALE_6, borderRadius: 5}}>
            <View style={{alignItems: 'center', backgroundColor: colors.COLORS.DEEP_BLUE, borderTopRightRadius: 5, borderTopLeftRadius: 5, padding: spacing.SCALE_5}}>
              <Text style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.WHITE}}>{t('glucoseDiaryScreen.measurement-history')}</Text>
            </View>
          
          { 
          getData.length > 0 ?
          (
          <BigList
              data={getData}
              onEndReachedThreshold={1}
              itemHeight={ isTablet ? 70 : 50}
              renderItem={({item}) => (
              
                <TouchableOpacity onPress={() => 
                  navigation.navigate('GlucoseViewItemScreen', {itemId: item.id})
                }>
                <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, paddingBottom: spacing.SCALE_7, marginTop: spacing.SCALE_6}}>
                  
                  <View style={{flex: 1, alignItems: 'flex-start', marginLeft: spacing.SCALE_10, flex: 1}}>
                         <Text style={{fontSize: fontScale(typography.FONT_SIZE_11)}}>{format(item.createdAt.toDate(), 'yyyy/MM/dd')}</Text>
                         <Text style={{fontSize: fontScale(typography.FONT_SIZE_9)}}>{format(item.createdAt.toDate(), 'HH:mm')}</Text>
                  </View>

                  <View style={{flex: 1}}>
                    
                    <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <View style={{alignItems: 'center'}}>   
                                <Text style={{fontSize: fontScale(typography.FONT_SIZE_22), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{item.glucoseMg}</Text>
                        </View>

                        <View style={{justifyContent: 'center'}}>
                                <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}> mg/dL</Text>
                            </View>
                    </View>

                </View>

                <View style={{flex: 1, marginRight: spacing.SCALE_20}}>
                    
                    <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <View style={{alignItems: 'center'}}>   
                                <Text style={{fontSize: fontScale(typography.FONT_SIZE_22), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{(item.glucoseMmol).toFixed(1)}</Text>
                        </View>

                        <View style={{justifyContent: 'center'}}>
                                <Text style={{fontSize: fontScale(typography.FONT_SIZE_10)}}> mmol/L</Text>
                            </View>
                    </View>

                </View>

                <View style={{alignItems: 'flex-end'}}>
                    {emoticon(item)}
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
              <Text style={{fontSize: typography.FONT_SIZE_18, color: colors.TEXT.DEEP_BLUE}}>{t('glucoseDiaryScreen.no-data')}</Text>
            </View>
            )
            }

          </View>
          
        

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
            <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>{t('glucoseDiaryScreen.give-data')}</Text>
        </View>

      
          <View>
          <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.WHITE}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('glucoseDiaryScreen.glucose') + ' (mg/dL)'}
                        value={glucose.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setGlucose}
                        keyboardType="numeric"
                    />
                </View>
          </View>

          <View style={{flex: 1,alignItems: 'center', marginTop: spacing.SCALE_10}}>
                <TouchableOpacity onPress={() => {handleAdd(); toggleLoading(true)}} style={[styles.btnModal, {backgroundColor: getBackGroundColor()}]} disabled={!emptyBtn}>

                    <View style={{flexDirection: 'row'}}>
                    <View style={{marginRight: spacing.SCALE_10}}>
                        { isLoading && <ActivityIndicator size="small" color={colors.TEXT.WHITE} /> }
                    </View>
                    <View>
                        <Text style={{color: getColor()}}>{t('glucoseDiaryScreen.btn-save')}</Text>
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
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default GlucoseDiaryScreen;

const styles = StyleSheet.create({
    rootContainer: {
      marginHorizontal: spacing.SCALE_6,
      flex: 1
    },
    boxTitle: {
      backgroundColor: colors.COLORS.WHITE,
      padding: spacing.SCALE_5,
      borderRadius: 5,
      marginBottom: spacing.SCALE_6,    
    },
    boxText: {
      textTransform: 'uppercase',
      fontSize: fontScale(typography.FONT_SIZE_12),
      color: colors.TEXT.DEEP_BLUE
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
        backgroundColor: colors.COLORS.DEEP_BLUE,
        elevation: 3,
        marginBottom: spacing.SCALE_10,   
      },
      textBtn: {
        color: colors.TEXT.WHITE
      },

})