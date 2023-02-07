import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { TextInput } from 'react-native-paper';
import { colors, spacing } from '../../styles';
import { ScrollView } from 'react-native-gesture-handler';
import { UNIT } from '../../styles/units';

const AddGlycemicIndex = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('GlycemicIndex');
  
  const {user} = useContext(AuthContext); 
   
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [glycemicIndex, setGlycemicIndex] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [sugar, setSugar] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [witA, setWitA] = useState('');
  const [betaCarotene, setBetaCarotene] = useState('');
  const [luteinaZeaksantyna, setLuteinaZeaksantyna] = useState('');
  const [witB1Tiamina, setWitB1Tiamina] = useState('');
  
  const handleAdd = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('products')
    .add({
      name: name,
      category: category,
      index_glycemic: !glycemicIndex ? 0 : parseInt(glycemicIndex),
      kcal: !kcal ? 0 : parseInt(kcal),
      protein: !protein ? 0 : parseFloat(protein),
      fat: !fat ? 0 : parseFloat(fat),
      carbs: !carbs ? 0 : parseFloat(carbs),
      fiber: !fiber ? 0: parseFloat(fiber),
      Sugars: !sugar ? 0 : parseFloat(sugar),
      choresterol: !cholesterol ? 0 : parseFloat(cholesterol),
      grammage: 100,
      witA: !witA ? 0 : parseFloat(witA),
      betaCarotene: !betaCarotene ? 0 : parseFloat(betaCarotene),
      luteinaZeaksantyna: !luteinaZeaksantyna ? 0 : parseFloat(luteinaZeaksantyna),
      WitB1Tiamina: !witB1Tiamina ? 0 : parseFloat(witB1Tiamina),
    })
    .then(() => {
      console.log('Product Added');
      ToastAndroid.show('Dodano produkt', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('GlycemicIndex')

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
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Dodaj produkt" />
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
          height: 110,
        }}
        imageStyle={{
          //opacity: 0.8
        }}
        >
                 
        <SafeAreaProvider style={styles.rootContainer}>
        <ScrollView>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label="Nazwa"
            value={name}
            onChangeText={(txt) => setName(txt)}
            style={styles.textInput}
          />

          <View style={{marginBottom: spacing.SCALE_8}}></View>
          <TextInput
           underlineColor={colors.COLORS.LIGHT_GREY}
           activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label="Kategoria"
            value={category}
            onChangeText={(txt) => setCategory(txt)}
            style={styles.textInput}
          />

          <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Indeks glikemiczny"
                value={glycemicIndex}
                onChangeText={(txt) => setGlycemicIndex(txt)}
                keyboardType="numeric"
                style={styles.textInput}
                
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Kcal"
                value={kcal}
                onChangeText={(txt) => setKcal(txt)}
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
                label="Białko"
                value={protein}
                onChangeText={(txt) => setProtein(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Tłuszcz"
                value={fat}
                onChangeText={(txt) => setFat(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8, marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Węglowodany"
                value={carbs}
                onChangeText={(txt) => setCarbs(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Błonnik"
                value={fiber}
                onChangeText={(txt) => setFiber(txt)}
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
                label="Cukier"
                value={sugar}
                onChangeText={(txt) => setSugar(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label="Cholesterol"
                value={cholesterol}
                onChangeText={(txt) => setCholesterol(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>

            <View style={{backgroundColor: colors.COLORS.LIGHT_BLUE, padding: spacing.SCALE_5, alignItems: 'center', borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
              <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>WITAMINY</Text>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={'Witamina A [' + UNIT.IU + ']'} 
                value={witA}
                onChangeText={(txt) => setWitA(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={'Beta-caroten [' + UNIT.UG + ']'} 
                value={betaCarotene}
                onChangeText={(txt) => setBetaCarotene(txt)}
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
                label={'Luteina+zaks. [' + UNIT.UG + ']'} 
                value={luteinaZeaksantyna}
                onChangeText={(txt) => setLuteinaZeaksantyna(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={'Witamina B1 [' + UNIT.MG + ']'} 
                value={witB1Tiamina}
                onChangeText={(txt) => setWitB1Tiamina(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
              </View>
            </View>


            <View style={{alignItems: 'center', marginTop: spacing.SCALE_6}}>
            <TouchableOpacity onPress={() => {handleAdd(); toggleLoading(true)}} style={[styles.btnModal, {backgroundColor: getBackGroundColor()}]} disabled={!emptyBtn}>

              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: spacing.SCALE_10}}>
                  { isLoading && <ActivityIndicator size="small" color={colors.TEXT.WHITE} /> }
                </View>
                <View>
                  <Text style={{color: getColor()}}>DODAJ</Text>
                </View>
              </View>
                
              </TouchableOpacity>

            </View>

            </ScrollView>
        </SafeAreaProvider>

      </ImageBackground>
      
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default AddGlycemicIndex;


const styles = StyleSheet.create({
  btnModal: {
    padding: spacing.SCALE_10,
    width: Dimensions.get('window').width-12,
    borderRadius: 10,
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
    marginHorizontal: spacing.SCALE_8
  }
})