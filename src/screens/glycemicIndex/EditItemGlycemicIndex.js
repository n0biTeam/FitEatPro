import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, Alert, ToastAndroid, ScrollView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { TextInput } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const EditItemGlycemicIndex = ({ route, navigation }) => {
  
  const _goBack = () => navigation.navigate('GlycemicIndex');
  const productId = route.params.itemId;
  const {t, i18n} = useTranslation();
  const {user} = useContext(AuthContext); 
  const [productData, setProductData] = useState('');
  
  
  const getProduct = async () => {
    const currentProduct = await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('products')
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
    .collection('products')
    .doc(productId)
    .update({
      name: productData.name,
      category: productData.category,
      index_glycemic: parseInt(productData.index_glycemic),
      kcal: parseInt(productData.kcal),
      protein: parseFloat(productData.protein),
      fat: parseFloat(productData.fat),
      carbs: parseFloat(productData.carbs),
      fiber: parseFloat(productData.fiber),
      Sugars: parseFloat(productData.Sugars),
      choresterol: parseFloat(productData.choresterol),
      witA: parseInt(productData.witA),
      betaCarotene: parseFloat(productData.betaCarotene),
      luteinaZeaksantyna: parseFloat(productData.luteinaZeaksantyna),
      WitB1Tiamina: parseFloat(productData.WitB1Tiamina),
      WitB2Ryboflawina: parseFloat(productData.WitB2Ryboflawina),
      WitB3Niacyna: parseFloat(productData.WitB3Niacyna),
      WitB4Cholina: parseFloat(productData.WitB4Cholina),
      WitB5KwasPantotenowy: parseFloat(productData.WitB5KwasPantotenowy),
      WitB6: parseFloat(productData.WitB6),
      WitB9KwasFoliowy: parseFloat(productData.WitB9KwasFoliowy),
      WitB12: parseFloat(productData.WitB12),
      WitC: parseFloat(productData.WitC),
      WitE: parseFloat(productData.WitE),
      WitK: parseFloat(productData.WitK),
      Wapn: parseFloat(productData.Wapn),
      Magnez: parseFloat(productData.Magnez),
      Fosfor: parseFloat(productData.Fosfor),
      Potas: parseFloat(productData.Potas),
      Sod: parseFloat(productData.Sod),
      Miedz: parseFloat(productData.Miedz),
      Zelazo: parseFloat(productData.Zelazo),
      Mangan: parseFloat(productData.Mangan),
      Selen: parseFloat(productData.Selen),
      Cynk: parseFloat(productData.Cynk)
    })
    .then(() => {
      console.log('Product Update');
      navigation.navigate('GlycemicIndex')
      ToastAndroid.show(t('editItemGlycemicIndex.toast.product-update'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
    })
  }

  const handleDelete = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('products')
    .doc(productId)
    .delete()
    .then(() => {
      console.log('Product deleted!');
      ToastAndroid.show('Produkt usunięty', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('GlycemicIndex');
    });
  }
  

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Edycja produktu" />
       <Appbar.Action icon="content-save" onPress={handleUpdate} color={colors.BMI.BMI_4}/>
       <Appbar.Action icon="trash-can" onPress={handleDelete} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={require('../../assets/images/bg5.jpg')}
    blurRadius={30}
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
      
                 
        <View style={{flex: 1, justifyContent: 'flex-start', marginHorizontal: spacing.SCALE_8}}>
          
          <ScrollView>

          <View style={{marginTop: spacing.SCALE_6}}></View>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('addGlycemicIndex.value.name')}
            value={productData ? productData.name.toString() : ''}
            onChangeText={(txt) => setProductData({...productData, name: txt})}
            style={styles.textInput}
          />

          <View style={{marginBottom: spacing.SCALE_8}}></View>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('addGlycemicIndex.value.category')}
            value={productData ? productData.category.toString() : ''}
            onChangeText={(txt) => setProductData({...productData, category: txt})}
            style={styles.textInput}
          />

          <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.glycemic-index')}
                value={productData ? productData.index_glycemic.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, index_glycemic: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.kcal')}
                value={productData ? productData.kcal.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, kcal: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.protein') + ' [' + UNIT.GR + ']'}
                value={productData ? productData.protein.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, protein: txt})}
                keyboardType="numeric"
                style={styles.textInput}       
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.fat') + ' [' + UNIT.GR + ']'}
                value={productData ? productData.fat.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, fat: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>
 
            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8, marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.carbs') + ' [' + UNIT.GR + ']'}
                value={productData ? productData.carbs.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, carbs: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.fiber') + ' [' + UNIT.GR + ']'}
                value={productData ? productData.fiber.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, fiber: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.sugar') + ' [' + UNIT.GR + ']'}
                value={productData ? productData.Sugars.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Sugars: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.cholesterol') + ' [' + UNIT.GR + ']'}
                value={productData ? productData.choresterol.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, choresterol: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{backgroundColor: colors.COLORS.LIGHT_BLUE, padding: spacing.SCALE_5, alignItems: 'center', borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
              <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold', textTransform: 'uppercase'}}>{t('addGlycemicIndex.title-vitamin')}</Text>
            </View>
            
            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witA') + ' [' + UNIT.IU + ']'} 
                value={productData ? productData.witA.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, witA: txt})}
                keyboardType="numeric"
                style={styles.textInput}
  
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.beta-caroten') + ' [' + UNIT.UG + ']'}
                value={productData ? productData.betaCarotene.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, betaCarotene: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.luteina') + ' [' + UNIT.UG + ']'}
                value={productData ? productData.luteinaZeaksantyna.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, luteinaZeaksantyna: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB1') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitB1Tiamina.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitB1Tiamina: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB2') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitB2Ryboflawina.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitB2Ryboflawina: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB3') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitB3Niacyna.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, witB3Niacyna: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB5') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitB5KwasPantotenowy.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitB5KwasPantotenowy: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB6') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitB6.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitB6: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB9') + ' [' + UNIT.UG + ']'}
                value={productData ? productData.WitB9KwasFoliowy.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitB9KwasFoliowy: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB12') + ' [' + UNIT.UG + ']'}
                value={productData ? productData.WitB12.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitB12: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witC') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitC.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitC: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witE') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitE.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitE: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witK') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.WitK.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, WitK: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              
              </View>
            </View>

            <View style={{backgroundColor: colors.COLORS.LIGHT_BLUE, padding: spacing.SCALE_5, alignItems: 'center', borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
              <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold', textTransform: 'uppercase'}}>{t('addGlycemicIndex.title-macronutrients')}</Text>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.wapn') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Wapn.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Wapn: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.magnez') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Magnez.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Magnez: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.fosfor') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Fosfor.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Fosfor: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.potas') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Potas.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Potas: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.sod') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Sod.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Sod: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              
              </View>
            </View>

            <View style={{backgroundColor: colors.COLORS.LIGHT_BLUE, padding: spacing.SCALE_5, alignItems: 'center', borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
              <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold', textTransform: 'uppercase'}}>{t('addGlycemicIndex.title-micronutrients')}</Text>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.miedz') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Miedz.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Miedz: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.zelazo') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Zelazo.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Zelazo: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.mangan') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Mangan.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Mangan: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.selen') + ' [' + UNIT.UG + ']'}
                value={productData ? productData.Selen.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Selen: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.cynk') + ' [' + UNIT.MG + ']'}
                value={productData ? productData.Cynk.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Cynk: txt})}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              
              </View>
            </View>

            <TouchableOpacity onPress={handleUpdate} style={styles.btnModal}>
              <Text style={styles.textBtn}>{t('editItemGlycemicIndex.btn.update')}</Text>
            </TouchableOpacity>

          </ScrollView>
        
        
        
        </View>

      </ImageBackground>
      
    
    </SafeAreaProvider>
  )
}

export default EditItemGlycemicIndex;

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
  textInput: {
    backgroundColor: colors.COLORS.WHITE
  },
})