import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions,ToastAndroid } from 'react-native'
import React, {useState, useContext, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { SelectList } from 'react-native-dropdown-select-list';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { UNIT } from '../../styles/units';

const UnitSettingScreen = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('SettingScreen');

  const {t, i18n} = useTranslation();
  const {user} = useContext(AuthContext);
  const [weightUnit, setWeightUnit] = useState('');
  const [growthUnit, setGrowthUnit] = useState('');
  //const [diaryUnit, setDiaryUnit] = useState('');


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
        setGrowthUnit(documentSnapshot.data().growthUnit);
        //setDiaryUnit(documentSnapshot.data().diaryUnit);
      }
    })
  }
 
  useEffect(() => {
    getUser();
  }, []);

  
  const _getWeightUnit = (weightUnit) => {
    if(weightUnit === UNIT.KG){
        return 'Kilogram'
    }else{
        return 'Funt'
    }
  }

  const _getHeightUnit = (growthUnit) => {
    if(growthUnit === UNIT.CM){
        return 'Centymetr'
    }else{
        return 'Cale'
    }
  }

  // const _getDiaryUnit = (diaryUnit) => {
  //   if(diaryUnit === UNIT.GR){
  //       return 'Gram'
  //   }else{
  //       return 'Uncja'
  //   }
  // }
  
    
  const [selected, setSelected] = useState("");
  const [selectedH, setSelectedH] = useState("");
  //const [selectedD, setSelectedD] = useState("");
  //console.log(selected)
  //console.log(growthUnit)
  const dataWeidth = [
      {key: UNIT.KG, value: 'Kilogramy'},
      {key: UNIT.LB, value: 'Funt'},
      // {key:'st', value: 'Stopa'},
  ];

  const dataHeight = [
    {key: UNIT.CM, value: 'Centymetry'},
    {key: UNIT.IN, value: 'Cale'},
    // {key:'ft', value: 'Stopa'},
];

// const dataDiary = [
//   {key: UNIT.GR, value: 'Gram'},
//   {key: UNIT.OZ, value: 'Uncja'}, 
// ];



  const _updateUnit = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('profil')
    .update({
        weightUnit: selected,
        growthUnit: selectedH,
        //diaryUnit: selectedD
    })
    .then(() => {
      console.log('User Update');
      ToastAndroid.show(t('unitSettingScreen.toast.edit-unit'), ToastAndroid.LONG, ToastAndroid.CENTER);
      navigation.navigate('SettingScreen');
    })
  }
  
  const imageBG = require('../../assets/images/bg5.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#224870', marginTop: 30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Ustawienia jednostek" />
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
                    <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>Jednosta masy ciała:</Text>
                </View>
                <View style={{marginHorizontal: spacing.SCALE_6}}>
                   
                    <SelectList 
                        setSelected={(val) => setSelected(val)} 
                        data={dataWeidth} 
                        save="key"
                        boxStyles={{
                        backgroundColor: colors.COLORS.WHITE,
                        borderTopStartRadius: 5,
                        borderTopEnfRadius: 5,
                        borderBottomEndRadius: 5,
                        borderBottomStartRadius: 5,
                        borderColor: colors.COLORS.DEEP_BLUE,
                        borderWidth: 1,
                        
                        }}
                        dropdownTextStyles={{
                            color: colors.TEXT.DEEP_BLUE
                        }}
                        inputStyles={{
                            color: colors.TEXT.DEEP_BLUE
                        }}
                        dropdownStyles={{
                            backgroundColor: colors.COLORS.WHITE,
                            borderTopStartRadius: 5,
                            borderTopEnfRadius: 5,
                            borderBottomEndRadius: 5,
                            borderBottomStartRadius: 5,
                            borderColor: colors.COLORS.DEEP_BLUE,
                            borderWidth: 1
                        }}
                        search={false}
                        placeholder={t('whrScreen.select-option')}
                        defaultOption={{ key: weightUnit, value: _getWeightUnit(weightUnit) }}
                    />
                   
                </View>

                <View style={{marginVertical: spacing.SCALE_6, marginHorizontal: spacing.SCALE_6}}>
                    <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>Jednosta długości:</Text>
                </View>
                <View style={{marginHorizontal: spacing.SCALE_6}}>
                   
                    <SelectList 
                        setSelected={(val) => setSelectedH(val)} 
                        data={dataHeight} 
                        save="key"
                        boxStyles={{
                            backgroundColor: colors.COLORS.WHITE,
                            borderTopStartRadius: 5,
                            borderTopEnfRadius: 5,
                            borderBottomEndRadius: 5,
                            borderBottomStartRadius: 5,
                            borderColor: colors.COLORS.DEEP_BLUE,
                            borderWidth: 1
                        }}
                        dropdownTextStyles={{
                            color: colors.TEXT.DEEP_BLUE
                        }}
                        inputStyles={{
                            color: colors.TEXT.DEEP_BLUE
                        }}
                        dropdownStyles={{
                            backgroundColor: colors.COLORS.WHITE,
                            borderTopStartRadius: 5,
                            borderTopEnfRadius: 5,
                            borderBottomEndRadius: 5,
                            borderBottomStartRadius: 5,
                            borderColor: colors.COLORS.DEEP_BLUE
                        }}
                        search={false}
                        placeholder={t('whrScreen.select-option')}
                        defaultOption={{ key: growthUnit, value: _getHeightUnit(growthUnit) }}
                    />
                   
                </View>

                {/* <View style={{marginVertical: spacing.SCALE_6, marginHorizontal: spacing.SCALE_6}}>
                    <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>Jednosta wagi w dzienniku posiłów:</Text>
                </View>
                <View style={{marginHorizontal: spacing.SCALE_6}}>
                   
                    <SelectList 
                        setSelected={(val) => setSelectedD(val)} 
                        data={dataDiary} 
                        save="key"
                        boxStyles={{
                        backgroundColor: colors.COLORS.WHITE,
                        borderTopStartRadius: 5,
                        borderTopEnfRadius: 5,
                        borderBottomEndRadius: 5,
                        borderBottomStartRadius: 5,
                        borderColor: colors.COLORS.DEEP_BLUE,
                        borderWidth: 1,
                        
                        }}
                        dropdownTextStyles={{
                            color: colors.TEXT.DEEP_BLUE
                        }}
                        inputStyles={{
                            color: colors.TEXT.DEEP_BLUE
                        }}
                        dropdownStyles={{
                            backgroundColor: colors.COLORS.WHITE,
                            borderTopStartRadius: 5,
                            borderTopEnfRadius: 5,
                            borderBottomEndRadius: 5,
                            borderBottomStartRadius: 5,
                            borderColor: colors.COLORS.DEEP_BLUE,
                            borderWidth: 1
                        }}
                        search={false}
                        placeholder={t('whrScreen.select-option')}
                        defaultOption={{ key: diaryUnit, value: _getDiaryUnit(diaryUnit) }}
                    />
                   
                </View> */}

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

export default UnitSettingScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    container: {
        backgroundColor: colors.COLORS.WHITE,
        flex: 1,
        borderTopLeftRadius: spacing.SCALE_5,
        borderTopRightRadius: spacing.SCALE_5,
    }
})