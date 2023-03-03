import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { TextInput } from 'react-native-paper';
import { colors, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';

const PurineAddScreen = ({ navigation }) => {
  
  const {t, i18n} = useTranslation();
  const _goBack = () => navigation.navigate('PurineListScreen');
  
  const {user} = useContext(AuthContext); 
   
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [purine, setPurine] = useState('');
  const [uricAcid, setUricAcid] = useState('');


  
  const handleAdd = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('purines')
    .add({
      name: name,
      category: category,
      purine: !purine ? parseInt(uricAcid / 2.4) : parseInt(purine),
      uricAcid: !uricAcid ? parseInt(purine * 2.4) : parseInt(uricAcid),
    })
    .then(() => {
      console.log('Product purine Added');
      ToastAndroid.show(t('purineAddScreen.toast.added'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('PurineListScreen')

    })
  }

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
      color = colors.COLORS.GREY_CCC;
    }
    return color;
  }

  const [isLoading, setIsLoading] = useState(false); //button
    const toggleLoading = () => {
      setIsLoading(!isLoading);
    };

  const emptyBtn = (name != null && name != '') 
                    && (category != null && category != '');

  const imageBG = require('../../assets/images/bg5.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('purineAddScreen.title')} />
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
                       
        <SafeAreaProvider style={styles.rootContainer}>

          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('purineAddScreen.name')}
            value={name}
            onChangeText={(txt) => setName(txt)}
            style={styles.textInput}
          />

          <View style={{marginBottom: spacing.SCALE_8}}></View>
          <TextInput
           underlineColor={colors.COLORS.LIGHT_GREY}
           activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('purineAddScreen.category')}
            value={category}
            onChangeText={(txt) => setCategory(txt)}
            style={styles.textInput}
          />

          <View style={{marginBottom: spacing.SCALE_8}}></View>
          <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('purineAddScreen.purine') + ' [mg]'}
                value={purine}
                onChangeText={(txt) => setPurine(txt)}
                keyboardType="numeric"
                style={styles.textInput}
                
              />

          <View style={{marginBottom: spacing.SCALE_8}}></View>  
          <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('purineAddScreen.uric-acid') + ' [mg]'}
                value={uricAcid}
                onChangeText={(txt) => setUricAcid(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />

           

            <View style={{alignItems: 'center', marginTop: spacing.SCALE_6}}>
            <TouchableOpacity onPress={() => {handleAdd(); toggleLoading(true)}} style={[styles.btnModal, {backgroundColor: getBackGroundColor()}]} disabled={!emptyBtn}>

              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: spacing.SCALE_10}}>
                  { isLoading && <ActivityIndicator size="small" color={colors.TEXT.WHITE} /> }
                </View>
                <View>
                  <Text style={{color: getColor()}}>{t('purineAddScreen.btn-add')}</Text>
                </View>
              </View>
                
              </TouchableOpacity>

            </View>

        </SafeAreaProvider>

      </ImageBackground>
      
   
    </SafeAreaProvider>
  )
}

export default PurineAddScreen;


const styles = StyleSheet.create({
  btnModal: {
    padding: spacing.SCALE_10,
    width: Dimensions.get('window').width-12,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: colors.COLORS.DEEP_BLUE,
    elevation: 3,
  },
  textInput: {
    backgroundColor: colors.COLORS.WHITE
  },
  rootContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: spacing.SCALE_8,
    marginTop: spacing.SCALE_3
  }
})