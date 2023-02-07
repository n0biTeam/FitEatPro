import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions, ToastAndroid, ActivityIndicator, Pressable } from 'react-native'
import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../../navigation/AuthProvider';
import { Appbar, Provider as PaperProvider, Modal, Portal, Button, TextInput, DefaultTheme } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import CircularProgress from 'react-native-circular-progress-indicator';
import BigList from "react-native-big-list";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.DEEP_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const DiaryItemScreen = ({ route, navigation }) => {

    const itemId = route.params.itemId;
    const {t, i18n} = useTranslation();

    const {user} = useContext(AuthContext); 
    const [diaryData, setDiaryData] = useState([]);
    const [title, setTitle] = useState(title);

    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const showModal2 = () => setVisible2(true);
    const hideModal2 = () => setVisible2(false);

    const [changeTitle, setChangeTitle] = useState('');
    const [initialItem, setInitialItem] = useState(0);

    const [number, onChangeNumber] = useState(null);

    const emptyBtn = (number != null & number != '');
    const emptyBtnTitle = (changeTitle != null & changeTitle != '');

    const handleTitle = async () => {
      await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('diary')
      .doc(itemId)
      .update({
       title: changeTitle,
      })
      .then(() => {
        console.log('Title updated!');
        ToastAndroid.show('Tytuł zmieniony', ToastAndroid.LONG, ToastAndroid.BOTTOM);
        setVisible(false);
        //navigation.navigate('DiaryItemScreen');
      });
    }

    useEffect(() => {
        getItemDiary();
      }, []);

    const getItemDiary = async () => {
        await firestore().collection('users').doc(user.uid).collection('diary').doc(itemId)
          .get()
          .then(doc => {
             // const diaryData = [];
           
                   setTitle(doc.data().title);

                  
                  // console.log(doc.data().title);
                },
                  error => {
                   console.log(error)
                }
            
          )
      };
     
    const [mealData, setMealData] = useState([]);
    const [sumGramma, setSumGramma] = useState(0);
    const [total, setTotal] = useState(0);
    const [ladunek, setLadunek] = useState(0);
    const [sumKcal, setSumKcal] = useState(0);
    const [sumProtein, setSumProtein] = useState(0);
    const [sumCarbs, setSumCarbs] = useState(0);
    const [sumCholesterol, setSumCholesterol] = useState(0);
    const [sumFat, setSumFat] = useState(0);
    const [sumFiber, setSumFiber] = useState(0);
    const [sumSugar, setSumSugar] = useState(0);

    let [stateIG, setStateIG] = useState(0);

    
     
      const getMealList = async () => {

        await firestore().collection('users').doc(user.uid).collection('diary').doc(itemId).collection('data')
            .orderBy('name', 'asc')
            .get()
            .then(querySnapshot => {
               
               const mealData = [];
               let totalGramme = 0;
               let totalPrzyswajalne = 0;
               let total = 0;
               let lg = 0;
               let totalKacl = 0;
               let totalProtein = 0;
               let totalCarbs = 0;
               let totalChlesterol = 0;
               let totalFat = 0;
               let totalFiber = 0;
               let totalSugar = 0;
    
                  querySnapshot.forEach(doc1 => {
                    totalPrzyswajalne += doc1.data().carbs - doc1.data().fiber;
                  });
                                    
                    querySnapshot.forEach(doc => {
                    
                    mealData.push({...doc.data(), id: doc.id});
    
                    totalGramme += doc.data().quantity;
    
                    totalKacl += doc.data().kcal;
    
                    totalProtein +=doc.data().protein; 
    
                    totalCarbs +=doc.data().carbs; 
    
                    totalChlesterol +=doc.data().cholesterol;
    
                    totalFat +=doc.data().fat;
    
                    totalFiber +=doc.data().fiber;
    
                    totalSugar +=doc.data().sugar;
    
    
    
                    //totalPrzyswajalne += doc.data().carbs - doc.data().fiber;
    
                    total += ( (((doc.data().carbs - doc.data().fiber)*100)/totalPrzyswajalne) * doc.data().glycemicIndex )/100;
                    //total += ( (((doc.data().carbs - doc.data().fiber)*100)/totalPrzyswajalne) * doc.data().glycemicIndex )/100;
                    //console.log(doc.data().quantity/100);
    
                    lg += ((doc.data().carbs-doc.data().fiber)*doc.data().glycemicIndex)/100;
                    
                   
                  });
                  //console.log(mealData);
                  //console.log('---');
                                
                    setSumGramma(totalGramme);
                    setSumKcal(totalKacl);
                    setSumProtein(totalProtein);
                    setSumCarbs(totalCarbs);
                    setSumCholesterol(totalChlesterol);
                    setSumFat(totalFat);
                    setSumProtein(totalProtein);
                    setSumFiber(totalFiber);
                    setSumSugar(totalSugar);
                    setMealData(mealData);
                    setLadunek(Number(lg));
                    setTotal(Number(total));
                    
                   
                  },
                    error => {
                     console.log(error)
                  }
              
            )
      };
     

    useEffect(()  => {
      getMealList();
      getGlycemicIndex();
    }, [mealData]);

      /**
   * 
   * @param {float} number 
   * @returns 
   */
  function obliczLG(number){
    
    if(number === null){
      const result = (((initialItem.carbs - initialItem.fiber)*initialItem.index_glycemic)/initialItem.grammage);
      return result;
    }else{
      const num2 = number/100;
      const result = ((((initialItem.carbs - initialItem.fiber)*initialItem.index_glycemic)/initialItem.grammage)*num2);
      return result;
    }
 }

    const colorFirst = (total) => {
      let color;
      if(total <= 50){
        color = colors.COLORS.GREEN;
      } else if ((total >= 51) && (total <= 71)){
        color = colors.COLORS.YELLOW;
      }else {
        color = colors.COLORS.RED;
      }
      return color;
  }
  
  const colorLG = (ladunek) => {
    let color;
    if(ladunek <= 10.00){
      color = colors.COLORS.GREEN;
    } else if ((ladunek >= 10.01) && (ladunek <= 19)){
      color = colors.COLORS.YELLOW;
    }else {
      color = colors.COLORS.RED;
    }
    return color;
  }
  
  const _goBack = () => navigation.navigate('DiaryScreen');

  const handeDelete = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('diary')
    .doc(itemId)
    .collection('data')
    .get()
    .then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
    });
          
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('diary')
    .doc(itemId)
    .delete()
    .then(() => {
      console.log('Product deleted!');
      //Alert.alert('Produkt usunięty');
      ToastAndroid.show('Usunięto posiłek', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('DiaryScreen');
    });
  }

  /**
  * 
  * @param {float} number 
  * @returns 
  */
   function obliczWW(number)
   {
      if(number === null){
          const result = (((sumCarbs - sumFiber)*1)/10);
          return result;
      }else{
          const wartosc = number/100;
          const result = ((((sumCarbs - sumFiber)*wartosc)*1)/10);
          return result;
      }
   }
   /**
    * 
    * @param {float} number 
    * @returns 
    */
   function obliczWBT(number)
   {
      if(number === null){
          const result = (sumKcal - (sumProtein*4 + sumFat*9))/100;
          return result;
      }else{
          const wartosc = number/100;
          const result = ((sumKcal*wartosc) - ((sumProtein*4 + sumFat*9)*wartosc))/100;
          return result;
      }
   }

   const getGlycemicIndex = async () => {
    
    await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('diary')
          .doc(itemId)
          .get()
          .then(doc => {
              if (doc && doc.exists) {
                  setStateIG(doc.data().indexGlycemic);
             }
          });
};
  


 

const handleUpdate2 = async () => {
        
   await firestore()
  .collection('users')
  .doc(user.uid)
  .collection('diary')
  .doc(itemId)
  .update({
    gramme: sumGramma,
    indexGlycemic: total,
    loadGlycemic: ladunek,
    sumKcal: sumKcal
  }).then(() => {
   // console.log('Product Update');
    setVisible2(false);
    //ToastAndroid.show('Zaktualizowano', ToastAndroid.LONG, ToastAndroid.BOTTOM);
    //navigation.navigate('DiaryItemScreen')
    onChangeNumber(null);

   });

}

    useEffect(() => {
    handleUpdate2(initialItem)
}, [total, sumGramma, ladunek, sumKcal]);

   //console.log(stateIG);
   const handleUpdate = async (initialItem) => {
   //console.log(initialItem)
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('diary')
    .doc(itemId)
    .collection('data')
    .doc(initialItem.id)

    .update({
      quantity: number != null ? parseInt(number) : parseInt(initialItem.quantity),
      carbs: number != null ? parseFloat(initialItem.carbs)*(number/initialItem.quantity) : parseFloat(initialItem.carbs),
      fiber: number != null ? parseFloat(initialItem.fiber)*(number/initialItem.quantity) : parseFloat(initialItem.fiber),
      protein: number != null ? parseFloat(initialItem.protein)*(number/initialItem.quantity) : parseFloat(initialItem.protein),
      fat: number != null ? parseFloat(initialItem.fat)*(number/initialItem.quantity) : parseFloat(initialItem.fat),
      cholesterol: number != null ? parseFloat(initialItem.cholesterol)*(number/initialItem.quantity) : parseFloat(initialItem.cholesterol),
      sugar: number != null ? parseFloat(initialItem.sugar)*(number/initialItem.quantity) : parseFloat(initialItem.sugar),
      kcal: number != null ? parseFloat(initialItem.kcal)*(number/initialItem.quantity) : parseFloat(initialItem.kcal),
    })
    .then(() => {
      console.log('Product Update');
      setVisible2(false);
      ToastAndroid.show(t('diaryItemScreen.toast-updated'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      //navigation.navigate('DiaryItemScreen')
      onChangeNumber(null);

     });
    
 }

 const handleDeleteItem = async (item) => {
  await firestore()
  .collection('users')
  .doc(user.uid)
  .collection('diary')
  .doc(itemId)
  .collection('data')
  .doc(item)
  .delete()
  .then(() => {
    console.log('Product deleted!');
    //Alert.alert('Produkt usunięty');
    ToastAndroid.show(t('diaryItemScreen.toast-product-removed'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
    //navigation.navigate('MealScreen');
  });
  //console.log(item);
}

const imageBG = require('../../assets/images/talerz.jpg');
   
  
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={changeTitle ? changeTitle : title} />
       <Appbar.Action icon="square-edit-outline" onPress={() => {
                          setVisible(true);
                         }} />
       <Appbar.Action icon="trash-can" onPress={handeDelete} />
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
        opacity: 0.5
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
         <View style={{ marginHorizontal: spacing.SCALE_6, flex: 1 }}>
          <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginRight: spacing.SCALE_3, elevation: 3}}>
          <CircularProgress
              value={total}
              radius={30}
              maxValue={110}
              inActiveStrokeOpacity={0.8}
              activeStrokeWidth={12}
              inActiveStrokeWidth={12}
              progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_15 }}
              activeStrokeColor={colorFirst(total)}
              inActiveStrokeColor={colors.COLORS.GREY_CCC}
              duration={1000}
              dashedStrokeConfig={{
                count: 32,
                width: 5,
              }}
              progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(1);
              }}
            />
           
                  <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('diaryItemScreen.meal-index')}</Text>
          </View>

          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginLeft: spacing.SCALE_3, elevation: 3}}>
          <CircularProgress
              value={ladunek}
              radius={30}
              maxValue={ladunek >= 20 ? ladunek : 20}
              inActiveStrokeOpacity={0.8}
              activeStrokeWidth={12}
              inActiveStrokeWidth={12}
              progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_15 }}
              activeStrokeColor={colorLG(ladunek)}
              inActiveStrokeColor={colors.COLORS.GREY_CCC}
              duration={1000}
              dashedStrokeConfig={{
                count: 32,
                width: 5,
              }}
              progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(1);
              }}
            />
        
            
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('diaryItemScreen.meal-load')}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: spacing.SCALE_6}}>
        <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginRight: spacing.SCALE_3, elevation: 5}}>
          
              <CircularProgress
                value={obliczWW(number)}
                radius={30}
                maxValue={20}
                inActiveStrokeOpacity={0.8}
                activeStrokeWidth={12}
                inActiveStrokeWidth={12}
                progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_15 }}
                activeStrokeColor={colors.COLORS.DEEP_BLUE}
                inActiveStrokeColor={colors.COLORS.GREY_CCC}
                duration={1000}
                dashedStrokeConfig={{
                  count: 32,
                  width: 5,
                }}
                progressFormatter={(value, total) => {
                  'worklet';   
                  return value.toFixed(1);
                }}
              />

          
                  <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: 5}}>{t('diaryItemScreen.exchanger')}</Text>
                  <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE}}>{t('diaryItemScreen.carbohydrate')}</Text>
          </View>

          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginLeft: spacing.SCALE_3, elevation: 3}}>
          <CircularProgress
              value={obliczWBT(number)}
              radius={30}
              maxValue={ladunek >= 20 ? ladunek : 20}
              inActiveStrokeOpacity={0.8}
              activeStrokeWidth={12}
              inActiveStrokeWidth={12}
              progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_15 }}
              activeStrokeColor={colors.COLORS.DEEP_BLUE}
              inActiveStrokeColor={colors.COLORS.GREY_CCC}
              duration={1000}
              dashedStrokeConfig={{
                count: 32,
                width: 5,
              }}
              progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(1);
              }}
            />
        
            
              <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('diaryItemScreen.exchanger')}</Text>
              <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE}}>{t('diaryItemScreen.protein-fat')}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginTop: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, padding: spacing.SCALE_3, elevation: 3, flexDirection: 'row', marginRight: spacing.SCALE_3}}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE}}>{t('diaryItemScreen.meal-weight')} </Text>
              </View>
              <View>
                <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold', fontSize: typography.FONT_SIZE_18}}>
                  {sumGramma} <Text>{UNIT.GR}</Text></Text>
                  <Text style={{fontSize: typography.FONT_SIZE_10}}>{(sumGramma / 28.34952).toFixed(3)} {UNIT.OZ}</Text>
              </View>
            </View>

            <View style={{flex: 1, marginTop: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, padding: spacing.SCALE_5, elevation: 3, marginLeft: spacing.SCALE_3, justifyContent: 'center'}}>
              <View style={{alignItems: 'center'}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold', fontSize: typography.FONT_SIZE_18}}>{sumKcal} kcal / {(sumKcal*4.184).toFixed(0)} kJ</Text>
              </View>
            </View>
          </View>

          <View style={{marginTop: spacing.SCALE_6, flexDirection: 'row', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, elevation: 3, paddingVertical: spacing.SCALE_5}}>
           
              <View style={{flexDirection: 'row', flex: 1}}>
                <View style={{flex: 1, marginLeft: spacing.SCALE_5}}>
                    <Text style={styles.textContainer}>{t('value.carbohydrates')}</Text>
                    <Text style={styles.textContainer}>{t('value.protein')}</Text>
                    <Text style={styles.textContainer}>{t('value.fat')}</Text>
                    
                </View>

                <View style={{alignItems: 'flex-end', marginRight: spacing.SCALE_5}}>
                    <Text style={styles.textContainer}>
                      <Text style={{fontWeight: 'bold'}}>{(sumCarbs).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} |</Text>
                      <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}> {(sumCarbs / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                      </Text>
                    </Text>

                    <Text style={styles.textContainer}>
                    <Text style={{fontWeight: 'bold'}}>{(sumProtein).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} |</Text>
                      <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}> {(sumProtein / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                      </Text>
                    </Text>

                    <Text style={styles.textContainer}>
                    <Text style={{fontWeight: 'bold'}}>{(sumFat).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} |</Text>
                      <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}> {(sumFat / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                      </Text>
                    </Text>

                    {/* <Text style={styles.textContainer}>{(sumProtein).toFixed(1)}</Text> */}
                    {/* <Text style={styles.textContainer}>{(sumFat).toFixed(1)}</Text> */}
                    
                </View>
              </View>

              <View style={{flexDirection: 'row', flex: 1, marginLeft: spacing.SCALE_5}}>
                
                <View style={{flex: 1, marginLeft: spacing.SCALE_5}}>
                    <Text style={styles.textContainer}>{t('value.fiber')}</Text>
                    <Text style={styles.textContainer}>{t('value.cholesterol')}</Text>
                    <Text style={styles.textContainer}>{t('value.sugar')}</Text>
                </View>

                <View style={{alignItems: 'flex-end', paddingRight: spacing.SCALE_5}}>
                    <Text style={styles.textContainer}>
                      <Text style={{fontWeight: 'bold'}}>{(sumFiber).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} /</Text>
                      <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}> {(sumFiber / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                      </Text>
                    </Text>

                    <Text style={styles.textContainer}>
                      <Text style={{fontWeight: 'bold'}}>{(sumCholesterol).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} /</Text>
                      <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}> {(sumCholesterol / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                      </Text>
                    </Text>

                    <Text style={styles.textContainer}>
                      <Text style={{fontWeight: 'bold'}}>{(sumSugar).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} /</Text>
                      <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}> {(sumSugar / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                      </Text>
                    </Text>

                    {/* <Text style={styles.textContainer}>{(sumFiber).toFixed(1)}</Text> */}
                    {/* <Text style={styles.textContainer}>{(sumCholesterol).toFixed(1)}</Text>
                    <Text style={styles.textContainer}>{(sumSugar).toFixed(1)}</Text> */}
                </View>
               
              </View>
              </View>

        <View style={{flex: 1}}>
            <View style={{marginTop: spacing.SCALE_6, alignItems: 'center', backgroundColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_8, marginBottom: spacing.SCALE_6, borderRadius: 5, elevation: spacing.SCALE_3}}>
              <Text style={{ color: colors.TEXT.WHITE, fontWeight: 'bold', textTransform: 'uppercase', fontSize: typography.FONT_SIZE_18 }}>{t('diaryItemScreen.product-list')}</Text>
            </View>
            { 
              mealData.length > 0 ?
              (
                <BigList 
               
                    data={mealData}
                    onEndReachedThreshold={1}
                    itemHeight={50}
                    renderItem={({item, index}) => (
                      
                      <View style={{flex: 1, flexDirection: 'row', padding: spacing.SCALE_5, backgroundColor: colors.COLORS.WHITE, marginBottom: spacing.SCALE_4, borderRadius: 5, elevation: 3 }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <Text numberOfLines={1} style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_14, textTransform: 'uppercase', fontWeight: 'bold'}}>{item.name}</Text>

                      </View>
                     
                  
                      <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
                      
                        <Pressable style={{marginLeft: spacing.SCALE_10, flexDirection: 'row'}} 
                        
                        onPress={() => {
                          //handleItem(item.id);
                          setInitialItem(item);
                          setVisible2(true);
                          //onChangeNumber(null);
                         }}
                        >
                            <View style={{flexDirection: 'column', justifyContent: 'center', marginRight: spacing.SCALE_6}}>
                              <View style={{marginRight: spacing.SCALE_10, alignItems: 'center'}}> 
                                <Text style={{fontSize: typography.FONT_SIZE_14, color: colors.TEXT.DEEP_BLUE}}>{item.quantity} {UNIT.GR}</Text>
                              </View>
                              <View style={{marginRight: spacing.SCALE_10, alignItems: 'center'}}>
                                <Text style={{fontSize: typography.FONT_SIZE_9}}>
                                  {(item.quantity / 28.34952).toFixed(3)} {UNIT.OZ}
                                </Text>
                              </View>
                            </View>
                          
                            <View style={{justifyContent: 'center'}}>
                              <MaterialCommunityIcons name="square-edit-outline" size={spacing.SCALE_24} color={colors.COLORS.DEEP_BLUE} />
                            </View>
                        </Pressable>
                      </View>
                        
                      { 
                      mealData.length !== 1 ?
                        (
                        <View style={{alignItems: 'flex-end', justifyContent: 'center', marginRight: spacing.SCALE_5, marginLeft: spacing.SCALE_10}}>
                          <Pressable style={{marginLeft: spacing.SCALE_10}} onPress={() => handleDeleteItem(item.id)}>
                              <MaterialCommunityIcons name="trash-can" size={spacing.SCALE_24} color={colors.COLORS.RED}/>
                          </Pressable>
                        </View>
                        ) : (
                          ''
                        ) 
                      }
                      </View>
        
                    )}
                />
                ) : ( 
                   <ActivityIndicator size="large" color={colors.COLORS.DEEP_BLUE} />
                  // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  //   <Text style={{color: '#224870', fontSize: 20, fontWeight: 'bold'}}>Lista pusta. Dodaj produkty</Text>
                  // </View>
                )}
                
                <View style={{marginBottom: spacing.SCALE_6}}></View>
                </View>

        </View>

      <Portal>

      <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={styles.containerStyle}>
                              <View initialItem={initialItem} style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, marginBottom: spacing.SCALE_6}}>{initialItem.name}</Text>
                                <TextInput 
                                  placeholder={parseInt(initialItem.quantity).toString()}
                                  keyboardType="numeric"
                                  label={t('diaryItemScreen.modal-enter-quantity')}
                                  //value={parseInt(dataMeal.quantity).toString()}
                                  value={number}
                                  //onChangeText={onChangeNumber}
                                  underlineColor={colors.COLORS.LIGHT_GREY}
                                  activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                                  onChangeText={onChangeNumber}
                                  //onChangeText={(txt) => setDataMeal({...dataMeal, quantity: txt})}
                                  style={styles.btnTextInput}
                                />

                                <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
                                
                                 
                                  <Button 
                                    disabled={!emptyBtn}
                                    mode="contained" 
                                    onPress={() => {
                                      handleUpdate(initialItem);
                                      handleUpdate2(initialItem);
                                    }} 
                                   // style={{width: 330}}
                                    buttonColor={colors.COLORS.DEEP_BLUE}
                                  >
                                    ZAPISZ
                                  </Button>
                              
                                </View>
                              </View>
                        </Modal>

        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                              <View initialItem={initialItem} style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_14, marginBottom: spacing.SCALE_6}}>{t('diaryItemScreen.rename-the-list')}</Text>
                                <TextInput 
                                  //placeholder='Tytuł'
                                  //keyboardType="numeric"
                                  label={t('diaryItemScreen.modal-enter-the-name')}
                                  //value={parseInt(dataMeal.quantity).toString()}
                                  value={changeTitle}
                                  //onChangeText={onChangeNumber}
                                  underlineColor={colors.COLORS.LIGHT_GREY}
                                  activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                                  onChangeText={setChangeTitle}
                                  //onChangeText={(txt) => setDataMeal({...dataMeal, quantity: txt})}
                                  style={styles.btnTextInput}
                                />

                                <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
                                
                                  <Button 
                                    disabled={!emptyBtnTitle}
                                    mode="contained" 
                                    onPress={() => {
                                      handleTitle()
                                    }} 
                                    //style={{width: 330}}
                                    buttonColor={colors.COLORS.DEEP_BLUE}
                                  >
                                    {t('diaryItemScreen.update')}
                                  </Button>
                              
                                </View>
                              </View>
                        </Modal>
                      </Portal>
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>

  )
}

export default DiaryItemScreen;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white', 
    padding: spacing.SCALE_20,
    marginHorizontal: spacing.SCALE_10,
    height: 200,
    //justifyContent: 'center'

  },
  btnModal: {
    borderWidth: 0,
    padding: spacing.SCALE_10,
    width: Dimensions.get('window').width-60,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.COLORS.DEEP_BLUE,
    elevation: 3,
    marginBottom: spacing.SCALE_10,
  },
  textBtn: {
    color: colors.TEXT.WHITE
  },
  textContainer: {
    fontSize: typography.FONT_SIZE_10,
    color: colors.COLORS.DEEP_BLUE,
    textTransform: 'uppercase'
  }
})