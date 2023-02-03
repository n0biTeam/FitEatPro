import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions,ToastAndroid } from 'react-native'
import React, {useState, useContext, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { SelectList } from 'react-native-dropdown-select-list';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SettingsScreen = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('Profile');

  const {t, i18n} = useTranslation();
  const {user} = useContext(AuthContext);
  const [weightUnit, setWeightUnit] = useState('');

  const getUser = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('profil')
    .get()
    .then(( documentSnapshot ) => {
      if( documentSnapshot.exists ) {
       
        setWeightUnit(documentSnapshot.data().weightUnit);

      }
    })
  }
 
  useEffect(() => {
    getUser();
  }, []);

  
  const _getWeightUnit = (weightUnit) => {
    if(weightUnit === 'kg'){
        return 'Kilogram'
    }else if(weightUnit === 'lb'){
        return 'Funt'
    }else if(weightUnit === 'st'){
        return 'Stopa'
    }else{
        return 'Błąd'
    }
  }


  const [selected, setSelected] = useState("");
  console.log(selected)
  console.log(weightUnit)
  const data = [
      {key:'kg', value: 'Kilogramy'},
      {key:'lb', value: 'Funt'},
      {key:'st', value: 'Stopa'},
     
  ];

  const _updateUnit = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('profil')
    .update({
        weightUnit: selected,
    })
    .then(() => {
      console.log('User Update');
      ToastAndroid.show(t('editProfileScreen.profile-updated'), ToastAndroid.LONG, ToastAndroid.CENTER);
      navigation.navigate('Profile');
    })
  }
  
  const imageBG = require('../../assets/images/bg5.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#224870', marginTop: 30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Ustawienia" />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={5}
    resizeMode="cover"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.8
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
            <View style={styles.container}>

                <View style={{marginVertical: spacing.SCALE_6, marginHorizontal: spacing.SCALE_6}}>
                    <Text>Jednosta wagi:</Text>
                </View>
                <View style={{marginHorizontal: spacing.SCALE_6}}>
                   
                    <SelectList 
                        setSelected={(val) => setSelected(val)} 
                        data={data} 
                        save="key"
                        boxStyles={{
                        backgroundColor: colors.COLORS.WHITE,
                        borderTopStartRadius: 5,
                        borderTopEnfRadius: 5,
                        borderBottomEndRadius: 5,
                        borderBottomStartRadius: 5
                        }}
                        dropdownStyles={{
                        backgroundColor: colors.COLORS.WHITE,
                        borderTopStartRadius: 5,
                        borderTopEnfRadius: 5,
                        borderBottomEndRadius: 5,
                        borderBottomStartRadius: 5
                        }}
                        search={false}
                        placeholder={t('whrScreen.select-option')}
                        defaultOption={{ key: weightUnit, value: _getWeightUnit(weightUnit) }}
                    />
                   
                </View>

                <View style={{marginHorizontal: spacing.SCALE_6, marginTop: spacing.SCALE_10}}>
                <Button mode="contained" color={colors.COLORS.DEEP_BLUE} onPress={_updateUnit}>
                    ZAPISZ
                </Button>
                </View>

            </View>

        </View>

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default SettingsScreen;

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: spacing.SCALE_6,
        //marginVertical: spacing.SCALE_6,
        marginBottom: spacing.SCALE_6,
        flex: 1,
    },
    container: {
        backgroundColor: colors.COLORS.WHITE,
        flex: 1,
        borderRadius: 5
    }
})