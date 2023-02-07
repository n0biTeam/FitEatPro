import { StyleSheet, Text, View, ImageBackground, StatusBar, TextInput, Dimensions, Animated,ScrollView, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import React, {useContext, useState, useEffect, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Searchbar, AnimatedFAB, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import MyCircle from '../../components/MyCircle';
import { MyButton } from '../../components/MyButton';
import RBSheet from "react-native-raw-bottom-sheet";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../../styles';
import { UNIT } from '../../styles/units';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const GlycemicIndex = ({ 
      route,
      navigation,
      animatedValue,
      visible,
      extended,
      label,
      animateFrom,
      style,
      iconMode
  }) => {

    const [isExtended, setIsExtended] = React.useState(true);

    const isIOS = Platform.OS === 'ios';
  
    const onScroll = ({ nativeEvent }) => {
      const currentScrollPosition =
        Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
      setIsExtended(currentScrollPosition <= 0);
    };

    const fabStyle = { [animateFrom]: 16 };

    const {t, i18n} = useTranslation();

    const {user} = useContext(AuthContext);
    const [listData, setListData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState(listData);
    const [masterDataSource, setMasterDataSource] = useState(listData);
    

    const getList = () => {
        firestore().collection('users').doc(user.uid).collection('products')
        .orderBy('name', 'asc')
        .onSnapshot(
           querySnapshot => {
           const listData = []

               querySnapshot.forEach(doc => {
                //const listData = doc.data()
                //listData.id = doc.id
                listData.push({...doc.data(), id: doc.id})
              });
              
                 setListData(listData);
                 setFilteredDataSource(listData);
                 setMasterDataSource(listData);
              },
                error => {
                 console.log(error)
              }
        )
    };

    useEffect(() => {
        getList();
       // setIsOpen(false);
      }, []);

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
          refRBSheet.current.close();
        })
      }
    
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

const sortListASC = () => {
  filteredDataSource.sort((obj1, obj2) => {
    return obj1.index_glycemic - obj2.index_glycemic;
  });
  setMasterDataSource([...listData]);
};

const sortListDES = () => {
  filteredDataSource.sort((obj1, obj2) => {
    return obj2.index_glycemic - obj1.index_glycemic;
  });
  setMasterDataSource([...listData]);
};

const sortListAlfaASC = () => {
    filteredDataSource.sort((obj1, obj2) => {
    return obj1.name.localeCompare(obj2.name)
  });
  setMasterDataSource([...listData]);
};

const sortListAlfaDES = () => {
  filteredDataSource.sort((obj1, obj2) => {
  return obj2.name.localeCompare(obj1.name)
});
setMasterDataSource([...listData]);
};

    
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

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [isExpanded3, setIsExpanded3] = useState(false);

  const ExpandableView = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));
  
    useEffect(() => {
      Animated.timing(height, {
        toValue: expanded ? 300 : 0,
        duration: 100,
        useNativeDriver: false
      }).start();
    }, [expanded, height]);
  
    // console.log('rerendered');
  
    return (
      <Animated.View
        style={{ height, backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
      >
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
            <Text style={styles.textBox3}>{initialItem.WitB1Tiamina} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitB2Ryboflawina !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA B2 - RYBOFLAWINA</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitB2Ryboflawina} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitB3Niacyna !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA B3 - NIACYNA</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitB3Niacyna} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitB4Cholina !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA B4 - CHOLINA</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitB4Cholina} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitB5KwasPantotenowy !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA B5 - KWAS PANTOTENOWY</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitB5KwasPantotenowy} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitB6 !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA B6</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitB6} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitB9KwasFoliowy !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA B9 - KWAS FOLIOWY</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitB9KwasFoliowy} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitB12 !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA B12</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitB12} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitC !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA C</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitC} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitE !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA E</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitE} {UNIT.MG}</Text>
          </View>
        </View>
      }

      { initialItem.WitK !== 0 &&
        <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
          <View style={{flex: 1}}>
            <Text style={styles.textBox1}>WITAMINA K</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.textBox3}>{initialItem.WitK} {UNIT.MG}</Text>
          </View>
        </View>
      }
      </Animated.View>
    );
  };

  const ExpandableView2 = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));
  
    useEffect(() => {
      Animated.timing(height, {
        toValue: expanded ? 40 : 0,
        duration: 150,
        useNativeDriver: false
      }).start();
    }, [expanded, height]);
  
    // console.log('rerendered');
  
    return (
      <Animated.View
        style={{ height , backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
      >
        <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}>
          {t('weightLogScreen.text-bai')}
        </Text>
      </Animated.View>
    );
  };

  const ExpandableView3 = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));
  
    useEffect(() => {
      Animated.timing(height, {
        toValue: expanded ? 76 : 0,
        duration: 150,
        useNativeDriver: false
      }).start();
    }, [expanded, height]);
  
    // console.log('rerendered');
  
    return (
      <Animated.View
        style={{ height , backgroundColor: colors.COLORS.WHITE, paddingHorizontal: spacing.SCALE_6 }}
      >
        <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}>
          {t('weightLogScreen.text-bmi')}
        </Text>
      </Animated.View>
    );
  };

  return (
    <PaperProvider theme={theme}>
       <StatusBar translucent={false} backgroundColor={colors.COLORS.DEEP_BLUE} barStyle="light-content"/>
    <SafeAreaProvider style={{flexGrow: 1, backgroundColor: colors.COLORS.WHITE}}>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
       // closeOnPressBack={true}
        onClose={() => setIsOpen(false)}
        //animationType='slide'
        height={heightMidal}
        openDuration={500}
        closeDuration={300}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: colors.COLORS.DEEP_BLUE,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            elevation: 15
          }
        }}
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
          <View style={[styles.titleContainer, {flex: 1, justifyContent: 'center'}]}>
            {/* <Text style={styles.textTitle}>{initialItem.id}</Text> */}
            <Text style={styles.textTitle}>{initialItem.name}</Text>
          </View>
          <View style={{justifyContent: 'center', marginRight: spacing.SCALE_20}}>
            <MaterialCommunityIcons name='square-edit-outline' size={spacing.SCALE_24} color={colors.COLORS.WHITE}
                onPress={() => {
                  refRBSheet.current.close(),
                  navigation.navigate('EditItemGlycemicIndex', {itemId: initialItem.id})
                }} />
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
                    activeStrokeWidth={10}
                    inActiveStrokeWidth={10}
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
                      activeStrokeWidth={10}
                      inActiveStrokeWidth={10}
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
        
        <View style={{paddingHorizontal: spacing.SCALE_6, backgroundColor: colors.COLORS.WHITE, marginTop: spacing.SCALE_6, borderRadius: 5, elevation: 3}}>
          
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
                  <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                    ({initialItem.protein  === undefined ? '' : obliczBialkoOZ(number).toFixed(3)} {UNIT.OZ})
                  </Text>
                </View>
              </View>

          </View>

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
                  <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                    ({initialItem.fat  === undefined ? '' : obliczTluszczOZ(number).toFixed(3)} {UNIT.OZ})
                  </Text>
                </View>
              </View>

          </View>

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
                  <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                    ({initialItem.carbs  === undefined ? '' : obliczWeglowodanyOZ(number).toFixed(3)} {UNIT.OZ})
                  </Text>
                </View>
              </View>

          </View>

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
                  <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                    ({initialItem.fiber  === undefined ? '' : obliczBlonnikOZ(number).toFixed(3)} {UNIT.OZ})
                  </Text>
                </View>
              </View>

          </View>

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
                  <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                    ({initialItem.Sugars  === undefined ? '' : obliczCukierOZ(number).toFixed(3)} {UNIT.OZ})
                  </Text>
                </View>
              </View>

          </View>

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
                  <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                    ({initialItem.choresterol  === undefined ? '' : obliczCholesterolOZ(number).toFixed(3)} {UNIT.OZ})
                  </Text>
                </View>
              </View>

          </View>

        </View>

        <View style={{flex: 1,alignItems: 'center', marginTop: spacing.SCALE_6}}>
          <TouchableOpacity onPress={addMeal} style={styles.btnModal}>
            <Text style={styles.textBtn}>{t('glycemicIndex.add-to-meal')}</Text>
          </TouchableOpacity>       
        </View>
        <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
          <TouchableOpacity style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}
                  onPress={() => {setIsExpanded(!isExpanded);}}
                >
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 1}}>
                       <Text style={{color: colors.TEXT.DEEP_BLUE}}>WITAMINY</Text>
                    </View>
                    <View>
                      <Text>
                      {isExpanded ? <MaterialIcons name='keyboard-arrow-up' size={20} /> : <MaterialIcons name='keyboard-arrow-down' size={20} />}
                      </Text>
                    </View>

                  </View>
                 
          </TouchableOpacity>
          <ExpandableView expanded={isExpanded} />
         </View>

         <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
          <TouchableOpacity style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}
                  onPress={() => {setIsExpanded2(!isExpanded2);}}
                >
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 1}}>
                       <Text style={{color: colors.TEXT.DEEP_BLUE}}>MAKROELEMENTY</Text>
                    </View>
                    <View>
                      <Text>
                      {isExpanded2 ? <MaterialIcons name='keyboard-arrow-up' size={20} /> : <MaterialIcons name='keyboard-arrow-down' size={20} />}
                      </Text>
                    </View>

                  </View>
                 
          </TouchableOpacity>
          <ExpandableView2 expanded={isExpanded2} />
         </View>

         <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6}}>
          <TouchableOpacity style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}
                  onPress={() => {setIsExpanded3(!isExpanded3);}}
                >
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 1}}>
                       <Text style={{color: colors.TEXT.DEEP_BLUE}}>MIKROELEMENTY</Text>
                    </View>
                    <View>
                      <Text>
                      {isExpanded3 ? <MaterialIcons name='keyboard-arrow-up' size={20} /> : <MaterialIcons name='keyboard-arrow-down' size={20} />}
                      </Text>
                    </View>

                  </View>
                 
          </TouchableOpacity>
          <ExpandableView3 expanded={isExpanded3} />
         </View>

      </View>


      

      

      </ScrollView>
    </View>
    </ImageBackground>
    </RBSheet>

  

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
          listData.length > 0 ?
          (
            <BigList
              data={filteredDataSource}
              //renderItem={renderItem}
              renderItem={({item}) => (
                <TouchableOpacity 
                onPress={() => {
                  refRBSheet.current.open();
                  setInitialItem(item);
                  onChangeNumber(null);
                }}
                >
                 
                  <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.SCALE_10, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC, paddingTop: spacing.SCALE_10, paddingBottom: spacing.SCALE_6}}>
                      <View style={{flex: 5}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.itemText}>{item.name.toUpperCase()}</Text>
                      </View>
                  
                      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: spacing.SCALE_10}}>
                        <MyCircle percentage={item.index_glycemic} /> 
                    </View>
                  </View>
            
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator size="large" color={colors.COLORS.GREY_CCC} />
              {/* <View style={{alignItems: 'center'}}>
                <Text style={{color: colors.COLORS.DEEP_BLUE, fontSize: typography.FONT_SIZE_11}}>WCZYTYWANIE DANYCH...</Text>
              </View> */}
            </View>
          )
        }

       
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 2, marginTop: 3, backgroundColor: colors.COLORS.WHITE}}>

              <MyButton icons="sort-alphabetical-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaASC}/>
              <MyButton icons="sort-alphabetical-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaDES}/>
              <MyButton icons="sort-numeric-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListASC}/>
              <MyButton icons="sort-numeric-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListDES}/>
              <MyButton icons="clipboard-edit" borderColor='#343a40' backgroundColor='#343a40' onPress={() => navigation.navigate('MealScreen')}/>
        
      </View>

    <AnimatedFAB
        icon={'plus'}
        label={'Dodaj'}
        //extended={isExtended}
        onPress={() => {
          navigation.navigate('AddGlycemicIndex');
        }}
        visible={visible}
        theme={'tertiary'}
        animateFrom={'right'}
        iconMode={'static'}
        //color={COLORS.ORANGE}

        style={[styles.fabStyle, style, fabStyle]}
      />
    
    {/* </ImageBackground> */}
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default GlycemicIndex

const styles = StyleSheet.create({
    flatListStyle: {
        borderBottomWidth: 1,
        borderBottomColor: colors.COLORS.GREY_333,
        backgroundColor: colors.COLORS.WHITE,
        paddingLeft: spacing.SCALE_10,
        paddingTop: spacing.SCALE_10,
        paddingBottom: spacing.SCALE_15,
        flexDirection: 'row'
        //marginHorizontal: 3,
        //opacity: 0.7
        
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
      fontWeight: 'bold',
      //elevation: 3
    },
    fabStyle: {
      bottom: spacing.SCALE_16,
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
    }
})