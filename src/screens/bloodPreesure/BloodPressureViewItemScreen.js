import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions, Alert, ToastAndroid } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment/moment';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const BloodPressureViewItemScreen = ({ route, navigation }) => {
  
  const _goBack = () => navigation.navigate('BloodPressureScreen');
  const ItemId = route.params.itemId;

  const {t, i18n} = useTranslation();
  const {user} = useContext(AuthContext); 
  const [loading, setLoading] = useState(true);
  const [dataItem, setDataItem] = useState('');

  const getPressure = () => {
    firestore()
   .collection('users')
   .doc(user.uid)
   .collection('bloodPressure')
   .doc(ItemId)
   .get()
   .then(doc => {
     //console.log('User exists: ', doc.exists);

     if (doc.exists) {
       //console.log('Data: ', doc.data());
       setDataItem(doc.data());
     }
   });
 };

useEffect(() => {
   getPressure();
   navigation.addListener("focus", () => setLoading(!loading));
}, [navigation, loading]);

const lastPressure = () => {
  
  let sbpt;
  let dbpt;
  
  if ( dataItem.systolic >= 180 ) { sbpt=4;  };
  if ( dataItem.systolic < 180 ) { sbpt=3; };
  if ( dataItem.systolic < 160 ) { sbpt=2;  };
  if ( dataItem.systolic < 140 ) { sbpt=1;  };
  if ( dataItem.systolic < 130 ) { sbpt=0;  };
  
  if ( dataItem.diastolic >= 110 ) { dbpt=4;  };
  if ( dataItem.diastolic < 110 ) { dbpt=3;  };
  if ( dataItem.diastolic < 100 ) { dbpt=2;  };
  if ( dataItem.diastolic < 90 ) { dbpt=1;  };
  if ( dataItem.diastolic < 85 ) { dbpt=0;  };
  

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

    // if((dataItem.systolic < 120) && (dataItem.diastolic < 80)){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P1, padding: spacing.SCALE_5, marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.WHITE}}>{t('bloodPressureScreen.optimal')}</Text>
    //     </View>
    //   )
    // } else if(((dataItem.systolic >= 120) && (dataItem.systolic <= 129)) || ((dataItem.diastolic >= 80) && (dataItem.diastolic <= 84))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P1, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.correct')}</Text>
    //     </View>
    //   )
    // } else if(((dataItem.systolic >= 130) && (dataItem.systolic <= 139)) || ((dataItem.diastolic >= 85) && (dataItem.diastolic <= 89))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P2, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.high-correct')}</Text>
    //     </View>
    //     )
    // } else if(((dataItem.systolic >= 140) && (dataItem.systolic <= 159)) || ((dataItem.diastolic >= 90) && (dataItem.diastolic <= 99))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-1st')}</Text>
    //     </View>
    //   )
    // } else if(((dataItem.systolic >= 160) && (dataItem.systolic <= 179)) || ((dataItem.diastolic >= 100) && (dataItem.diastolic <= 109))){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P3, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('bloodPressureScreen.value-2st')}</Text>
    //     </View>
    //     )
    // } else if((dataItem.systolic >= 180) && (dataItem.diastolic >= 110)){
    //   return(
    //     <View style={{backgroundColor: colors.PRESSURE.P4, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.WHITE}}>{t('bloodPressureScreen.value-3st')}</Text>
    //     </View>
    //   )
    // }else{
    //   return(
    //       <View style={{backgroundColor: colors.PRESSURE.P5, padding: spacing.SCALE_5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
    //       <Text style={{fontSize: typography.FONT_SIZE_16, fontWeight: 'bold', color: colors.TEXT.WHITE}}>{t('bloodPressureScreen.measurement-error')}</Text>
    //     </View>
    //   )
    // }
  }


const handeDelete = async () => {
     await firestore()
     .collection('users')
     .doc(user.uid)
     .collection('bloodPressure')
     .doc(ItemId)
     .delete()
     .then(() => {
        ToastAndroid.show(t('bloodPressureViewScreen.toast.measurement-removed'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
        navigation.navigate('BloodPressureScreen');
     })
}

const alertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '',
      //body
      t('bloodPressureViewScreen.alert.text-1'),
      [
        { text: t('bloodPressureViewScreen.alert.yes'), onPress: () => handeDelete() },
        {
          text: t('bloodPressureViewScreen.alert.no'),
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  const imageBG = require('../../assets/images/bloodpreesure1.jpg');
  
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('bloodPressureViewScreen.title')} />
       <Appbar.Action icon="clipboard-edit-outline" onPress={() => 
                  navigation.navigate('BloodPressureEditItemScreen', {itemId: ItemId})
                } />
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
        opacity: 0.2
      }}
  >
   
    <ImageBackground
      source={require('../../assets/images/wave.png')}
      style={{
        flex: 1, 
        height: Dimensions.get('window').height,
        //width: Dimensions.get('window').width,
         height: isTablet ? 300 : 126,
      }}
      imageStyle={{
        //opacity: 0.8
      }}
      >
       
        <View style={styles.rootContainer}>

        { dataItem  &&
            <View style={styles.box}>
                <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
                
                    <View>
                        <MaterialCommunityIcons name='clock-time-five' size={ isTablet ? spacing.SCALE_8 : spacing.SCALE_14} color={colors.COLORS.DEEP_BLUE} />
                    </View>
                    <View>
                        <Text style={{marginLeft: spacing.SCALE_3, fontSize: fontScale(typography.FONT_SIZE_11), color: colors.TEXT.DEEP_BLUE}}>{format(dataItem.createdAt.toDate(), 'dd/MM/yyyy, HH:mm')}</Text>
                    </View>

                </View>
           
                
                    {/* <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={styles.text}>Pomiar ciśnienia krwi</Text>
                    </View> */}
        
                <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.COLORS.LIGHT_GREY, paddingBottom: spacing.SCALE_7, marginTop: spacing.SCALE_6}}>
                
                  <View style={{flexDirection: 'column', flex: 6}}>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 2 }}>
                          <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.TEXT.RED}}>{t('bloodPressureScreen.sys')}</Text>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_30), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{dataItem.systolic} </Text> 
                          </View>

                          <View style={{alignItems: 'center'}}>
                            <Text></Text>
                             <Text style={{fontSize: fontScale(typography.FONT_SIZE_18)}}>/</Text>
                          </View>

                          <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.TEXT.ORANGE}}>{t('bloodPressureScreen.dia')}</Text>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_30), color: colors.TEXT.BLACK, fontWeight: 'bold'}}> {dataItem.diastolic}</Text> 
                         </View>

                         <View style={{alignItems: 'center'}}>
                            <Text></Text>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_14)}}> mmHg</Text>
                         </View>

                      </View>

                      
                      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                           <Text style={{fontSize: fontScale(typography.FONT_SIZE_10), color: colors.TEXT.LIGHT_BLUE}}>{t('bloodPressureScreen.pulse')}</Text>
                           <Text style={{fontSize: fontScale(typography.FONT_SIZE_30), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{dataItem.pulse}</Text> 
                        </View>

                         <View style={{alignItems: 'center'}}>
                           <Text></Text>
                           <Text style={{fontSize: fontScale(typography.FONT_SIZE_14)}}> {t('bloodPressureScreen.bpm')}</Text>
                        </View>
                      </View>
                    
                      </View>

                   </View>

                </View>

                <View style={{marginTop: spacing.SCALE_10}}>
                    {lastPressure()}
                </View>
           </View>
        }
            

        </View>
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default BloodPressureViewItemScreen;

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: spacing.SCALE_6,
        flex: 1
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
      text: {
        textTransform: 'uppercase',
        color: colors.TEXT.BLACK,
        fontSize: fontScale(typography.FONT_SIZE_12)
      },
      textMessage1: {
        fontSize: fontScale(typography.FONT_SIZE_12),
        fontWeight: 'bold',
        color: colors.TEXT.BLACK,
        textTransform: 'uppercase',
      },
      textMessage2: {
        fontSize: fontScale(typography.FONT_SIZE_12),
        fontWeight: 'bold',
        color: colors.TEXT.WHITE,
        textTransform: 'uppercase',
      },
})