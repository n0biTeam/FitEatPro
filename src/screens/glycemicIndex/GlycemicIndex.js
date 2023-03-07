import React, { useCallback, useMemo, useRef, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, StatusBar, Dimensions, ImageBackground, ActivityIndicator, TouchableOpacity, ToastAndroid, Animated, BackHandler, TextInput } from 'react-native';
import { Searchbar, AnimatedFAB, DefaultTheme, Provider as PaperProvider, Modal, Portal, Provider } from 'react-native-paper';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import MyCircle from '../../components/MyCircle';
import BtnModal from '../../components/BtnModal';
import ItemBigList from '../../components/ItemBigList';
import { MyButton } from '../../components/MyButton';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../../styles';
import { UNIT } from '../../styles/units';
import MySwitch2 from '../../components/MySwitch';
import { ScrollView} from 'react-native-gesture-handler';
import {
  fontScale,
  scale,
  deviceInch,
  hasNotch,
  isAndroid,
  isIOS,
  isSmallDevice,
  isTablet,
  width,
  height,
} from 'react-native-utils-scale';

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
    visible2,
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
  const [switchSort, setSwitchSort] = useState('2');
  const [loading, setLoading] = useState(true);

  const getList = () => {
    firestore().collection('users').doc(user.uid).collection('products')
    .orderBy('name', 'asc')
    .onSnapshot(
       querySnapshot => {
       const listData = []

           querySnapshot.forEach(doc => {
            //const listData = doc.data()
            //listData.id = doc.id
            //listData.push({...doc.data(), id: doc.id})
            const { 
                name,
                index_glycemic,
                protein,
                fat,
                carbs,
                fiber,
                Sugars,
                choresterol,
                witA,
                betaCarotene,
                luteinaZeaksantyna,
                WitB1Tiamina,
                WitB2Ryboflawina,
                WitB3Niacyna,
                WitB4Cholina,
                WitB5KwasPantotenowy,
                WitB6,
                WitB9KwasFoliowy,
                WitB12,
                WitC,
                WitE,
                WitK,
                Wapn,
                Magnez,
                Fosfor,
                Potas,
                Sod,
                Miedz,
                Zelazo,
                Mangan,
                Selen,
                Cynk
              } = doc.data();
            listData.push({
              id: doc.id,
              name,
              index_glycemic,
              protein,
              fat,
              carbs,
              fiber,
              Sugars,
              choresterol,
              witA,
              betaCarotene,
              luteinaZeaksantyna,
              WitB1Tiamina,
              WitB2Ryboflawina,
              WitB3Niacyna,
              WitB4Cholina,
              WitB5KwasPantotenowy,
              WitB6,
              WitB9KwasFoliowy,
              WitB12,
              WitC,
              WitE,
              WitK,
              Wapn,
              Magnez,
              Fosfor,
              Potas,
              Sod,
              Miedz,
              Zelazo,
              Mangan,
              Selen,
              Cynk
            })
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

  
  const [product, setProduct] = useState('');
  const getProduct = async (item) => {
    //console.log(item.id)
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('products')
      .doc(item.id).get()
      .then(doc => {
      //console.log('User exists: ', doc.exists);
  
      if (doc.exists) {
        //console.log('User data: ', doc.data());
        setProduct({...doc.data(), id: doc.id});
      }
    });

    //console.log(product)
    
  }

  //console.log(product.id)

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
      }
    })
  }

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
  
    //console.log('handleSheetChanges', index);
  }, []);
 
 

//   useEffect(() => {
// console.log('indx: '+ indx);
//     const backAction1 = () => {  
//         bottomSheetModalRef.current.close()
//       return true;
//     };
    
//     if(indx === -1){
//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       backAction1
//     );
//     return () => backHandler.remove();
//     }else if(indx === 0){
       
//       //return () => navigation.navigate('GlycemicIndex');
//     }else{
//       return () => navigation.navigate('HomeScreen');
//     }


    
//     }, [indx]);

    

  useEffect(() => {
    getUser();
   const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
   }, [navigation, loading, isSwitchOn]);

      const addMeal = async () => {
        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('meal')
        .add({
          name: product.name,
          quantity: number != undefined ? parseInt(number) : 100, //ilosc gram
          kcal: number != undefined ? parseInt(product.kcal/(100/number)) : parseInt(product.kcal),
          glycemicIndex: parseInt(product.index_glycemic),
          protein: parseFloat(product.protein),
          fat: parseFloat(product.fat),
          carbs: number != undefined ? parseFloat(product.carbs/(100/number)) : parseFloat(product.carbs),
          fiber: number != undefined ? parseFloat(product.fiber/(100/number)) : parseFloat(product.fiber),
          sugar: parseFloat(product.Sugars),
          cholesterol: parseFloat(product.choresterol),
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          console.log('Product Added list meal');
          ToastAndroid.show(t('glycemicIndex.toast-add'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
          //refRBSheet.current.close();
          bottomSheetModalRef.current.close();
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
  setModalX('index');
  setVisible(false);
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

//(a, b) => !a - !b || a - b
const [modalX, setModalX] = useState('');

const sortListIndex = () => {
  filteredDataSource.sort((obj1, obj2) => {
    return obj1.name.localeCompare(obj2.name)
  });
  setModalX('index')
  setMasterDataSource([...listData]);
  setVisible(false);
};

//Białko
const sortListProtein = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.protein - !b.protein || b.protein - a.protein;
    });
  
    setModalX('protein');
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.protein - !b.protein || a.protein - b.protein;
    });
    
    setModalX('protein');
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Tłuszcze
const sortListFat = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.fat - !b.fat || b.fat - a.fat;
    });
    setModalX('fat')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.fat - !b.fat || a.fat - b.fat;
    });
    setModalX('fat')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Węglowodany
const sortListCarbs = () => {
    if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.carbs - !b.carbs || b.carbs - a.carbs;
    });
    setModalX('carbs')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
      filteredDataSource.sort((a, b) => {
        return !a.carbs - !b.carbs || a.carbs - b.carbs;
      });
      setModalX('carbs')
      setMasterDataSource([...listData]);
      setVisible(false);
  }
};

//Błonnik
const sortListFiber = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.fiber - !b.fiber || b.fiber - a.fiber;
    });
    setModalX('fiber')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.fiber - !b.fiber || a.fiber - b.fiber;
    });
    setModalX('fiber')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Cukier
const sortListSugar = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Sugars - !b.Sugars || b.Sugars - a.Sugars;
    });
    setModalX('sugar')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Sugars - !b.Sugars || a.Sugars - b.Sugars;
    });
    setModalX('sugar')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Cholesterol
const sortListCholesterol = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.choresterol - !b.choresterol || b.choresterol - a.choresterol;
    });
    setModalX('cholesterol')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.choresterol - !b.choresterol || a.choresterol - b.choresterol;
    });
    setModalX('cholesterol')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina A
const sortListWitA = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.witA - !b.witA || b.witA - a.witA;
    });
    setModalX('witA')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.witA - !b.witA || a.witA - b.witA;
    });
    setModalX('witA')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Beat-caroten
const sortListBetaCaroten = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.betaCarotene - !b.betaCarotene || b.betaCarotene - a.betaCarotene;
    });
    setModalX('betaCaroten')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.betaCarotene - !b.betaCarotene || a.betaCarotene - b.betaCarotene;
    });
    setModalX('betaCaroten')
    setMasterDataSource([...listData]);
    setVisible(false);
}
};

//Luteina
const sortListLuteina = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.luteinaZeaksantyna - !b.luteinaZeaksantyna || b.luteinaZeaksantyna - a.luteinaZeaksantyna;
    });
    setModalX('luteina')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.luteinaZeaksantyna - !b.luteinaZeaksantyna || a.luteinaZeaksantyna - b.luteinaZeaksantyna;
    });
    setModalX('luteina')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina B1 - Tiamina
const sortListWitB1 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB1Tiamina - !b.WitB1Tiamina || b.WitB1Tiamina - a.WitB1Tiamina;
    });
    setModalX('witB1')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB1Tiamina - !b.WitB1Tiamina || a.WitB1Tiamina - b.WitB1Tiamina;
    });
    setModalX('witB1')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina B2 - Ryboflawina
const sortListWitB2 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB2Ryboflawina - !b.WitB2Ryboflawina || b.WitB2Ryboflawina - a.WitB2Ryboflawina;
    });
    setModalX('witB2')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB2Ryboflawina - !b.WitB2Ryboflawina || a.WitB2Ryboflawina - b.WitB2Ryboflawina;
    });
    setModalX('witB2')
    setMasterDataSource([...listData]);
    setVisible(false);
}
};

//Witamina B3 - niacyna
const sortListWitB3 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB3Niacyna - !b.WitB3Niacyna || b.WitB3Niacyna - a.WitB3Niacyna;
    });
    setModalX('witB3')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB3Niacyna - !b.WitB3Niacyna || a.WitB3Niacyna - b.WitB3Niacyna;
    });
    setModalX('witB3')
    setMasterDataSource([...listData]);
    setVisible(false);
}
};

//Witamina B4 - cholina
const sortListWitB4 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB4Cholina - !b.WitB4Cholina || b.WitB4Cholina - a.WitB4Cholina;
    });
    setModalX('witB4')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB4Cholina - !b.WitB4Cholina || a.WitB4Cholina - b.WitB4Cholina;
    });
    setModalX('witB4')
    setMasterDataSource([...listData]);
    setVisible(false);
}
};

//Witamina B5 - kwas pantotenowy
const sortListWitB5 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB5KwasPantotenowy - !b.WitB5KwasPantotenowy || b.WitB5KwasPantotenowy - a.WitB5KwasPantotenowy;
    });
    setModalX('witB5')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB5KwasPantotenowy - !b.WitB5KwasPantotenowy || a.WitB5KwasPantotenowy - b.WitB5KwasPantotenowy;
    });
    setModalX('witB5')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina B6
const sortListWitB6 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB6 - !b.WitB6 || b.WitB6 - a.WitB6;
    });
    setModalX('witB6')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB6 - !b.WitB6 || a.WitB6 - b.WitB6;
    });
    setModalX('witB6')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina B9 - kwas foliowy
const sortListWitB9 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB9KwasFoliowy - !b.WitB9KwasFoliowy || b.WitB9KwasFoliowy - a.WitB9KwasFoliowy;
    });
    setModalX('witB9')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB9KwasFoliowy - !b.WitB9KwasFoliowy || a.WitB9KwasFoliowy - b.WitB9KwasFoliowy;
    });
    setModalX('witB9')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina B12
const sortListWitB12 = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitB12 - !b.WitB12 || b.WitB12 - a.WitB12;
    });
    setModalX('witB12')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitB12 - !b.WitB12 || a.WitB12 - b.WitB12;
    });
    setModalX('witB12')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina C
const sortListWitC = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitC - !b.WitC || b.WitC - a.WitC;
    });
    setModalX('witC')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitC - !b.WitC || a.WitC - b.WitC;
    });
    setModalX('witC')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina E
const sortListWitE = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitE - !b.WitC || b.WitE - a.WitE;
    });
    setModalX('witE')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitE - !b.WitE || a.WitE - b.WitE;
    });
    setModalX('witE')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Witamina K
const sortListWitK = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.WitK - !b.WitK || b.WitK - a.WitK;
    });
    setModalX('witK')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.WitK - !b.WitK || a.WitK - b.WitK;
    });
    setModalX('witK')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Wapn
const sortListWapn = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Wapn - !b.Wapn || b.Wapn - a.Wapn;
    });
    setModalX('wapn')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Wapn - !b.Wapn || a.Wapn - b.Wapn;
    });
    setModalX('wapn')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Magnez
const sortListMagnez = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Magnez - !b.Magnez || b.Magnez - a.Magnez;
    });
    setModalX('magnez')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Magnez - !b.Magnez || a.Magnez - b.Magnez;
    });
    setModalX('magnez')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Fosfor
const sortListFosfor = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Fosfor - !b.Fosfor || b.Fosfor - a.Fosfor;
    });
    setModalX('fosfor')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Fosfor - !b.Fosfor || a.Fosfor - b.Fosfor;
    });
    setModalX('fosfor')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Potas
const sortListPotas = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Potas - !b.Potas || b.Potas - a.Potas;
    });
    setModalX('potas')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Potas - !b.Potas || a.Potas - b.Potas;
    });
    setModalX('potas')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Sod
const sortListSod = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Sod - !b.Sod || b.Sod - a.Sod;
    });
    setModalX('sod')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Sod - !b.Sod || a.Sod - b.Sod;
    });
    setModalX('sod')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Miedz
const sortListMiedz = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Miedz - !b.Miedz || b.Miedz - a.Miedz;
    });
    setModalX('miedz')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Miedz - !b.Miedz || a.Miedz - b.Miedz;
    });
    setModalX('miedz')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Żelazo
const sortListIron = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Zelazo - !b.Zelazo || b.Zelazo - a.Zelazo;
    });
    setModalX('iron')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Zelazo - !b.Zelazo || a.Zelazo - b.Zelazo;
    });
    setModalX('iron')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Mangan
const sortListMangan = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Mangan - !b.Mangan || b.Mangan - a.Mangan;
    });
    setModalX('mangan')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Mangan - !b.Mangan || a.Mangan - b.Mangan;
    });
    setModalX('mangan')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Selen
const sortListSelen = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Selen - !b.Selen || b.Selen - a.Selen;
    });
    setModalX('selen')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Selen - !b.Selen || a.Selen - b.Selen;
    });
    setModalX('selen')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

//Cynk
const sortListCynk = () => {
  if(switchSort === 1){
    filteredDataSource.sort((a, b) => {
      return !a.Cynk - !b.Cynk || b.Cynk - a.Cynk;
    });
    setModalX('cynk')
    setMasterDataSource([...listData]);
    setVisible(false);
  }else{
    filteredDataSource.sort((a, b) => {
      return !a.Cynk - !b.Cynk || a.Cynk - b.Cynk;
    });
    setModalX('cynk')
    setMasterDataSource([...listData]);
    setVisible(false);
  }
};

const xxx = (item) => {
  if(modalX === 'protein'){
     return (
      <ItemBigList value={(item.protein).toFixed(2)} unit={UNIT.GR} />
     )
  }else if(modalX === 'fat'){
    return (
      <ItemBigList value={(item.fat).toFixed(2)} unit={UNIT.GR} />
    )
  }else if(modalX === 'index'){
    return(
      <MyCircle percentage={item.index_glycemic} /> 
    )
  }else if(modalX === 'carbs'){
     return (
      <ItemBigList value={(item.carbs).toFixed(2)} unit={UNIT.GR} />
    )
  }else if(modalX === 'fiber'){
    return (
      <ItemBigList value={(item.fiber).toFixed(2)} unit={UNIT.GR} />
    )
  }else if(modalX === 'sugar'){
    return (
      <ItemBigList value={(item.Sugars).toFixed(2)} unit={UNIT.GR} />
    )
  }else if(modalX === 'cholesterol'){
    return (
      <ItemBigList value={(item.choresterol).toFixed(0)} unit={UNIT.MG} />
    )
  }else if(modalX === 'witA'){
    return (
      <ItemBigList value={(item.witA).toFixed(0)} unit={UNIT.IU} width={70} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'betaCaroten'){
    return (
      <ItemBigList value={(item.betaCarotene).toFixed(3)} unit={UNIT.UG} width={75} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'luteina'){
    return (
      <ItemBigList value={(item.luteinaZeaksantyna).toFixed(3)} unit={UNIT.UG} width={75} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB1'){
    return (
      <ItemBigList value={(item.WitB1Tiamina).toFixed(3)} unit={UNIT.MG} width={75} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB2'){
    return (
      <ItemBigList value={(item.WitB2Ryboflawina).toFixed(3)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB3'){
    return (
      <ItemBigList value={(item.WitB3Niacyna).toFixed(3)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB4'){
    return (
      <ItemBigList value={(item.WitB4Cholina).toFixed(1)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB5'){
    return (
      <ItemBigList value={(item.WitB5KwasPantotenowy).toFixed(3)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB6'){
    return (
      <ItemBigList value={(item.WitB6).toFixed(3)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB9'){
    return (
      <ItemBigList value={(item.WitB9KwasFoliowy).toFixed(3)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witB12'){
    return (
      <ItemBigList value={(item.WitB12).toFixed(3)} width={75} unit={UNIT.UG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witC'){
    return (
      <ItemBigList value={(item.WitC).toFixed(2)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witE'){
    return (
      <ItemBigList value={(item.WitE).toFixed(2)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'witK'){
    return (
      <ItemBigList value={(item.WitK).toFixed(4)} width={85} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_2} />
    )
  }else if(modalX === 'wapn'){
    return (
      <ItemBigList value={(item.Wapn).toFixed(1)} width={75} unit={UNIT.MG} backgroundColor={colors.PRESSURE.P2} />
    )
  }else if(modalX === 'magnez'){
    return (
      <ItemBigList value={(item.Magnez).toFixed(1)} width={75} unit={UNIT.MG} backgroundColor={colors.PRESSURE.P2} />
    )
  }else if(modalX === 'fosfor'){
    return (
      <ItemBigList value={(item.Fosfor).toFixed(1)} width={75} unit={UNIT.MG} backgroundColor={colors.PRESSURE.P2} />
    )
  }else if(modalX === 'potas'){
    return (
      <ItemBigList value={(item.Potas).toFixed(1)} width={75} unit={UNIT.MG} backgroundColor={colors.PRESSURE.P2} />
    )
  }else if(modalX === 'sod'){
    return (
      <ItemBigList value={(item.Sod).toFixed(0)} width={70} unit={UNIT.MG} backgroundColor={colors.PRESSURE.P2} />
    )
  }else if(modalX === 'miedz'){
    return (
      <ItemBigList value={(item.Sod).toFixed(2)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_3} />
    )
  }else if(modalX === 'iron'){
    return (
      <ItemBigList value={(item.Zelazo).toFixed(2)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_3} />
    )
  }else if(modalX === 'mangan'){
    return (
      <ItemBigList value={(item.Mangan).toFixed(3)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_3} />
    )
  }else if(modalX === 'selen'){
    return (
      <ItemBigList value={(item.Selen).toFixed(4)} width={85} unit={UNIT.UG} backgroundColor={colors.WHtR.WHtR_3} />
    )
  }else if(modalX === 'cynk'){
    return (
      <ItemBigList value={(item.Cynk).toFixed(3)} width={75} unit={UNIT.MG} backgroundColor={colors.WHtR.WHtR_3} />
    )
  }else{
    return(
      <MyCircle percentage={item.index_glycemic} /> 
    )
  }
}
    
    const _goBack = () => navigation.goBack();
    const refRBSheet = useRef();
    const [isOpen, setIsOpen] = useState(true);
    //const [initialItem, setInitialItem] = useState('');
    const [number, onChangeNumber] = React.useState(null);
    const heightMidal = (Dimensions.get('window').height);
    

   /**
   * 
   * @param {float} number 
   * @returns 
   */
  function obliczLG(number){
    
    if(number === null){
      const result = (((product.carbs - product.fiber)*product.index_glycemic)/product.grammage);
      return result;
    }else{
      const num2 = number/100;
      const result = ((((product.carbs - product.fiber)*product.index_glycemic)/product.grammage)*num2);
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
         const result = (((product.carbs - product.fiber)*1)/10);
         return result;
     }else{
         const wartosc = number/100;
         const result = ((((product.carbs - product.fiber)*wartosc)*1)/10);
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
         const result = (product.kcal - (product.protein*4 + product.fat*9))/100;
         return result;
     }else{
         const wartosc = number/100;
         const result = ((product.kcal*wartosc) - ((product.protein*4 + product.fat*9)*wartosc))/100;
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
      const result = product.kcal;
      return result;
      console.log(result);
    }else{
      const wartosc = number/100;
      const result = (product.kcal*wartosc).toFixed();
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
          const result = product.protein;
          return result;
      }else{
          const wartosc = number/100;
          const result = product.protein*wartosc;
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
          const result = product.protein / 28.34952 ;
          return result;
      }else{
          const wartosc = (number/100) / 28.34952;
          const result = product.protein*wartosc;
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
            const result = product.fat;
            return result;
        }else{
            const wartosc = number/100;
            const result = product.fat*wartosc;
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
            const result = product.fat / 28.34952;
            return result;
        }else{
            const wartosc = (number/100) / 28.34952;
            const result = product.fat*wartosc;
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
             const result = product.carbs;
             return result;
         }else{
             const wartosc = number/100;
             const result = product.carbs*wartosc;
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
            const result = product.carbs / 28.34952;
            return result;
        }else{
            const wartosc = (number/100) / 28.34952;
            const result = product.carbs*wartosc;
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
            const result = product.fiber;
            return result;
        }else{
            const wartosc = number/100;
            const result = product.fiber*wartosc;
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
            const result = product.fiber / 28.34952;
            return result;
        }else{
            const wartosc = (number/100) / 28.34952;
            const result = product.fiber*wartosc;
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
               const result = product.Sugars;
               return result;
           }else{
               const wartosc = number/100;
               const result = product.Sugars*wartosc;
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
           const result = product.Sugars / 28.34952;
           return result;
       }else{
           const wartosc = (number/100) / 28.34952;
           const result = product.Sugars*wartosc;
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
          const result = product.choresterol;
          return result;
        }else{
          const wartosc = number/100;
          const result = product.choresterol*wartosc;
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
        const result = product.choresterol / 28.34952;
        return result;
      }else{
        const wartosc = (number/100) / 28.34952;
        const result = product.choresterol*wartosc;
        return result;
      }
    }
 

    const colorIG = () => {
      let color;
      if(product.index_glycemic <= 50){
        color = colors.COLORS.GREEN;
      } else if ((product.index_glycemic >= 51) && (product.index_glycemic <= 71)){
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
      useNativeDriver: false
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
      useNativeDriver: false
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
      useNativeDriver: false
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



  const renderItem =({ item, index }) => (
    <TouchableOpacity 
                onPress={() => {
                  handlePresentModalPress();
                  //setInitialItem(item);
                  getProduct(item)
                  onChangeNumber(null);
                }}
                >
                 
                  <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.SCALE_10, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC, paddingTop: spacing.SCALE_10, paddingBottom: spacing.SCALE_6}}>
                      <View style={{flex: 5, marginRight: 20}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.itemText}>{item.name.toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: spacing.SCALE_10}}>
                      
                      {
                        xxx(item)
                        
                      }

                        {/* <MyCircle percentage={item.index_glycemic} />  */}
                     
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
          inputStyle={{marginLeft: -spacing.SCALE_15}}
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
                renderItem={renderItem}
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
              <MyButton icons="sort" borderColor={colors.COLORS.LIGHT_BLUE} backgroundColor={colors.COLORS.LIGHT_BLUE} 
              onPress={showModal}
              //onPress={sortListFiberASC}
              />
              <MyButton icons="clipboard-edit" borderColor='#343a40' backgroundColor='#343a40' onPress={() => navigation.navigate('MealScreen')}/>
        
        </View>

        <AnimatedFAB
            icon={'plus'}
            label={'Dodaj'}
            //extended={isExtended}
            onPress={() => {
            navigation.navigate('AddGlycemicIndex');
            }}
            visible2={visible2}
            theme={'tertiary'}
            animateFrom={'right'}
            iconMode={'static'}
            //color={colors.COLORS.ORANGE}
            //disabled

            style={[styles.fabStyle, style, fabStyle]}
        />

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
                    <View style={[styles.titleContainer, {flex: 1, justifyContent: 'center', flexDirection: 'row', marginLeft: spacing.SCALE_20}]}>
                       
                        <Text style={styles.textTitle}>{product.name}</Text>
                        <View style={{marginLeft: spacing.SCALE_6}}>
                        <MaterialIcons name='mode-edit' size={spacing.SCALE_24} color={colors.COLORS.WHITE}
                            onPress={() => {
                              bottomSheetModalRef.current.close();
                            navigation.navigate('EditItemGlycemicIndex', {itemId: product.id})
                            }}   
                            />
                        </View>
                    </View>
                    <View style={{justifyContent: 'center', marginRight: spacing.SCALE_10}}>
                      <View style={{}}>
                        
                        <View style={{marginLeft: spacing.SCALE_15}}>
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
          <Text style={styles.titleCategory}>{product.category}</Text>
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
                    value={product.index_glycemic === undefined ? '' : product.index_glycemic}
                    radius={spacing.SCALE_25}
                    duration={2000}
                    progressValueColor={colors.COLORS.DEEP_BLUE}
                    maxValue={110}
                    activeStrokeWidth={8}
                    inActiveStrokeWidth={8}
                    activeStrokeColor={colorIG(product.index_glycemic)}
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
                      value={product.index_glycemic === undefined ? '' : obliczLG(number)}
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
                    value={product.index_glycemic === undefined ? '' : obliczWW(number)}
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
                      value={product.index_glycemic === undefined ? '' : obliczWBT(number)}
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
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE}}>{t('glycemicIndex.protein-fat')}</Text>
          </View>
        </View>
        
        <View style={{paddingHorizontal: spacing.SCALE_6, backgroundColor: colors.COLORS.WHITE, marginTop: spacing.SCALE_6, borderRadius: 5, elevation: 3}}>
          
          
          { product.protein !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.protein')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {product.protein  === undefined ? '' : obliczBialko(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({product.protein  === undefined ? '' : obliczBialkoOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { product.fat !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.fat')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {product.fat  === undefined ? '' : obliczTluszcz(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({product.fat  === undefined ? '' : obliczTluszczOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { product.carbs !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.carbohydrates')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {product.carbs  === undefined ? '' : obliczWeglowodany(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({product.carbs  === undefined ? '' : obliczWeglowodanyOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { product.fiber !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.fiber')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {product.fiber  === undefined ? '' : obliczBlonnik(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({product.fiber  === undefined ? '' : obliczBlonnikOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { product.Sugars !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.sugar')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {product.Sugars  === undefined ? '' : obliczCukier(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({product.Sugars  === undefined ? '' : obliczCukierOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

          { product.choresterol !== 0 &&
          <View style={{flex: 1, borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, marginVertical: spacing.SCALE_6, paddingHorizontal: spacing.SCALE_6}}>
              
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, textTransform: 'uppercase', fontWeight: 'bold'}}>{t('value.cholesterol')}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>
                    {product.choresterol  === undefined ? '' : obliczCholesterol(number).toFixed(1)} {UNIT.GR + ' '}
                  </Text>
                  </View>
                  {isSwitchOn === true &&
                  <View style={{justifyContent: 'flex-end'}}>
                    <Text style={{color: colors.TEXT.GREY_777, fontSize: typography.FONT_SIZE_10}}>
                      ({product.choresterol  === undefined ? '' : obliczCholesterolOZ(number).toFixed(3)} {UNIT.OZ})
                    </Text>
                  </View>
                  }
              </View>

          </View>
          }

        </View>

        <View style={{flex: 1,alignItems: 'center', marginTop: spacing.SCALE_6}}>
          <TouchableOpacity onPress={addMeal} style={styles.btnModal}>
            <Text style={styles.textBtn}>{t('glycemicIndex.add-to-meal')}</Text>
          </TouchableOpacity>       
        </View>

        {product.Status === 0 &&
        <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6, overflow: 'hidden'}}>
            <TouchableOpacity onPress={() => toggleBox1()} style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}>
              <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE, textTransform: 'uppercase'}}>{t('views.modal.vitamins')}</Text>
                <Animated.View style={{transform: [{rotateZ: arrowTransform}]}}>
                  <MaterialIcons name='keyboard-arrow-down' size={20} />
                </Animated.View>
              </View>
            </TouchableOpacity>
            { showContent1  &&  
            <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderBottomRightRadius: spacing.SCALE_5, borderBottomLeftRadius: spacing.SCALE_5}}>
              { product.witA !== 0 &&
              
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.vitamin-a')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{product.witA} {UNIT.IU}</Text>
                  </View>
                </View>
                }

                { product.betaCarotene !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={styles.textBox2}>{t('views.modal.beta-carotene')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.GREY_777, fontWeight: 'bold'}}>{product.betaCarotene} {UNIT.UG}</Text>
                    </View>
                  </View>
                } 

                { product.luteinaZeaksantyna !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={styles.textBox2}>{t('views.modal.lutein-zeaxanthin')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.GREY_777, fontWeight: 'bold'}}>{product.luteinaZeaksantyna} {UNIT.UG}</Text>
                    </View>
                  </View>
                }

                { product.WitB1Tiamina !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b1')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB1Tiamina).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitB2Ryboflawina !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b2')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB2Ryboflawina).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitB3Niacyna !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b3')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB3Niacyna).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitB4Cholina !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b4')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB4Cholina).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitB5KwasPantotenowy !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b5')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB5KwasPantotenowy).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitB6 !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b6')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB6).toFixed(3)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitB9KwasFoliowy !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b9')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB9KwasFoliowy).toFixed(3)} {UNIT.UG}</Text>
                    </View>
                  </View>
                }

                { product.WitB12 !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-b12')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitB12).toFixed(2)} {UNIT.UG}</Text>
                    </View>
                  </View>
                }

                { product.WitC !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-c')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitC).toFixed(2)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitE !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-e')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitE).toFixed(2)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.WitK !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.vitamin-k')}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.WitK).toFixed(2)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }
              </View>
               
            }
        </View>
        }

        { product.Status === 0 &&
          <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6, overflow: 'hidden'}}>
          <TouchableOpacity onPress={() => toggleBox2()} style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE}}>{t('views.modal.macronutrients')}</Text>
                <Animated.View style={{transform: [{rotateZ: arrowTransform2}]}}>
                  <MaterialIcons name='keyboard-arrow-down' size={20} />
                </Animated.View>
              </View>
          </TouchableOpacity>
          
          { showContent2  &&  
              <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderBottomRightRadius: spacing.SCALE_5, borderBottomLeftRadius: spacing.SCALE_5}}>
                { product.Wapn !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.calcium')}</Text>
                      
                    </View>
                    
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.Wapn).toFixed(1)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.Magnez !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.magnesium')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Magnez).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { product.Fosfor !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.phosphorus')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Fosfor).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { product.Potas !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.potassium')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Potas).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { product.Sod !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.sodium')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Sod).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

              </View>
          }
        </View>
      }

      { product.Status === 0 &&
          <View style={{backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_6, overflow: 'hidden'}}>
          <TouchableOpacity onPress={() => toggleBox3()} style={{padding: spacing.SCALE_10, backgroundColor: colors.COLORS.LIGHT_GREY, borderTopStartRadius: spacing.SCALE_5, borderTopEndRadius: spacing.SCALE_5}}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE}}>{t('views.modal.microelements')}</Text>
                <Animated.View style={{transform: [{rotateZ: arrowTransform3}]}}>
                  <MaterialIcons name='keyboard-arrow-down' size={20} />
                </Animated.View>
              </View>
          </TouchableOpacity>
          
          { showContent3  &&  
              <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderBottomRightRadius: spacing.SCALE_5, borderBottomLeftRadius: spacing.SCALE_5}}>
                { product.Miedz !== 0 &&
                  <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.textBox1}>{t('views.modal.copper')}</Text>
                      
                    </View>
                    
                    <View style={{alignItems: 'flex-end'}}>
                      <Text style={styles.textBox3}>{(product.Miedz).toFixed(1)} {UNIT.MG}</Text>
                    </View>
                  </View>
                }

                { product.Zelazo !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.iron')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Zelazo).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { product.Mangan !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.manganese')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Mangan).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { product.Selen !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.selenium')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Selen).toFixed(1)} {UNIT.MG}</Text>
                  </View>
                </View>
                }

                { product.Cynk !== 0 &&
                <View style={{flexDirection: 'row', paddingHorizontal: spacing.SCALE_20, paddingVertical: spacing.SCALE_6, borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBox1}>{t('views.modal.zinc')}</Text>
                    
                  </View>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBox3}>{(product.Cynk).toFixed(1)} {UNIT.MG}</Text>
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
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_3}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{t('glycemicIndex.modal.sort-by')}</Text>
            </View>
            <View style={{flex: 2}}>
             
              <MySwitch2
                selectionMode={switchSort}
                roundCorner={true}
                option1={t('glycemicIndex.modal.ascending')}
                option2={t('glycemicIndex.modal.descending')}
                onSelectSwitch={onSelectSwitch}
                selectionColor={colors.COLORS.DEEP_BLUE}
              /> 
            </View>
          </View>
         
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
            <View style={{flex: 1}}>
              <TouchableOpacity style={{alignItems: 'center', padding: spacing.SCALE_10, backgroundColor: colors.COLORS.DEEP_BLUE, borderRadius: spacing.SCALE_5}} onPress={sortListIndex} >
                <Text style={{color: colors.TEXT.WHITE, textTransform: 'uppercase'}}>{t('glycemicIndex.modal.btn-reset')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
          <View style={{flex: 1, flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.protein')} onPress={sortListProtein} backgroundColor={colors.WHtR.WHtR_1}/>
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.fat')} onPress={sortListFat} />
            </View>
          
            <View style={{marginLeft: spacing.SCALE_6, marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.carbohydrates')} onPress={sortListCarbs} />
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.fiber')} onPress={sortListFiber} />
            </View>
          </View>

          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.sugar')} onPress={sortListSugar} />
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.cholesterol')} onPress={sortListCholesterol} />
            </View>
          </View>

          <View style={{marginBottom: spacing.SCALE_6, marginTop: spacing.SCALE_3, alignItems: 'center'}}>
            <Text style={styles.textTitleModal}>{t('value.macronutrients')}</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.calcium')} onPress={sortListWapn} backgroundColor={colors.PRESSURE.P2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.magnesium')} onPress={sortListMagnez} backgroundColor={colors.PRESSURE.P2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_6}}>
              <BtnModal title={t('value.phosphorus')} onPress={sortListFosfor} backgroundColor={colors.PRESSURE.P2} />
            </View>
            
          </View>
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
          <View style={{}}>
              <BtnModal title={t('value.potassium')} onPress={sortListPotas} backgroundColor={colors.PRESSURE.P2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_6}}>
              <BtnModal title={t('value.sodium')} onPress={sortListSod} backgroundColor={colors.PRESSURE.P2} />
            </View>
          </View>

          <View style={{marginBottom: spacing.SCALE_3, marginTop: spacing.SCALE_6, alignItems: 'center'}}>
            <Text style={styles.textTitleModal}>{t('value.micronutrients')}</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.copper')} onPress={sortListMiedz} backgroundColor={colors.WHtR.WHtR_3} />
            </View>
            
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.iron')} onPress={sortListIron} backgroundColor={colors.WHtR.WHtR_3} />
            </View>

            <View style={{marginLeft: spacing.SCALE_6}}>
              <BtnModal title={t('value.manganese')} onPress={sortListMangan} backgroundColor={colors.WHtR.WHtR_3} />
            </View>

            <View style={{marginLeft: spacing.SCALE_6}}>
              <BtnModal title={t('value.selenium')} onPress={sortListSelen} backgroundColor={colors.WHtR.WHtR_3} />
            </View>

            
          </View>
          <View style={{alignItems: 'flex-start'}}>
              <BtnModal title={t('value.zinc')} onPress={sortListCynk} backgroundColor={colors.WHtR.WHtR_3} />
            </View>

          <View style={{marginBottom: spacing.SCALE_3, marginTop: spacing.SCALE_3, alignItems: 'center'}}>
            <Text style={styles.textTitleModal}>{t('value.vitamins')}</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.Vitamin-A')} onPress={sortListWitA} backgroundColor={colors.WHtR.WHtR_2}/>
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.beta-carotene')} onPress={sortListBetaCaroten} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
          </View>

          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.Lutein-Zeaxanthin')} onPress={sortListLuteina} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.Vitamin-B1')} onPress={sortListWitB1} backgroundColor={colors.WHtR.WHtR_2}/>
            </View>
          </View>
        
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.Vitamin-B2')} onPress={sortListWitB2} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.Vitamin-B3')} onPress={sortListWitB3} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
          </View>

          <View style={{flex: 1, marginBottom: spacing.SCALE_6}}>
            <View style={{alignItems: 'flex-start' }}>
              <BtnModal title={t('value.Vitamin-B4')} onPress={sortListWitB4} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
          </View>

          <View style={{flex: 1, marginBottom: spacing.SCALE_6}}>
            <View style={{alignItems: 'flex-start'}}>
              <BtnModal title={t('value.Vitamin-B5')} onPress={sortListWitB5} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
          </View>

          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{ marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.Vitamin-B6')} onPress={sortListWitB6} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.Vitamin-B9')} onPress={sortListWitB9} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
          </View>

          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6, flexWrap: 'wrap'}}>
            <View style={{marginRight: spacing.SCALE_3 }}>
              <BtnModal title={t('value.Vitamin-B12')} onPress={sortListWitB12} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_3}}>
              <BtnModal title={t('value.Vitamin-C')} onPress={sortListWitC} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
            <View style={{marginLeft: spacing.SCALE_6 }}>
              <BtnModal title={t('value.Vitamin-E')} onPress={sortListWitE} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
          </View>

          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
            
            <View style={{}}>
              <BtnModal title={t('value.Vitamin-K')} onPress={sortListWitK} backgroundColor={colors.WHtR.WHtR_2} />
            </View>
          </View>

          </ScrollView>
        </Modal>
      </Portal>
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