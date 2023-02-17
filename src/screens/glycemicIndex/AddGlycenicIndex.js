import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { TextInput, Modal, Portal, Provider } from 'react-native-paper';
import { colors, spacing } from '../../styles';
import { ScrollView } from 'react-native-gesture-handler';
import { UNIT } from '../../styles/units';
import { useTranslation } from 'react-i18next';

const AddGlycemicIndex = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('GlycemicIndex');
  const {t, i18n} = useTranslation();
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
  const [witB2Ryboflawina, setWitB2Ryboflawina] = useState('');
  const [witB3Niacyna, setWitB3Niacyna] = useState('');
  const [witB5KwasPantotenowy, setWitB5KwasPantotenowy] = useState('');
  const [witB6, setWitB6] = useState('');
  const [witB9KwasFoliowy, setWitB9KwasFoliowy] = useState('');
  const [witB12, setWitB12] = useState('');
  const [witC, setWitC] = useState('');
  const [witE, setWitE] = useState('');
  const [witK, setWitK] = useState('');
  const [wapn, setWapn] = useState('');
  const [magnez, setMagnez] = useState('');
  const [fosfor, setFosfor] = useState('');
  const [potas, setPotas] = useState('');
  const [sod, setSod] = useState('');
  const [miedz, setMiedz] = useState('');
  const [zelazo, setZelazo] = useState('');
  const [mangan, setMangan] = useState('');
  const [selen, setSelen] = useState('');
  const [cynk, setCynk] = useState('');
  const [status, setStatus] = useState('');
  

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
      WitB2Ryboflawina: !witB2Ryboflawina ? 0 : parseFloat(witB2Ryboflawina),
      WitB3Niacyna: !witB3Niacyna ? 0 : parseFloat(witB3Niacyna),
      WitB5KwasPantotenowy: !witB5KwasPantotenowy ? 0 : parseFloat(witB5KwasPantotenowy),
      WitB6: !witB6 ? 0 : parseFloat(witB6),
      WitB9KwasFoliowy: !witB9KwasFoliowy ? 0 : parseFloat(witB9KwasFoliowy),
      WitB12: !witB12 ? 0 : parseFloat(witB12),
      WitC: !witC ? 0 : parseFloat(witC),
      WitE: !witE ? 0 : parseFloat(witE),
      WitK: !witK ? 0 : parseFloat(witK),
      Wapn: !wapn ? 0 : parseFloat(wapn),
      Magnez: !magnez ? 0 : parseFloat(magnez),
      Fosfor: !fosfor ? 0 : parseFloat(fosfor),
      Potas: !potas ? 0 : parseFloat(potas),
      Sod: !sod ? 0 : parseFloat(sod),
      Miedz: !miedz ? 0 : parseFloat(miedz),
      Zelazo: !zelazo ? 0 : parseFloat(zelazo),
      Mangan: !mangan ? 0 : parseFloat(mangan),
      Selen: !selen ? 0 : parseFloat(selen),
      Cynk: !cynk ? 0 : parseFloat(cynk),
      Status: !status ? 0 : parseInt(status)
    })
    .then(() => {
      console.log('Product Added');
      ToastAndroid.show(t('addGlycemicIndex.modal.add-product'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
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

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20, justifyContent: 'flex-start' };
  
  return (
    <Provider>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('addGlycemicIndex.title')} />
       <Appbar.Action icon="information" onPress={showModal}  />
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
            label={t('addGlycemicIndex.value.name')}
            value={name}
            onChangeText={(txt) => setName(txt)}
            style={styles.textInput}
          />

          <View style={{marginBottom: spacing.SCALE_8}}></View>
          <TextInput
           underlineColor={colors.COLORS.LIGHT_GREY}
           activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('addGlycemicIndex.value.category')}
            value={category}
            onChangeText={(txt) => setCategory(txt)}
            style={styles.textInput}
          />

          <View style={{flexDirection: 'row', marginTop: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: 4}}>
              <TextInput
               underlineColor={colors.COLORS.LIGHT_GREY}
               activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.glycemic-index')}
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
                label={t('addGlycemicIndex.value.kcal')}
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
                label={t('addGlycemicIndex.value.protein') + ' [' + UNIT.GR + ']'}
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
                label={t('addGlycemicIndex.value.fat') + ' [' + UNIT.GR + ']'}
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
                label={t('addGlycemicIndex.value.carbs') + ' [' + UNIT.GR + ']'}
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
                label={t('addGlycemicIndex.value.fiber') + ' [' + UNIT.GR + ']'}
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
                label={t('addGlycemicIndex.value.sugar') + ' [' + UNIT.GR + ']'}
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
                label={t('addGlycemicIndex.value.cholesterol') + ' [' + UNIT.GR + ']'}
                value={cholesterol}
                onChangeText={(txt) => setCholesterol(txt)}
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
                label={t('addGlycemicIndex.value.beta-caroten') + ' [' + UNIT.UG + ']'}
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
                label={t('addGlycemicIndex.value.luteina') + ' [' + UNIT.UG + ']'}
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
                label={t('addGlycemicIndex.value.witB1') + ' [' + UNIT.MG + ']'}
                value={witB1Tiamina}
                onChangeText={(txt) => setWitB1Tiamina(txt)}
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
                value={witB2Ryboflawina}
                onChangeText={(txt) => setWitB2Ryboflawina(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB3') + ' [' + UNIT.MG + ']'}
                value={witB3Niacyna}
                onChangeText={(txt) => setWitB3Niacyna(txt)}
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
                value={witB5KwasPantotenowy}
                onChangeText={(txt) => setWitB5KwasPantotenowy(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB6') + ' [' + UNIT.MG + ']'}
                value={witB6}
                onChangeText={(txt) => setWitB6(txt)}
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
                value={witB9KwasFoliowy}
                onChangeText={(txt) => setWitB9KwasFoliowy(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witB12') + ' [' + UNIT.UG + ']'}
                value={witB12}
                onChangeText={(txt) => setWitB12(txt)}
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
                value={witC}
                onChangeText={(txt) => setWitC(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.witE') + ' [' + UNIT.MG + ']'}
                value={witE}
                onChangeText={(txt) => setWitE(txt)}
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
                value={witK}
                onChangeText={(txt) => setWitK(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              
              </View>
            </View>

            <View style={{backgroundColor: colors.COLORS.LIGHT_BLUE, padding: spacing.SCALE_5, alignItems: 'center', borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
              <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>{t('addGlycemicIndex.title-macronutrients')}</Text>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.wapn') + ' [' + UNIT.MG + ']'}
                value={wapn}
                onChangeText={(txt) => setWapn(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.magnez') + ' [' + UNIT.MG + ']'}
                value={magnez}
                onChangeText={(txt) => setMagnez(txt)}
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
                value={fosfor}
                onChangeText={(txt) => setFosfor(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.potas') + ' [' + UNIT.MG + ']'}
                value={potas}
                onChangeText={(txt) => setPotas(txt)}
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
                value={sod}
                onChangeText={(txt) => setSod(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              
              </View>
            </View>

            <View style={{backgroundColor: colors.COLORS.LIGHT_BLUE, padding: spacing.SCALE_5, alignItems: 'center', borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
              <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold'}}>{t('addGlycemicIndex.title-micronutrients')}</Text>
            </View>

            <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_8}}>
            <View style={{flex: 1, marginRight: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.miedz') + ' [' + UNIT.MG + ']'}
                value={miedz}
                onChangeText={(txt) => setMiedz(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.zelazo') + ' [' + UNIT.MG + ']'}
                value={zelazo}
                onChangeText={(txt) => setZelazo(txt)}
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
                value={mangan}
                onChangeText={(txt) => setMangan(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('addGlycemicIndex.value.selen') + ' [' + UNIT.UG + ']'}
                value={selen}
                onChangeText={(txt) => setSelen(txt)}
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
                value={cynk}
                onChangeText={(txt) => setCynk(txt)}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={{flex: 1, marginLeft: spacing.SCALE_4}}>
              
              </View>
            </View>

            <View style={{backgroundColor: colors.COLORS.LIGHT_GREY, padding: spacing.SCALE_5, alignItems: 'flex-start', borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{t('addGlycemicIndex.text.title')}</Text>
              <Text style={{color: colors.TEXT.DEEP_BLUE}}>{t('addGlycemicIndex.text-1')}</Text>
            </View>

            <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label="Status"
            value={status}
            onChangeText={(txt) => setStatus(txt)}
            style={styles.textInput}
          />


            <View style={{alignItems: 'center', marginTop: spacing.SCALE_6, marginBottom: spacing.SCALE_10}}>
            <TouchableOpacity onPress={() => {handleAdd(); toggleLoading(true)}} style={[styles.btnModal, {backgroundColor: getBackGroundColor()}]} disabled={!emptyBtn}>

              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: spacing.SCALE_10}}>
                  { isLoading && <ActivityIndicator size="small" color={colors.TEXT.WHITE} /> }
                </View>
                <View>
                  <Text style={{color: getColor()}}>{t('addGlycemicIndex.btn.add')}</Text>
                </View>
              </View>
                
              </TouchableOpacity>

            </View>

            </ScrollView>
        </SafeAreaProvider>

      </ImageBackground>
      
    </ImageBackground>
    <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          
          <View>
            <Text style={{fontWeight: 'bold', color: colors.TEXT.DEEP_BLUE, textTransform: 'uppercase'}}>{t('addGlycemicIndex.modal.information')}</Text>
            <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.text-1')}</Text>
              
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.textModalColor}>{'\u2B24'}</Text>
                </View>
                <View style={{marginLeft: spacing.SCALE_6}}>
                  <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.glyceminc-index')},</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.textModalColor}>{'\u2B24'}</Text>
                </View>
                <View style={{marginLeft: spacing.SCALE_6}}>
                  <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.calories')},</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.textModalColor}>{'\u2B24'}</Text>
                </View>
                <View style={{marginLeft: spacing.SCALE_6}}>
                  <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.carbs')},</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.textModalColor}>{'\u2B24'}</Text>
                </View>
                <View style={{marginLeft: spacing.SCALE_6}}>
                  <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.fiber')},</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.textModalColor}>{'\u2B24'}</Text>
                </View>
                <View style={{marginLeft: spacing.SCALE_6}}>
                  <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.protein')},</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.textModalColor}>{'\u2B24'}</Text>
                </View>
                <View style={{marginLeft: spacing.SCALE_6}}>
                  <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.fat')}.</Text>
                </View>
              </View>

            {/* <Text>{t('addGlycemicIndex.modal.text-2')}</Text> */}
          </View>
          <View style={{marginTop: spacing.SCALE_6}}>
            
            <Text style={styles.textModalColor}>{t('addGlycemicIndex.modal.text')}</Text>
          </View>
        </Modal>
      </Portal>
    </SafeAreaProvider>
    </Provider>
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
  },
  textModalColor: {
    color: colors.TEXT.DEEP_BLUE
  }
})