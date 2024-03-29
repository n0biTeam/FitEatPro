import React, { useCallback, useMemo, useRef, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, ImageBackground, ActivityIndicator, TouchableOpacity, ToastAndroid, Animated, BackHandler, TextInput } from 'react-native';
import { Searchbar, AnimatedFAB, DefaultTheme, Provider as PaperProvider, Modal, Portal, Provider } from 'react-native-paper';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import MyCircle from '../../components/MyCirclePurine';
import { MyButton } from '../../components/MyButtonPurine';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors, spacing, typography } from '../../styles';
import { useTranslation } from 'react-i18next';
import { ScrollView} from 'react-native-gesture-handler';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.COLORS.LIGHT_BLUE,
      accent: colors.COLORS.YELLOW,
    },
  };


  const PurineListScreen = ({ 
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
    

    const getList = () => {
        firestore().collection('users').doc(user.uid).collection('purines')
        .orderBy('name', 'asc')
        .onSnapshot(
           querySnapshot => {
           const arraylistData = []

               querySnapshot.forEach(doc => {
                arraylistData.push({...doc.data(), id: doc.id})
              });
              
                 setListData(arraylistData);
                 setFilteredDataSource(arraylistData);
                 setMasterDataSource(arraylistData);
              },
                error => {
                 console.log(error)
              }
        )
    };

    useEffect(() => {
        getList();
      }, []);

      
// ref
const bottomSheetModalRef = useRef(null);

// variables
const snapPoints = useMemo(() => ['35%', '50%'], []);

// callbacks
const handlePresentModalPress = useCallback(() => {
  bottomSheetModalRef.current?.present();
}, []);

const [indx, setIndx] = useState(0);

const handleSheetChanges = useCallback((index) => {

  console.log('handleSheetChanges', index);
}, []);

    
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
    return obj1.purine - obj2.purine;
  });
  setMasterDataSource([...listData]);
};

const sortListDES = () => {
  filteredDataSource.sort((obj1, obj2) => {
    return obj2.purine - obj1.purine;
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

    
    const _goBack = () => navigation.navigate('HomeScreen');
    const refRBSheet = useRef();
    const [isOpen, setIsOpen] = useState(true);
    const [initialItem, setInitialItem] = useState('');
    const [number, onChangeNumber] = React.useState(null);
    const heightMidal = (Dimensions.get('window').height/2);
    

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


    const colorPurine = () => {
      let color;
      if(initialItem.purine <= 50){
        color = colors.PURINE.P1;
      } else if ((initialItem.purine >= 51) && (initialItem.purine <= 150)){
        color = colors.PURINE.P2;
      }else {
        color = colors.PURINE.P3;
      }
      return color;
  }
  

  const colorUricAcid = () => {
    let color;
    if(initialItem.uricAcid <= 50*2.4){
      color = colors.PURINE.P1;
    } else if ((initialItem.uricAcid >= 51*2.4) && (initialItem.uricAcid <= 150*2.4)){
      color = colors.PURINE.P2;
    }else {
      color = colors.PURINE.P3;
    }
    return color;
}



  const renderItem =({ item, index }) => (
    <TouchableOpacity 
                onPress={() => {
                  handlePresentModalPress();
                  setInitialItem(item);
                  onChangeNumber(null);
                }}
                >
                 
                 <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.SCALE_10, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC, paddingTop: spacing.SCALE_10, paddingBottom: spacing.SCALE_6}}>
                      <View style={{flex: 5}}>
                        <Text numberOfLines={1} style={styles.itemText}>{item.name.toUpperCase()}</Text>
                      </View>
                  
                      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: spacing.SCALE_10}}>
                      <MyCircle percentage={item.purine} /> 
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
        <View style={{ paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', backgroundColor: colors.COLORS.DEEP_BLUE, marginBottom: spacing.SCALE_6}}>
        <View style={{marginRight: spacing.SCALE_15, justifyContent: 'center'}}>
            <TouchableOpacity onPress={_goBack}>
                <AntDesign name='arrowleft' color={colors.COLORS.WHITE} size={isTablet ? spacing.SCALE_10 : spacing.SCALE_24}/>
            </TouchableOpacity>
        </View>
        <View style={{flex: 1, marginTop: spacing.SCALE_10, marginBottom: spacing.SCALE_10}}>
        <Searchbar
          placeholder={t('glycemicIndex.search')}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          iconColor={colors.COLORS.DEEP_BLUE}
          inputStyle={{marginLeft: isTablet ? 0 : -spacing.SCALE_15}}
        />
        </View>

    </View>
        <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE}}>
    
            { 
            listData.length > 0 ?
            (
                <BigList
                data={filteredDataSource}
                renderItem={renderItem}
                itemHeight={scale(50)}
                />
            ) : (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <ActivityIndicator size="large" color={colors.COLORS.GREY_CCC} />
                </View>
            )
            }
        
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 2, marginTop: 3, backgroundColor: colors.COLORS.WHITE}}>

          <MyButton icons="sort-alphabetical-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaASC}/>
          <MyButton icons="sort-alphabetical-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaDES}/>
          <MyButton icons="sort-numeric-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListASC}/>
          <MyButton icons="sort-numeric-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListDES}/>
        
        </View>

        <AnimatedFAB
            icon={'plus'}
            label={'Dodaj'}
            onPress={() => {
            navigation.navigate('PurineAddScreen');
            }}
            visible2={visible2}
            theme={'tertiary'}
            animateFrom={'right'}
            iconMode={'static'}
            style={[styles.fabStyle, style, fabStyle]}
        />

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
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
                       
                        <Text style={styles.textTitle}>{initialItem.name}</Text>
                        <View style={{marginLeft: spacing.SCALE_6}}>
                        <MaterialIcons name='mode-edit' size={spacing.SCALE_24} color={colors.COLORS.WHITE}
                            onPress={() => {
                              bottomSheetModalRef.current.close();
                              navigation.navigate('PurineEditScreen', {itemId: initialItem.id})
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
  

      <ScrollView>
      <View style={{marginHorizontal: spacing.SCALE_8}}>

        <View style={{flexDirection: 'row', borderWidth: 1, padding: spacing.SCALE_6, borderColor: colors.COLORS.LIGHT_BLUE, borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_5, backgroundColor: colors.COLORS.LIGHT_BLUE, elevation: 1}}>
          <Text style={{marginRight: spacing.SCALE_4, fontSize: typography.FONT_SIZE_14, color: colors.TEXT.WHITE}}>{t('purineListScreen.category')} <Text style={styles.titleCategory}>{initialItem.category}</Text></Text>
         
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: spacing.SCALE_5, paddingVertical: spacing.SCALE_5, marginRight: spacing.SCALE_3, elevation: 3}}>
            <CircularProgress
                    value={initialItem.purine}
                    radius={35}
                    duration={1000}
                    progressValueColor={colors.COLORS.DEEP_BLUE}
                    maxValue={754}
                    activeStrokeWidth={12}
                    inActiveStrokeWidth={12}
                    activeStrokeColor={colorPurine(initialItem.purine)}
                    progressValueStyle={{ fontWeight: 'bold', fontSize: typography.FONT_SIZE_20 }}
                    dashedStrokeConfig={{
                      count: 40,
                      width: 5,
                    }}
                  />
                  <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('purineListScreen.purine')} [mg]</Text>
          </View>

          <View style={{flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderRadius: spacing.SCALE_5, paddingVertical: spacing.SCALE_5, marginLeft: spacing.SCALE_3, elevation: 3}}>
            <CircularProgress
                      value={initialItem.uricAcid}
                      radius={35}
                      duration={1000}
                      progressValueColor={colors.COLORS.DEEP_BLUE}
                      maxValue={1810}
                      activeStrokeWidth={12}
                      inActiveStrokeWidth={12}
                      activeStrokeColor={colorUricAcid(initialItem.uricAcid)}
                      progressValueStyle={{ fontWeight: 'bold', fontSize: typography.FONT_SIZE_20 }}
                      dashedStrokeConfig={{
                        count: 40,
                        width: 5,
                      }}
                    />
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('purineListScreen.uric-acid')} [mg]</Text>
          </View>
        </View>

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
      alignItems: 'center',
      backgroundColor: colors.COLORS.DEEP_BLUE,
      padding: spacing.SCALE_10,
    },
    textTitle: {
      fontSize: typography.FONT_SIZE_16,
      color: colors.TEXT.WHITE,
      textTransform: 'uppercase',
      fontWeight: 'bold',
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
      width: 200,
      textAlign: 'center',
      height: 40,
      color: colors.TEXT.DEEP_BLUE,
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

export default PurineListScreen;