import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ToastAndroid } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, TextInput } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { colors, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const BloodPressureEditItemScreen = ({ route, navigation }) => {
  
  const {t, i18n} = useTranslation();
  const ItemId = route.params.itemId;
  const _goBack = () => navigation.navigate('BloodPressureViewItemScreen', {itemId: ItemId});

  const {user} = useContext(AuthContext); 
  const [pressureData, setPressureData] = useState('');
  
  
  const getPressure = async () => {
    const currentProduct = await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('bloodPressure')
    .doc(ItemId)
    .get()
    .then(( doc ) => {
      if( doc.exists ) {
        //console.log('Products Data: ', documentSnapshot.data());
        setPressureData(doc.data());
      }
    })
  };

  useEffect(() => {
    getPressure();
  }, []);

  const handleUpdate = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('bloodPressure')
    .doc(ItemId)
    .update({
        systolic: parseInt(pressureData.systolic),
        diastolic: parseInt(pressureData.diastolic),
        pulse: parseInt(pressureData.pulse),
    })
    .then(() => {
      console.log('Product Update');
      ToastAndroid.show(t('bloodPressureEditScreen.toast.measurement-updated'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('BloodPressureViewItemScreen', {itemId: ItemId})

    })
  }

  const imageBG = require('../../assets/images/bloodpreesure1.jpg');

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('bloodPressureEditScreen.title')} />
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
            <View style={{}}>
                <TextInput
                    underlineColor={colors.COLORS.LIGHT_GREY}
                    activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                    label={t('bloodPressureScreen.systolic') + ' (mmHg)'}
                    value={pressureData ? pressureData.systolic.toString() : ''}
                    onChangeText={(txt) => setPressureData({...pressureData, systolic: txt})}
                    keyboardType="numeric"
                    style={{backgroundColor: colors.COLORS.WHITE}}
                />
            </View>

            <View style={{marginTop: spacing.SCALE_6}}>
                <TextInput
                    underlineColor={colors.COLORS.LIGHT_GREY}
                    activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                    label={t('bloodPressureScreen.diastolic') + ' (mmHg)'}
                    value={pressureData ? pressureData.diastolic.toString() : ''}
                    onChangeText={(txt) => setPressureData({...pressureData, diastolic: txt})}
                    keyboardType="numeric"
                    style={{backgroundColor: colors.COLORS.WHITE}}
                />
            </View>

            <View style={{marginTop: spacing.SCALE_6}}>
                <TextInput
                    underlineColor={colors.COLORS.LIGHT_GREY}
                    activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                    label={t('bloodPressureScreen.pulse') + ' (' + t('bloodPressureScreen.bpm') + ')'}
                    value={pressureData ? pressureData.pulse.toString() : ''}
                    onChangeText={(txt) => setPressureData({...pressureData, pulse: txt})}
                    keyboardType="numeric"
                    style={{backgroundColor: colors.COLORS.WHITE}}
                />
            </View>

            <View style={{marginTop: spacing.SCALE_6}}>
                <TouchableOpacity onPress={handleUpdate} style={styles.btnModal}>
                    <Text style={styles.textBtn}>{t('bloodPressureEditScreen.update')}</Text>
                </TouchableOpacity>
            </View>
        
        </View>
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default BloodPressureEditItemScreen;

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: spacing.SCALE_6,
        flex: 1
    },
    btnModal: {
        borderWidth: 0,
        padding: spacing.SCALE_10,
        width: isTablet ? Dimensions.get('window').width-24 : Dimensions.get('window').width-12,
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