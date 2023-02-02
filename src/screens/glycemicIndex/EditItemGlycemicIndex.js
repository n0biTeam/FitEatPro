import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, Alert, ToastAndroid } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { TextInput } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';

const EditItemGlycemicIndex = ({ route, navigation }) => {
  
  const _goBack = () => navigation.navigate('GlycemicIndex');
  const productId = route.params.itemId;

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
        //console.log('Products Data: ', documentSnapshot.data());
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
      choresterol: parseFloat(productData.choresterol)
    })
    .then(() => {
      console.log('Product Update');
      Alert.alert('Produkt zaktualizowany');
      navigation.navigate('GlycemicIndex')

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
       <Appbar.Action icon="trash-can" onPress={handleDelete} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={require('../../assets/images/bg5.jpg')}
    blurRadius={5}
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
          height: 125,
        }}
        imageStyle={{
          //opacity: 0.8
        }}
        >
                 
        <View style={{flex: 1, justifyContent: 'flex-start', marginHorizontal: spacing.SCALE_8}}>
          
          <View>

          <View style={{marginBottom: spacing.SCALE_10}}></View>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label="Nazwa"
            value={productData ? productData.name : ''}
            onChangeText={(txt) => setProductData({...productData, name: txt})}
            style={{backgroundColor: colors.COLORS.WHITE}}
          />

          <View style={{marginBottom: spacing.SCALE_8}}></View>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label="Kategoria"
            value={productData ? productData.category : ''}
            onChangeText={(txt) => setProductData({...productData, category: txt})}
            style={{backgroundColor: colors.COLORS.WHITE}}
          />

          <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Indeks glikemiczny"
                value={productData ? productData.index_glycemic.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, index_glycemic: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Kcal"
                value={productData ? productData.kcal.toString() : 0}
                onChangeText={(txt) => setProductData({...productData, kcal: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Białko"
                value={productData ? productData.protein.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, protein: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}                
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Tłuszcz"
                value={productData ? productData.fat.toString() : 0}
                onChangeText={(txt) => setProductData({...productData, fat: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8, marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Węglowodany"
                value={productData ? productData.carbs.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, carbs: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Błonnik"
                value={productData ? productData.fiber.toString() : 0}
                onChangeText={(txt) => setProductData({...productData, fiber: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Cukier"
                value={productData ? productData.Sugars.toString() : ''}
                onChangeText={(txt) => setProductData({...productData, Sugars: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4, marginBottom: spacing.SCALE_10}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Cholesterol"
                value={productData ? productData.choresterol.toString() : 0}
                onChangeText={(txt) => setProductData({...productData, choresterol: txt})}
                keyboardType="numeric"
                style={{backgroundColor: colors.COLORS.WHITE}}
              />
              </View>
            </View>

            <TouchableOpacity onPress={handleUpdate} style={styles.btnModal}>
              <Text style={styles.textBtn}>ZAPISZ</Text>
            </TouchableOpacity>

          </View>
        
        
        
        </View>

      </ImageBackground>
      
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
})