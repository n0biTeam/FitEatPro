import { StyleSheet, Text, View, TouchableOpacity, ImageBackground,ToastAndroid, StatusBar, Dimensions } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, AnimatedFAB, DefaultTheme, Provider as PaperProvider,  Button, Modal, Portal, TextInput } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import CircularProgress from 'react-native-circular-progress-indicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BigList from "react-native-big-list";
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

const MealScreen = ({  
  route,
  navigation,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode }) => {

  const [isExtended, setIsExtended] = useState(true);
  
  const isIOS = Platform.OS === 'ios';
  
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  const {t, i18n} = useTranslation();

  const {user} = useContext(AuthContext); 
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
  const [loading, setLoading] = useState(true);

  //const [idMeal, setIdMeal] = useState('');

  const getMealList = () => {

    firestore().collection('users').doc(user.uid).collection('meal')
        .orderBy('name', 'asc')
        .onSnapshot(
           querySnapshot => {
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
              //setPrzyswajalne(totalPrzyswajalne);
              //console.log(totalPrzyswajalne);
              
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
                //console.log(mealData);
                //console.log(total);
               
              },
                error => {
                 console.log(error)
              }
          
        )
  };

 
  
  useEffect(() => {
    getMealList();
  }, []);

  const [isSwitchOn, setIsSwitchOn] = useState(null);
  const getUser = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('profil')
    .get()
    .then(( documentSnapshot ) => {
      if( documentSnapshot.exists ) {
        setIsSwitchOn(documentSnapshot.data().showOunce);
        //setDiaryUnit(documentSnapshot.data().diaryUnit);
      }
    })
  }
 
  useEffect(() => {
    getUser();
   const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
   }, [navigation, loading, isSwitchOn]);

  //console.log('switch: ' + isSwitchOn)

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


  
  //const _goBack = () => navigation.navigate('GlycemicIndex');

  
  const handleDeleteItem = async (item) => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('meal')
    .doc(item)
    .delete()
    .then(() => {
      console.log('Product deleted!');
      //Alert.alert('Produkt usunięty');
      ToastAndroid.show(t('mealScreen.toast-product-removed'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('MealScreen');
    });
    //console.log(item);
  }


  //const [number2, onChangeNumber2] = React.useState(null);
  const handleUpdate = async (initialItem) => {
  
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('meal')
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
      ToastAndroid.show(t('mealScreen.toast-quantity-updated'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      navigation.navigate('MealScreen')
      onChangeNumber(null);

     })
  }

  const [visible2, setVisible2] = React.useState(false);

  const showModal = () => setVisible2(true);
  const hideModal = () => setVisible2(false);

  const [initialItem, setInitialItem] = useState(0);
  const [number, onChangeNumber] = React.useState(null);

  const [title, setTitle] = React.useState('');

  const emptyBtn = (number != null & number != '');
  const emptyBtnTitle = (title != null & title != '');
  
 
  // const handeDeleteAll = async () => {
  //   await firestore()
  //     .collection('users')
  //     .doc(user.uid)
  //     .collection('meal')
  //     .get()
  //     .then((snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       doc.ref.delete();
  //     })
      
  //   })
  //   .then(() => {
  //     console.log('Product deleted!');
  //     //Alert.alert('Produkt usunięty');
  //     ToastAndroid.show('Usunięto posiłek', ToastAndroid.LONG, ToastAndroid.BOTTOM);
  //     //navigation.navigate('MealScreen');
  //   });
  // }

  async function handeDeleteAll() {
    // Get all users
    const mealQuerySnapshot = 
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('meal')
    .get();
  
    // Create a new batch instance
    const batch = firestore().batch();
  
    mealQuerySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref);
    });
  
    return batch.commit();
  }

 // handeDeleteAll().then(() => console.log('All users deleted in a single batch operation.'));

  const [visible3, setVisible3] = React.useState(false);

  const showModal3 = () => setVisible3(true);
  const hideModal3 = () => setVisible3(false);
  
  //const [docIdDiary, setDocIdDiary] = useState('');



  const handleTitle = async () => {

   const codeID = Date.now().toString(20) + Math.random().toString(20).substring(2);

   const titleName = title;
   const dataJson = mealData;
   
   
   const insertJson = (dataJson) => {
   
    try {
      const promises = [];
       dataJson.forEach((item) => {
         promises.push(
         firestore()
          .collection('users')
          .doc(user.uid)
          .collection('diary')
          .doc(codeID)
          .collection('data')
          .add(item));
      });
      Promise.all(promises).then((results) => {
        console.log(results.length + ' positions added');
      });
    } catch (err) {
      console.log('Error : ' + err);
    }
  }
    
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('diary')
    .doc(codeID)
    .set({
      title: titleName,
      //product: firebase.firestore.FieldValue.arrayUnion(...mealData),
      sumKcal: sumKcal,
      sumCarbs: sumCarbs,
      sumCholesterol: sumCholesterol,
      sumFat: sumFat,
      sumFiber: sumFiber,
      sumProtein: sumProtein,
      sumSugar: sumSugar,
      indexGlycemic: total,
      loadGlycemic: ladunek,
      gramme: sumGramma,
      createdAt: firestore.Timestamp.fromDate(new Date())
    })
    .then(() => {
      //setDocIdDiary('');
       insertJson(dataJson);
     }).catch((error) => {
      console.log('Error: 2' + error);
    })

    .then(() => {
      console.log('Title Added');
      ToastAndroid.show(t('mealScreen.toast-transferring'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
      setVisible3(false);
      //navigation.navigate('HomeScreen')
    })
    .then(async () => {
     handeDeleteAll();
      navigation.navigate('DiaryScreen')
    }).catch(e => {
      console.log(e);
    })

  }

  const imageBG = require('../../assets/images/talerz.jpg');
  
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    {/* <Appbar.BackAction onPress={_goBack} /> */}
       <Appbar.Content  title={t('mealScreen.meal-creator')} />
       <Appbar.Action icon="content-save" onPress={() => {
                          setVisible3(true);
                         }} />
       <Appbar.Action icon="trash-can" onPress={handeDeleteAll} />
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
    {/* <View>
      <Text>GlycemicIndex</Text>
      <Text>{productId}</Text>
    </View> */}
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

        {/* { title != null ? 
          (
        <View>
          <Text>{title}</Text>
        </View>
          ) : (
            null
          )
        } */}
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: spacing.SCALE_6, paddingVertical: spacing.SCALE_5, marginRight: spacing.SCALE_3, elevation: 3}}>
          <CircularProgress
              value={total}
              radius={spacing.SCALE_40}
              maxValue={110}
              inActiveStrokeOpacity={0.8}
              activeStrokeWidth={12}
              inActiveStrokeWidth={12}
              progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_20 }}
              activeStrokeColor={colorFirst(total)}
              inActiveStrokeColor={colors.COLORS.GREY_CCC}
              duration={5000}
              dashedStrokeConfig={{
                count: 40,
                width: 5,
              }}
              progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(1);
              }}
            />
            <Text style={{fontSize: 10, color: colors.TEXT.DEEP_BLUE, marginTop: 5}}>{t('mealScreen.meal-index')}</Text>
          </View>

          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: spacing.SCALE_5, paddingVertical: spacing.SCALE_5, marginLeft: spacing.SCALE_3, elevation: 3}}>
          <CircularProgress
              value={ladunek}
              radius={spacing.SCALE_40}
              maxValue={ladunek >= 20 ? ladunek : 20}
              inActiveStrokeOpacity={0.8}
              activeStrokeWidth={12}
              inActiveStrokeWidth={12}
              progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_20 }}
              activeStrokeColor={colorLG(ladunek)}
              inActiveStrokeColor={colors.COLORS.GREY_CCC}
              duration={5000}
              dashedStrokeConfig={{
                count: 40,
                width: 5,
              }}
              progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(1);
              }}
            />
        
            <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('mealScreen.meal-load')}</Text>
          </View>
        </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginTop: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, padding: spacing.SCALE_5, elevation: 3, flexDirection: 'row', marginRight: spacing.SCALE_3}}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE}}>{t('mealScreen.meal-weight')} </Text>
              </View>
              <View>
                <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold', fontSize: typography.FONT_SIZE_18}}>
                  {sumGramma} <Text>{UNIT.GR}</Text></Text>
                  {isSwitchOn === true &&
                  <Text style={{fontSize: typography.FONT_SIZE_10}}>{(sumGramma / 28.34952).toFixed(3)} {UNIT.OZ}</Text>
                  }
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
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} </Text>
                      {isSwitchOn === true &&
                        <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}>| {(sumCarbs / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                        </Text>
                      }
                    </Text>

                    <Text style={styles.textContainer}>
                    <Text style={{fontWeight: 'bold'}}>{(sumProtein).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} </Text>
                      {isSwitchOn === true &&
                        <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}>| {(sumProtein / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                        </Text>
                      }
                    </Text>

                    <Text style={styles.textContainer}>
                    <Text style={{fontWeight: 'bold'}}>{(sumFat).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} </Text>
                      {isSwitchOn === true &&
                        <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}>| {(sumFat / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                        </Text>
                      }
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
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} </Text>
                      {isSwitchOn === true &&
                        <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}>| {(sumFiber / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                        </Text>
                      }
                    </Text>

                    <Text style={styles.textContainer}>
                      <Text style={{fontWeight: 'bold'}}>{(sumCholesterol).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} </Text>
                      {isSwitchOn === true &&
                        <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}>| {(sumCholesterol / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                        </Text>
                      }
                    </Text>

                    <Text style={styles.textContainer}>
                      <Text style={{fontWeight: 'bold'}}>{(sumSugar).toFixed(1)}</Text>
                      <Text style={{textTransform: 'lowercase', fontWeight: 'bold'}}> {UNIT.GR} </Text>
                      {isSwitchOn === true &&
                        <Text style={{fontSize: typography.FONT_SIZE_9, color: colors.TEXT.GREY_777}}>| {(sumSugar / 28.34952).toFixed(2)} <Text style={{textTransform: 'lowercase'}}>{UNIT.OZ}</Text>
                        </Text>
                      }
                    </Text>

                    {/* <Text style={styles.textContainer}>{(sumFiber).toFixed(1)}</Text> */}
                    {/* <Text style={styles.textContainer}>{(sumCholesterol).toFixed(1)}</Text>
                    <Text style={styles.textContainer}>{(sumSugar).toFixed(1)}</Text> */}
                </View>
               
              </View>

          </View>
          
           
               
            <View style={{flex: 1}}>
            <View style={{marginTop: spacing.SCALE_6, alignItems: 'center', backgroundColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_8, marginBottom: spacing.SCALE_6, borderRadius: 5, elevation: 3}}>
              <Text style={{ color: colors.TEXT.WHITE, fontWeight: 'bold', textTransform: 'uppercase', fontSize: typography.FONT_SIZE_16 }}>{t('mealScreen.product-list')}</Text>
            </View>
            { 
              mealData.length > 0 ?
              (
                <BigList 
                    data={mealData}
                    onEndReachedThreshold={1}
                    itemHeight={45}
                    renderItem={({item, index}) => (
                      
                      <View style={{flex: 1, flexDirection: 'row', padding: spacing.SCALE_5, backgroundColor: colors.COLORS.WHITE, marginBottom: spacing.SCALE_4, borderRadius: 5, elevation: 3 }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <Text numberOfLines={1} style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_14, textTransform: 'uppercase', fontWeight: 'bold'}}>{item.name}</Text>

                      </View>
                     
                  
                      <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
                      
                        <TouchableOpacity style={{marginLeft: spacing.SCALE_10, flexDirection: 'row'}} 
                        
                        onPress={() => {
                          setInitialItem(item);
                          setVisible2(true);
                         }}
                        >
                            <View style={{flexDirection: 'column', justifyContent: 'center', marginRight: spacing.SCALE_6}}>
                              <View style={{marginRight: spacing.SCALE_10, alignItems: 'center'}}> 
                                <Text style={{fontSize: typography.FONT_SIZE_14, color: colors.TEXT.DEEP_BLUE}}>{item.quantity} {UNIT.GR}</Text>
                              </View>

                              {isSwitchOn === true &&
                              <View style={{marginRight: spacing.SCALE_10, alignItems: 'center'}}>
                                <Text style={{fontSize: typography.FONT_SIZE_9}}>
                                  {(item.quantity / 28.34952).toFixed(3)} {UNIT.OZ}
                                </Text>
                              </View>
                              }
                            </View>
                          
                            <View style={{justifyContent: 'center'}}>
                              <MaterialCommunityIcons name="square-edit-outline" size={spacing.SCALE_24} color={colors.COLORS.DEEP_BLUE} />
                            </View>
                        </TouchableOpacity>
                      </View>

                      <View style={{alignItems: 'flex-end', justifyContent: 'center', marginRight: spacing.SCALE_5, marginLeft: spacing.SCALE_5}}>
                        <TouchableOpacity style={{marginLeft: spacing.SCALE_10}} onPress={() => handleDeleteItem(item.id)}>
                            <MaterialCommunityIcons name="trash-can" size={spacing.SCALE_24} color={colors.COLORS.RED}/>
                        </TouchableOpacity>
                      </View>
                        
                        
                      </View>
        
                    )}
                />
                ) : ( 
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, fontWeight: 'bold'}}>{t('mealScreen.empty-list')}</Text>
                  </View>
                )}
                <View style={{marginBottom: spacing.SCALE_6}}></View>
                </View>
                
               

           
                    <Portal>
                          <Modal visible={visible2} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                              <View initialItem={initialItem} style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, marginBottom: spacing.SCALE_6}}>{initialItem.name} [{UNIT.GR}]</Text>
                                <TextInput 
                                  placeholder={parseInt(initialItem.quantity).toString()}
                                  keyboardType="numeric"
                                  label={t('mealScreen.modal-enter-quantity')}
                                  value={number}
                                  underlineColor={colors.COLORS.WHITE}
                                  activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                                  onChangeText={onChangeNumber}
                                  style={styles.btnTextInput}
                                />

                                <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
                                
                                  <Button 
                                    disabled={!emptyBtn} 
                                    mode='contained' onPress={() => {handleUpdate(initialItem); }} 
                                    //style={{width: 330}}
                                    buttonColor={colors.COLORS.DEEP_BLUE}
                                  >
                                    {t('mealScreen.modal-update')}
                                  </Button>
                              
                                </View>
                              </View>
                        </Modal>
                      
                          <Modal visible={visible3} onDismiss={hideModal3} contentContainerStyle={styles.containerStyle}>
                              <View initialItem={initialItem} style={{flex: 1, justifyContent: 'center'}}>
                                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_14, marginBottom: spacing.SCALE_6}}>{t('mealScreen.modal-transfer-log')}</Text>
                                <TextInput 
                                  label={t('mealScreen.modal-enter-the-name')}
                                  value={title}
                                  underlineColor={colors.COLORS.LIGHT_GREY}
                                  activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                                  onChangeText={setTitle}
                                  style={styles.btnTextInput}
                                />

                                <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
                                
                                  <Button 
                                    disabled={!emptyBtnTitle} 
                                    mode="contained" onPress={() => {handleTitle(); setTitle('');  }} 
                                    buttonColor={colors.COLORS.DEEP_BLUE}
                                  >
                                    {t('mealScreen.modal-transfer')}
                                  </Button>
                              
                                </View>
                              </View>
                        </Modal>
                      </Portal>
            
        
        </View>
        
        <AnimatedFAB
        icon={'plus'}
        label={'Dodaj'}
        //extended={isExtended}
        onPress={() => {
          navigation.navigate('GlycemicIndex');
        }}
        visible={visible}
        theme={'tertiary'}
        animateFrom={'right'}
        iconMode={'static'}

        style={[styles.fabStyle, style, fabStyle]}
      />

      

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default MealScreen;

const styles = StyleSheet.create({
  fabStyle: {
    bottom: spacing.SCALE_16,
    right: spacing.SCALE_16,
    position: 'absolute',
  },
  containerStyle: {
    backgroundColor: 'white', 
    padding: spacing.SCALE_20,
    marginHorizontal: spacing.SCALE_10,
    height: 200,
  },
  btnModal: {
    //borderWidth: 0,
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
    textTransform: 'uppercase',
    //fontWeight: 'bold'
  }
})