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

const GlucoseViewItemScreen = ({ route, navigation }) => {
  
  const {t, i18n} = useTranslation();
  const _goBack = () => navigation.navigate('GlucoseDiaryScreen');
  const ItemId = route.params.itemId;

  const {user} = useContext(AuthContext); 
  const [loading, setLoading] = useState(true);
  const [dataItem, setDataItem] = useState('');

  const getGlucose = () => {
    firestore()
   .collection('users')
   .doc(user.uid)
   .collection('glucoseDiary')
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
   getGlucose();
   navigation.addListener("focus", () => setLoading(!loading));
}, [navigation, loading]);

const lastGlucose = () => {
    //console.log(getGlucoseMg)
    if((dataItem.glucoseMg >= 70) && (dataItem.glucoseMg <= 99)){
      return(
        <View style={{backgroundColor: colors.GLUCOSE.G1, padding: 5, marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.value-normal')}</Text>
        </View>
      )
    } else if((dataItem.glucoseMg >= 100) && (dataItem.glucoseMg <= 125)){
      return(
        <View style={{backgroundColor: colors.GLUCOSE.G2, padding: 5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.pre-diabetes')}</Text>
        </View>
      )
    } else if(dataItem.glucoseMg > 126){
        return(
          <View style={{backgroundColor: colors.GLUCOSE.G3, padding: 5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
            <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.diabetes')}</Text>
          </View>
        )
    }else{
      return(
          <View style={{backgroundColor: colors.GLUCOSE.G4, padding: 5,  marginBottom: spacing.SCALE_6, padding: spacing.SCALE_10, borderRadius: 5, alignItems: 'center'}}>
          <Text style={{fontSize: fontScale(typography.FONT_SIZE_14), fontWeight: 'bold', color: colors.TEXT.BLACK}}>{t('glucoseDiaryScreen.measurement-error')}</Text>
        </View>
      )
    }
  }

  const emoticon = () => {
    
    if((dataItem.glucoseMg >= 70) && (dataItem.glucoseMg <= 99)){
        return(
                <MaterialCommunityIcons name='emoticon-happy' size={spacing.SCALE_25} color={colors.EMOTICON.E1} />
        )
    } else if((dataItem.glucoseMg >= 100) && (dataItem.glucoseMg <= 125)){
        return(
                <MaterialCommunityIcons name='emoticon-neutral' size={spacing.SCALE_25} color={colors.EMOTICON.E2} />
        )
    } else if(dataItem.glucoseMg > 126){
        return(
            <MaterialCommunityIcons name='emoticon-sad' size={spacing.SCALE_25} color={colors.EMOTICON.E3} />
        )
    } else {
        return(
                <MaterialCommunityIcons name='emoticon-neutral' size={spacing.SCALE_25} color={colors.EMOTICON.E4} />
        )
    }
}


const handeDelete = async () => {
     await firestore()
     .collection('users')
     .doc(user.uid)
     .collection('glucoseDiary')
     .doc(ItemId)
     .delete()
     .then(() => {
        ToastAndroid.show('Skasowano pomiar', ToastAndroid.LONG, ToastAndroid.BOTTOM);
        navigation.navigate('GlucoseDiaryScreen');
     })
}

const alertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '',
      //body
      'Czy napewno chcesz usunąć pomiar ?',
      [
        { text: 'TAK', onPress: () => handeDelete() },
        {
          text: 'NIE',
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
    <SafeAreaProvider style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('glucoseViewItemtScreen.title')} />
       <Appbar.Action icon="clipboard-edit-outline" onPress={() => 
                  navigation.navigate('GlucoseEditItemScreen', {itemId: ItemId})
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
           
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={styles.text}>{t('glucoseViewItemtScreen.blood-glucose-measurement')}</Text>
                    </View>

                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        {emoticon()}
                    </View>
                    
                    
                </View>

                <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                        <View style={{}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_30), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{dataItem.glucoseMg}</Text>
                        </View>

                        <View style={{justifyContent: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_14)}}> mg/dL</Text>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                        <View>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_30), color: colors.TEXT.BLACK, fontWeight: 'bold'}}>{(dataItem.glucoseMmol).toFixed(1)}</Text>
                        </View>

                        <View style={{justifyContent: 'center'}}>
                            <Text style={{fontSize: fontScale(typography.FONT_SIZE_14)}}> mmol/L</Text>
                        </View>

                    </View>
                </View>
                
                <View style={{marginTop: spacing.SCALE_10}}>
                    {lastGlucose()}
                </View>
           </View>
        }
            

        </View>
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default GlucoseViewItemScreen;

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
      }
})