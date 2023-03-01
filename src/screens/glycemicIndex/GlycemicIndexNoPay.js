import React, { useCallback, useMemo, useRef, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, ImageBackground, TouchableOpacity, ToastAndroid, Animated, ActivityIndicator, TextInput } from 'react-native';
import { Searchbar, DefaultTheme, Provider as PaperProvider, Provider } from 'react-native-paper';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import MyCircle from '../../components/MyCircle';
import { MyButtonNoPay } from '../../components/MyButtonNoPay';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../../styles';
import { UNIT } from '../../styles/units';
import { ScrollView} from 'react-native-gesture-handler';
import * as RNLocalize from "react-native-localize";
import dataPL from '../../data/dataPL';
import dataEN from '../../data/dataEN';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6580805673232587/8267133529';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const lang = RNLocalize.getLocales()[0].languageCode;
let data = [];
if(lang === 'pl'){
  data = dataPL;
}else{
  data = dataEN;
}

  const GlycemicIndex = ({ navigation }) => {

    const {t, i18n} = useTranslation();
    const {user} = useContext(AuthContext);
    const [switchSort, setSwitchSort] = useState('2');
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([...data.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })]);
    const [masterDataSource, setMasterDataSource] = useState([...data]);

    const [dataMeal, setDataMeal] = useState([]);
     
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

   // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['73%', '100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  
  const [indx, setIndx] = useState(0);

  const handleSheetChanges = useCallback((index) => {
  
    console.log('handleSheetChanges', index);
  }, []);


   const getDataMeal = () => {
    firestore().collection('users').doc(user.uid).collection('meal')
        .orderBy('name', 'asc')
        .onSnapshot(
           querySnapshot => {
           const mealData = [];
 
               querySnapshot.forEach(doc => {
                
                mealData.push({...doc.data()});
               
              });
              setDataMeal(mealData);
              },
                error => {
                 console.log(error)
              }
          
        )
  }

  useEffect(() => {
    getDataMeal();
  },[]);
           
    useEffect(() => {
      setFilteredDataSource([...data]);
      setMasterDataSource([...data]);
    }, []);
    
    const sortListASC = () => {
      filteredDataSource.sort((obj1, obj2) => {
        return obj1.index_glycemic - obj2.index_glycemic;
      });
      setMasterDataSource([...data]);
    };
    
    const sortListDES = () => {
      filteredDataSource.sort((obj1, obj2) => {
        return obj2.index_glycemic - obj1.index_glycemic;
      });
      setMasterDataSource([...data]);
    };
    
    const sortListAlfaASC = () => {
        filteredDataSource.sort((obj1, obj2) => {
        return obj1.name.localeCompare(obj2.name)
      });
      setMasterDataSource([...data]);
    };
    
    const sortListAlfaDES = () => {
      filteredDataSource.sort((obj1, obj2) => {
      return obj2.name.localeCompare(obj1.name)
    });
    setMasterDataSource([...data]);
    };
    
     
     const searchFilterFunction = (text) => {
     
      if (text) {
        const newData = masterDataSource.filter(
          function (item) {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        
        setFilteredDataSource(masterDataSource);
        setSearch(text);
      }
    };

    const addMeal = async () => {
      await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('meal')
      .add({
        name: initialItem.name,
        quantity: number != undefined ? parseInt(number) : 100, //ilosc gram
        kcal: number != undefined ? parseInt(initialItem.kcal/(100/number)) : parseInt(initialItem.kcal),
        glycemicIndex: parseInt(initialItem.index_glycemic),
        protein: parseFloat(initialItem.protein),
        fat: parseFloat(initialItem.fat),
        carbs: number != undefined ? parseFloat(initialItem.carbs/(100/number)) : parseFloat(initialItem.carbs),
        fiber: number != undefined ? parseFloat(initialItem.fiber/(100/number)) : parseFloat(initialItem.fiber),
        sugar: parseFloat(initialItem.Sugars),
        cholesterol: parseFloat(initialItem.choresterol),
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log('Product Added list meal');
        ToastAndroid.show(t('glycemicIndex.toast-add'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
        bottomSheetModalRef.current.close();
      })
    }
   
    
    const _goBack = () => navigation.goBack();
    const refRBSheet = useRef();
    const [isOpen, setIsOpen] = useState(true);
    const [initialItem, setInitialItem] = useState('');
    const [number, onChangeNumber] = React.useState(null);
    const heightMidal = (Dimensions.get('window').height);
    

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

 /**
  * 
  * @param {float} number 
  * @returns 
  */
  function obliczWW(number)
  {
     if(number === null){
         const result = (((initialItem.carbs - initialItem.fiber)*1)/10);
         return result;
     }else{
         const wartosc = number/100;
         const result = ((((initialItem.carbs - initialItem.fiber)*wartosc)*1)/10);
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
         const result = (initialItem.kcal - (initialItem.protein*4 + initialItem.fat*9))/100;
         return result;
     }else{
         const wartosc = number/100;
         const result = ((initialItem.kcal*wartosc) - ((initialItem.protein*4 + initialItem.fat*9)*wartosc))/100;
         return result;
     }
  }

  /**
  * 
  * @param {float} number 
  * @returns 
  */
   function obliczKcal(number){
     
    if(number === null){
      const result = initialItem.kcal;
      return result;
      console.log(result);
    }else{
      const wartosc = number/100;
      const result = (initialItem.kcal*wartosc).toFixed();
      return result;
      console.log(result);
    }
 }

  /**
  * 
  * @param {integer} numer 
  * @returns 
  */
   function obliczBialko(numer)
   {
      if(number === null){
          const result = initialItem.protein;
          return result;
      }else{
          const wartosc = number/100;
          const result = initialItem.protein*wartosc;
          return result;
      }
   }

   /**
  * 
  * @param {integer} numer 
  * @returns 
  */
   function obliczBialkoOZ(numer)
   {
      if(number === null){
          const result = initialItem.protein / 28.34952 ;
          return result;
      }else{
          const wartosc = (number/100) / 28.34952;
          const result = initialItem.protein*wartosc;
          return result;
      }
   }
  
    /**
    * 
    * @param {integer} numer 
    * @returns 
    */
     function obliczTluszcz(numer)
     {
        if(number === null){
            const result = initialItem.fat;
            return result;
        }else{
            const wartosc = number/100;
            const result = initialItem.fat*wartosc;
            return result;
        }
     }

     /**
    * 
    * @param {integer} numer 
    * @returns 
    */
     function obliczTluszczOZ(numer)
     {
        if(number === null){
            const result = initialItem.fat / 28.34952;
            return result;
        }else{
            const wartosc = (number/100) / 28.34952;
            const result = initialItem.fat*wartosc;
            return result;
        }
     }
  
     /**
    * 
    * @param {integer} numer 
    * @returns 
    */
      function obliczWeglowodany(numer)
      {
         if(number === null){
             const result = initialItem.carbs;
             return result;
         }else{
             const wartosc = number/100;
             const result = initialItem.carbs*wartosc;
             return result;
         }
      }
     /**
    * 
    * @param {integer} numer 
    * @returns 
    */
     function obliczWeglowodanyOZ(numer)
     {
        if(number === null){
            const result = initialItem.carbs / 28.34952;
            return result;
        }else{
            const wartosc = (number/100) / 28.34952;
            const result = initialItem.carbs*wartosc;
            return result;
        }
     }
   
    /**
    * 
    * @param {integer} numer 
    * @returns 
    */
     function obliczBlonnik(numer)
     {
        if(number === null){
            const result = initialItem.fiber;
            return result;
        }else{
            const wartosc = number/100;
            const result = initialItem.fiber*wartosc;
            return result;
        }
     }

     /**
    * 
    * @param {integer} numer 
    * @returns 
    */
     function obliczBlonnikOZ(numer)
     {
        if(number === null){
            const result = initialItem.fiber / 28.34952;
            return result;
        }else{
            const wartosc = (number/100) / 28.34952;
            const result = initialItem.fiber*wartosc;
            return result;
        }
     }

    /**
    * 
    * @param {integer} numer 
    * @returns 
    */
        function obliczCukier(numer)
        {
           if(number === null){
               const result = initialItem.Sugars;
               return result;
           }else{
               const wartosc = number/100;
               const result = initialItem.Sugars*wartosc;
               return result;
           }
        }

    /**
    * 
    * @param {integer} numer 
    * @returns 
    */
    function obliczCukierOZ(numer)
    {
       if(number === null){
           const result = initialItem.Sugars / 28.34952;
           return result;
       }else{
           const wartosc = (number/100) / 28.34952;
           const result = initialItem.Sugars*wartosc;
           return result;
       }
    }

    /**
    * 
    * @param {integer} numer 
    * @returns 
    */
      function obliczCholesterol(numer)
      {
        if(number === null){
          const result = initialItem.choresterol;
          return result;
        }else{
          const wartosc = number/100;
          const result = initialItem.choresterol*wartosc;
          return result;
        }
      }

    /**
    * 
    * @param {integer} numer 
    * @returns 
    */
    function obliczCholesterolOZ(numer)
    {
      if(number === null){
        const result = initialItem.choresterol / 28.34952;
        return result;
      }else{
        const wartosc = (number/100) / 28.34952;
        const result = initialItem.choresterol*wartosc;
        return result;
      }
    }
 

    const colorIG = () => {
      let color;
      if(initialItem.index_glycemic <= 50){
        color = colors.COLORS.GREEN;
      } else if ((initialItem.index_glycemic >= 51) && (initialItem.index_glycemic <= 71)){
        color = colors.COLORS.YELLOW;
      }else {
        color = colors.COLORS.RED;
      }
      return color;
  }
  
  const colorLG = () => {
    let color;
    if(obliczLG(number) <= 10.00){
      color = colors.COLORS.GREEN;
    } else if ((obliczLG(number) >= 10.01) && (obliczLG(number) <= 19)){
      color = colors.COLORS.YELLOW;
    }else {
      color = colors.COLORS.RED;
    }
    return color;
  }

 
  const [showContent1, setShowContent1] = useState(false);
  const [showContent2, setShowContent2] = useState(false);
  const [showContent3, setShowContent3] = useState(false);
  const animationControler1 = useRef(new Animated.Value(0)).current;
  const animationControler2 = useRef(new Animated.Value(0)).current;
  const animationControler3 = useRef(new Animated.Value(0)).current;

  const toggleBox1 = () => {
    const config = {
      duration: 300,
      toValue: showContent1 ? 0 : 1,
      useNativeDriver: true
    };
    Animated.timing(animationControler1, config).start();
    setShowContent1(!showContent1);
  };

  const arrowTransform = animationControler1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleBox2 = () => {
    const config = {
      duration: 300,
      toValue: showContent2 ? 0 : 1,
      useNativeDriver: true
    };
    Animated.timing(animationControler2, config).start();
    setShowContent2(!showContent2);
  };

  const arrowTransform2 = animationControler2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleBox3 = () => {
    const config = {
      duration: 300,
      toValue: showContent3 ? 0 : 1,
      useNativeDriver: true
    };
    Animated.timing(animationControler3, config).start();
    setShowContent3(!showContent3);
  };

  const arrowTransform3 = animationControler3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const heightDim = Dimensions.get('window').height - 160;
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 6, marginHorizontal: spacing.SCALE_10, borderRadius: spacing.SCALE_5, height: heightDim};


  const onSelectSwitch = (index) => {
    console.log(index)
    setSwitchSort(index);
  };

  const [activated, setActivated] = useState('');
   useEffect(() => {
    
    const identyfikator = async () => {
     
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        setActivated(customerInfo.activeSubscriptions)

      } catch (e) {
       // Error fetching customer info
      }
     
    }
    identyfikator();
  },[]);


  const renderItem =({ item, index }) => (
    <TouchableOpacity 
                onPress={() => {
                  handlePresentModalPress();
                  setInitialItem(item);
                  onChangeNumber(null);
                }}
                >
                 
                 <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.SCALE_10, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC, paddingTop: spacing.SCALE_10, paddingBottom: spacing.SCALE_6}}>
                      <View style={{flex: 5, marginRight: 20}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.itemText}>{item.name.toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: spacing.SCALE_10}}>
                      
                    <MyCircle percentage={item.index_glycemic} /> 
                     
                    </View>
                  </View>
            
                </TouchableOpacity>
  );

  // renders
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
      <Provider>
        <PaperProvider theme={theme}>
      <StatusBar translucent={false} backgroundColor={colors.COLORS.DEEP_BLUE} barStyle="light-content"/>
    
      <View style={styles.container}>
        {/* <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        /> */}
        <View style={{ paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', backgroundColor: colors.COLORS.DEEP_BLUE, marginBottom: spacing.SCALE_6}}>
        <View style={{marginRight: spacing.SCALE_15, justifyContent: 'center'}}>
            <TouchableOpacity onPress={_goBack}>
                <AntDesign name='arrowleft' color={colors.COLORS.WHITE} size={spacing.SCALE_24}/>
            </TouchableOpacity>
        </View>
        <View style={{flex: 1, marginTop: spacing.SCALE_10, marginBottom: spacing.SCALE_10}}>
        <Searchbar
          placeholder={t('glycemicIndex.search')}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          iconColor={colors.COLORS.DEEP_BLUE}
        />
        </View>

    </View>
        <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE}}>
    
        { 
            data.length > 0 ?
            (
                <BigList
                data={filteredDataSource}
                //renderItem={renderItem}
                renderItem={renderItem}
                />
            ) : (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <ActivityIndicator size="large" color={colors.COLORS.GREY_CCC} />
                </View>
            )
            }
           
        </View>

        {activated.length === 0 ?
        <View style={{marginBottom: 3, alignItems: 'center'}}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
        </View>
        : null
        }
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 2, marginTop: 3, backgroundColor: colors.COLORS.WHITE}}>

          <MyButtonNoPay icons="sort-alphabetical-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaASC}/>
          <MyButtonNoPay icons="sort-alphabetical-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaDES}/>
          <MyButtonNoPay icons="sort-numeric-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListASC}/>
          <MyButtonNoPay icons="sort-numeric-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListDES}/>
          <MyButtonNoPay icons="clipboard-edit" borderColor='#343a40' backgroundColor='#343a40' onPress={() => navigation.navigate('MealScreen')}/>
        
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          //contentContainerStyle={styles.bottomSheet}
          backgroundStyle={styles.bottomSheet}
        >
            <ImageBackground
                source={require('../../assets/images/bg5.jpg')}
                blurRadius={5}
                style={{
                    flex: 1, 
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width
                }}
                imageStyle={{
                    opacity: 0.5
                }}
            >
                <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', backgroundColor: colors.COLORS.DEEP_BLUE, marginBottom: spacing.SCALE_6}}>
                    <View style={[styles.titleContainer, {flex: 1, justifyContent: 'center', flexDirection: 'row', marginLeft: spacing.SCALE_12}]}>
                       
                        <Text style={styles.textTitle}>{initialItem.name}</Text>
                        
                    </View>
                    <View style={{justifyContent: 'center', marginRight: spacing.SCALE_6}}>
                      <View style={{}}>
                        
                        <View style={{marginRight: spacing.SCALE_6}}>
                            <MaterialCommunityIcons name='window-close' size={spacing.SCALE_26} color={colors.COLORS.WHITE}
                            onPress={() => {
                            bottomSheetModalRef.current.close()
                            }} 
                            />
                        </View>
                      </View>
                    </View>
                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: spacing.SCALE_6}}>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold', marginRight: spacing.SCALE_10}}>{t('glycemicIndex.modal-enter-quantity')}</Text>
                        </View>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={onChangeNumber}
                                value={number}
                                placeholder="100"
                                keyboardType="numeric"
                            />
                            <Text style={{marginTop: spacing.SCALE_10, fontWeight: 'bold', color: colors.TEXT.DEEP_BLUE}}> g</Text>
                    </View>

                    <ScrollView>
      <View style={{marginHorizontal: spacing.SCALE_8}}>

        <View style={{flexDirection: 'row', borderWidth: 1, padding: spacing.SCALE_6, borderColor: colors.COLORS.LIGHT_BLUE, borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_5, backgroundColor: colors.COLORS.LIGHT_BLUE, elevation: 1}}>
          <Text style={{marginRight: spacing.SCALE_4, fontSize: typography.FONT_SIZE_12, color: colors.COLORS.WHITE}}>{t('glycemicIndex.category')}</Text>
          <Text style={styles.titleCategory}>{initialItem.category}</Text>
        </View>

        <View style={{flexDirection: 'row' }}>
          
          <View style={{borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, flex: 1, borderRadius: 5, marginRight: spacing.SCALE_3, elevation: 3 }}>
            <View style={{ alignItems: 'center'}}>
              <Text style={[styles.titleKcal, {marginRight: spacing.SCALE_4, flex: 1 }]}>{obliczKcal(number)}</Text>
              <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.COLORS.DEEP_BLUE, marginTop: -spacing.SCALE_5}}>kcal</Text>
            </View>
          </View>

          <View style={{ borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, flex: 1, borderRadius: 5, marginLeft: spacing.SCALE_3, elevation: 3 }}>
            <View style={{ alignItems: 'center'}}>
              <Text style={[styles.titleKcal, {marginRight: 4, flex: 1 }]}> {(obliczKcal(number)*4.184).toFixed(0)}</Text>
              <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.COLORS.DEEP_BLUE, marginTop: -spacing.SCALE_5}}>kJ</Text>
            </View>
          </View>
          
        </View>

        <View style={{flexDirection: 'row', marginTop: spacing.SCALE_6}}>
          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginRight: spacing.SCALE_3, elevation: 3}}>
            <CircularProgress
                    value={initialItem.index_glycemic}
                    radius={spacing.SCALE_25}
                    duration={2000}
                    progressValueColor={colors.COLORS.DEEP_BLUE}
                    maxValue={110}
                    activeStrokeWidth={8}
                    inActiveStrokeWidth={8}
                    activeStrokeColor={colorIG(initialItem.index_glycemic)}
                    progressValueStyle={{ fontWeight: 'bold', fontSize: typography.FONT_SIZE_16 }}
                    dashedStrokeConfig={{
                      count: 25,
                      width: 5,
                    }}
                  />
                  <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('glycemicIndex.glycemic-index')}</Text>
          </View>

          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginLeft: spacing.SCALE_3, elevation: 3}}>
            <CircularProgress
                      value={obliczLG(number)}
                      radius={spacing.SCALE_25}
                      duration={2000}
                      progressValueColor={colors.COLORS.DEEP_BLUE}
                      maxValue={obliczLG(number) >= 100 ? obliczLG(number) : 100}
                      activeStrokeWidth={8}
                      inActiveStrokeWidth={8}
                      activeStrokeColor={colorLG(obliczLG(number))}
                      progressValueStyle={{ fontWeight: 'bold', fontSize: typography.FONT_SIZE_16 }}
                      progressFormatter={(value, number) => {
                        'worklet';   
                        return value.toFixed(1);
                      }}
                      dashedStrokeConfig={{
                        count: 25,
                        width: 5,
                      }}
                    />
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('glycemicIndex.glycemic-load')}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: spacing.SCALE_6}}>
          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginRight: spacing.SCALE_3, elevation: 5}}>
          <CircularProgress
                    value={obliczWW(number)}
                    radius={spacing.SCALE_25}
                    duration={2000}
                    progressValueColor={colors.COLORS.DEEP_BLUE}
                    maxValue={obliczLG(number) >= 10 ? obliczLG(number) : 10}
                    activeStrokeWidth={8}
                    inActiveStrokeWidth={8}
                    activeStrokeColor={colors.COLORS.DEEP_BLUE}
                    progressValueStyle={{ fontWeight: 'bold', fontSize: typography.FONT_SIZE_16 }}
                    progressFormatter={(value, number) => {
                        'worklet';
                        return value.toFixed(1);
                      }}
                      dashedStrokeConfig={{
                        count: 25,
                        width: 5,
                      }}
                  />
                  <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: 5}}>{t('glycemicIndex.exchanger')}</Text>
                  <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE}}>{t('glycemicIndex.carbohydrate')}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: 5, paddingVertical: spacing.SCALE_5, marginLeft: spacing.SCALE_3, elevation: 3 }}>
          <CircularProgress
                      value={obliczWBT(number)}
                      radius={spacing.SCALE_25}
                      duration={2000}
                      progressValueColor={colors.COLORS.DEEP_BLUE}
                      maxValue={obliczLG(number) >= 10 ? obliczLG(number) : 10}
                      activeStrokeWidth={10}
                      inActiveStrokeWidth={10}
                      activeStrokeColor={colors.COLORS.DEEP_BLUE}
                      progressValueStyle={{ fontWeight: 'bold', fontSize: typography.FONT_SIZE_16 }}
                      progressFormatter={(value, number) => {
                        'worklet';
                          
                        return value.toFixed(1);
                      }}
                      dashedStrokeConfig={{
                        count: 25,
                        width: 5,
                      }}
                    />
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: 5}}>{t('glycemicIndex.exchanger')}</Text>
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE}}>{t('glycemicIndex.protein-fat')}</Text>
          </View>
        </View>
        
        <View style={{paddingHorizontal: spacing.SCALE_6, backgroundColor: colors.COLORS.WHITE, marginTop: spacing.SCALE_6, borderRadius: 5, elevation: 3, marginBottom: spacing.SCALE_6}}>
          
          
          { initialItem.protein !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.protein')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {initialItem.protein  === undefined ? '' : obliczBialko(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({initialItem.protein  === undefined ? '' : obliczBialkoOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { initialItem.fat !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.fat')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {initialItem.fat  === undefined ? '' : obliczTluszcz(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({initialItem.fat  === undefined ? '' : obliczTluszczOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { initialItem.carbs !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.carbohydrates')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {initialItem.carbs  === undefined ? '' : obliczWeglowodany(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({initialItem.carbs  === undefined ? '' : obliczWeglowodanyOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { initialItem.fiber !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.fiber')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {initialItem.fiber  === undefined ? '' : obliczBlonnik(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({initialItem.fiber  === undefined ? '' : obliczBlonnikOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { initialItem.Sugars !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.sugar')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {initialItem.Sugars  === undefined ? '' : obliczCukier(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({initialItem.Sugars  === undefined ? '' : obliczCukierOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { initialItem.choresterol !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.cholesterol')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {initialItem.choresterol  === undefined ? '' : obliczCholesterol(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({initialItem.choresterol  === undefined ? '' : obliczCholesterolOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

        </View>

        {dataMeal.length < 2 &&
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={addMeal} style={styles.btnModal}>
            <Text style={styles.textBtn}>{t('glycemicIndex.add-to-meal')}</Text>
          </TouchableOpacity>       
        </View>
        }

        {activated.length === 0 ?
        <View style={{marginBottom: 6, alignItems: 'center'}}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
        </View>
        : null
        }

        {initialItem.Status === 0 &&
        <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6, overflow: 'hidden'}}>
            <TouchableOpacity onPress={() => toggleBox1()} style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE}}>WITAMINY</Text>
                <Animated.View style={{transform: [{rotateZ: arrowTransform}]}}>
                  <MaterialIcons name='keyboard-arrow-down' size={20} />
                </Animated.View>
              </View>
            </TouchableOpacity>
            { showContent1  &&  
            <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderBottomRightRadius: spacing.SCALE_5, borderBottomLeftRadius: spacing.SCALE_5}}>
              { initialItem.witA !== 0 &&
              
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>WITAMINA A</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{initialItem.witA} {UNIT.IU}</Text>
                  </View>
                </View>
                }

                { initialItem.betaCarotene !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={styles.textBox2}>BETA-CAROTEN</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.GREY_777, fontWeight: 'bold'}}>{initialItem.betaCarotene} {UNIT.UG}</Text>
                    </View>
                  </View>
                } 

                { initialItem.luteinaZeaksantyna !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={styles.textBox2}>LUTEINA-ZEAKSANTYNA</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.GREY_777, fontWeight: 'bold'}}>{initialItem.luteinaZeaksantyna} {UNIT.UG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB1Tiamina !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B1 - TIAMINA</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB1Tiamina).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB2Ryboflawina !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B2 - RYBOFLAWINA</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB2Ryboflawina).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB3Niacyna !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B3 - NIACYNA</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB3Niacyna).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB4Cholina !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B4 - CHOLINA</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB4Cholina).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB5KwasPantotenowy !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B5 - KWAS PANTOTENOWY</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB5KwasPantotenowy).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB6 !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B6</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB6).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB9KwasFoliowy !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B9 - KWAS FOLIOWY</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB9KwasFoliowy).toFixed(3)} {UNIT.UG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitB12 !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA B12</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitB12).toFixed(2)} {UNIT.UG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitC !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA C</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitC).toFixed(2)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitE !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA E</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitE).toFixed(2)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.WitK !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WITAMINA K</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.WitK).toFixed(2)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }
              </View>
               
            }
        </View>
        }

        { initialItem.Status === 0 &&
          <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6, overflow: 'hidden'}}>
          <TouchableOpacity onPress={() => toggleBox2()} style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE}}>MAKROELEMENTY</Text>
                <Animated.View style={{transform: [{rotateZ: arrowTransform2}]}}>
                  <MaterialIcons name='keyboard-arrow-down' size={20} />
                </Animated.View>
              </View>
          </TouchableOpacity>
          
          { showContent2  &&  
              <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderBottomRightRadius: spacing.SCALE_5, borderBottomLeftRadius: spacing.SCALE_5}}>
                { initialItem.Wapn !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>WAPŃ</Text>
                      
                    </View>
                    
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.Wapn).toFixed(1)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.Magnez !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>MAGNEZ</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Magnez).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { initialItem.Fosfor !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>FOSFOR</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Fosfor).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { initialItem.Potas !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>POTAS</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Potas).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { initialItem.Sod !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>SÓD</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Sod).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

              </View>
          }
        </View>
      }

      { initialItem.Status === 0 &&
          <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6, overflow: 'hidden'}}>
          <TouchableOpacity onPress={() => toggleBox3()} style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE}}>MIKROELEMENTY</Text>
                <Animated.View style={{transform: [{rotateZ: arrowTransform3}]}}>
                  <MaterialIcons name='keyboard-arrow-down' size={20} />
                </Animated.View>
              </View>
          </TouchableOpacity>
          
          { showContent3  &&  
              <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderBottomRightRadius: spacing.SCALE_5, borderBottomLeftRadius: spacing.SCALE_5}}>
                { initialItem.Miedz !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>MIEDŹ</Text>
                      
                    </View>
                    
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(initialItem.Miedz).toFixed(1)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { initialItem.Zelazo !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>ŻELAZO</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Zelazo).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { initialItem.Mangan !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>MANGAN</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Mangan).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { initialItem.Selen !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>SELEN</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Selen).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { initialItem.Cynk !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>CYNK</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(initialItem.Cynk).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

              </View>
          }
        </View>
      }

      </View>
      
      </ScrollView>

                </View>
            </ImageBackground>
        </BottomSheetModal>
      </View>
      
      </PaperProvider>
    </Provider>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.COLORS.LIGHT_GREY,
    },
    flatListStyle: {
        borderBottomWidth: 1,
        borderBottomColor: colors.COLORS.GREY_333,
        backgroundColor: colors.COLORS.WHITE,
        paddingLeft: spacing.SCALE_10,
        paddingTop: spacing.SCALE_10,
        paddingBottom: spacing.SCALE_15,
        flexDirection: 'row',
    },
    itemText: {
      color: colors.TEXT.DEEP_BLUE,
      fontSize: typography.FONT_SIZE_14,
      fontWeight: 'bold'
    },
    btnModal: {
      borderWidth: 0,
      padding: spacing.SCALE_10,
      width: Dimensions.get('window').width-12,
      borderRadius: spacing.SCALE_5,
      alignItems: 'center',
      backgroundColor: colors.COLORS.DEEP_BLUE,
      elevation: 3,
      marginBottom: spacing.SCALE_10,
    },
    textBtn: {
      color: colors.TEXT.WHITE
    },
    titleContainer: {
      //marginBottom: 10, 
      alignItems: 'center',
      backgroundColor: colors.COLORS.DEEP_BLUE,
      padding: spacing.SCALE_10,
    },
    textTitle: {
      fontSize: typography.FONT_SIZE_16,
      color: colors.TEXT.WHITE,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      //borderBottomWidth: 3,
      //borderBottomColor: 'orange'
    },
    titleCategory: {
      fontSize: typography.FONT_SIZE_12,
      color: colors.TEXT.WHITE,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    titleKcal:{
      fontSize: typography.FONT_SIZE_24,
      color: colors.TEXT.DEEP_BLUE,
      fontWeight: 'bold',
    },
    textInput: {
      borderBottomWidth: 4,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderBottomColor: colors.COLORS.DEEP_BLUE,
      //backgroundColor: COLORS.WHITE,
      width: 200,
      textAlign: 'center',
      height: 40,
      color: colors.TEXT.DEEP_BLUE,
      //fontWeight: 'bold',
      //elevation: 3
    },
    fabStyle: {
      bottom: spacing.SCALE_25,
      right: spacing.SCALE_16,
      position: 'absolute',
      marginBottom: spacing.SCALE_35,
    },
    textBox1: {
      fontSize: typography.FONT_SIZE_12,
      textTransform: 'uppercase'
    },
    textBox2: {
      fontSize: typography.FONT_SIZE_10,
      textTransform: 'uppercase'
    },
    textBox3: {
      fontSize: typography.FONT_SIZE_12,
      color: colors.TEXT.DEEP_BLUE,
      fontWeight: 'bold'
    },
    modalBtnText: {
      fontSize: typography.FONT_SIZE_10,
      textTransform: 'uppercase',
      color: colors.TEXT.DEEP_BLUE,
      fontWeight: 'bold'
    },
    textTitleModal: {
      color: colors.TEXT.DEEP_BLUE,
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    bottomSheet: {
      shadowColor: colors.COLORS.BLACK,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
      
      elevation: 24,
    }
});

export default GlycemicIndex;