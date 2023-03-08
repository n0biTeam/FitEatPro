import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ToastAndroid } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { TextInput } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const PurineEditScreen = ({ route, navigation }) => {
  
  const {t, i18n} = useTranslation();
  const _goBack = () => navigation.navigate('PurineListScreen');
  const productId = route.params.itemId;

  const {user} = useContext(AuthContext); 
  const [productData, setProductData] = useState('');
  
  
  const getProduct = async () => {
    const currentProduct = await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('purines')
    .doc(productId)
    .get()
    .then(( documentSnapshot ) => {
      if( documentSnapshot.exists ) {
        setProductData(documentSnapshot.data());
      }
    })
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleUpdate = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('purines')
    .doc(productId)
    .update({
      name: productData.name,
      category: productData.category,
      index_glycemic: parseInt(productData.index_glycemic),
      kcal: parseInt(productData.kcal),
    })
    .then(() => {
      console.log('Product Update');
      ToastAndroid.show(t('purineEditScreen.toast.product-update'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('GlycemicIndex')

    })
  }

  const handleDelete = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('purines')
    .doc(productId)
    .delete()
    .then(() => {
      console.log('Product deleted!');
      ToastAndroid.show(t('purineEditScreen.toast.product-deleted'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('PurineListScreen');
    });
  }

  const imageBG = require('../../assets/images/bg5.jpg');
  

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('purineEditScreen.title')} />
       <Appbar.Action icon="trash-can" onPress={handleDelete} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={5}
    resizeMode="cover"
    style={{ 
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
          height: isTablet ? 300 : 126,
        }}
        imageStyle={{
          
        }}
        >
                 
        <View style={{flex: 1, justifyContent: 'flex-start', marginHorizontal: spacing.SCALE_8}}>
          
          <View>

          <View style={{marginBottom: spacing.SCALE_10}}></View>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('purineEditScreen.name')}
            value={productData ? productData.name : ''}
            onChangeText={(txt) => setProductData({...productData, name: txt})}
            style={{backgroundColor: colors.COLORS.WHITE}}
          />

          <View style={{marginBottom: spacing.SCALE_8}}></View>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('purineEditScreen.category')}
            value={productData ? productData.category : ''}
            onChangeText={(txt) => setProductData({...productData, category: txt})}
            style={{backgroundColor: colors.COLORS.WHITE}}
          />

          
          <View style={{marginBottom: spacing.SCALE_10}}></View>
            <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('purineEditScreen.purine') + ' [mg]'}
                value={productData ? productData.purine.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, purine: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
            />

          <View style={{marginBottom: spacing.SCALE_10}}></View>
            <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('purineEditScreen.uric-acid') + ' [mg]'}
                value={productData ? productData.uricAcid.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, uricAcid: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE, marginBottom: spacing.SCALE_10}}
            />
          

            <TouchableOpacity onPress={handleUpdate} style={styles.btnModal}>
              <Text style={styles.textBtn}>{t('purineEditScreen.update')}</Text>
            </TouchableOpacity>

          </View>
        
        </View>

      </ImageBackground>
      
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default PurineEditScreen;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.COLORS.DEEP_BLUE,
    backgroundColor: colors.COLORS.WHITE,
    paddingLeft: spacing.SCALE_10,
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