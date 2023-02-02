import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ToastAndroid } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, TextInput } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';

const GlucoseEditItemScreen = ({ route, navigation }) => {
  
  const {t, i18n} = useTranslation();
  const ItemId = route.params.itemId;
  const _goBack = () => navigation.navigate('GlucoseViewItemScreen', {itemId: ItemId});

  const {user} = useContext(AuthContext); 
  const [glucoseData, setGlucoseData] = useState('');
  
  
  const getGlucose = async () => {
    const currentProduct = await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('glucoseDiary')
    .doc(ItemId)
    .get()
    .then(( doc ) => {
      if( doc.exists ) {
        //console.log('Products Data: ', documentSnapshot.data());
        setGlucoseData(doc.data());
      }
    })
  };

  useEffect(() => {
    getGlucose();
  }, []);

  const handleUpdate = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('glucoseDiary')
    .doc(ItemId)
    .update({
        glucoseMg: parseInt(glucoseData.glucoseMg),
        glucoseMmol: parseFloat(glucoseData.glucoseMg)/18,
    })
    .then(() => {
      console.log('Product Update');
      ToastAndroid.show(t('glucoseEditItemScreen.toast.measurement-updated'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('GlucoseViewItemScreen', {itemId: ItemId})

    })
  }

  const imageBG = require('../../assets/images/glukometr4.jpg');

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('glucoseEditItemScreen.title')} />
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
         height: 125,
      }}
      imageStyle={{
        //opacity: 0.8
      }}
      >
        <View style={styles.rootContainer}>
            <View style={{marginTop: spacing.SCALE_6}}>
                <TextInput
                    underlineColor={colors.COLORS.LIGHT_GREY}
                    activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                    label={t('glucoseDiaryScreen.glucose') + ' (mg/dL)'}
                    value={glucoseData ? glucoseData.glucoseMg.toString() : ''}
                    onChangeText={(txt) => setGlucoseData({...glucoseData, glucoseMg: txt})}
                    keyboardType="numeric"
                    style={{backgroundColor: colors.COLORS.WHITE}}
                />
            </View>

            <View style={{marginTop: spacing.SCALE_6}}>
                <TouchableOpacity onPress={handleUpdate} style={styles.btnModal}>
                    <Text style={styles.textBtn}>{t('glucoseEditItemScreen.update')}</Text>
                </TouchableOpacity>
            </View>
        
        </View>
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default GlucoseEditItemScreen;

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: spacing.SCALE_6,
        flex: 1
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