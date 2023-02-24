import { StyleSheet, Text, View, ImageBackground, StatusBar, TextInput, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import React, {useContext, useState, useEffect, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Searchbar, AnimatedFAB, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import MyCircle from '../../components/MyCirclePurine';
import { MyButton } from '../../components/MyButtonPurine';
import RBSheet from "react-native-raw-bottom-sheet";
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors, spacing, typography } from '../../styles';
import { useTranslation } from 'react-i18next';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_GREY,
    accent: colors.COLORS.YELLOW,
  },
};

const PurineListScreen = ({ 
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
       // setIsOpen(false);
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


  // const boxPurine = (item) => {
  //   if(item.purine <= 50){
  //       return (
  //           <View style={{borderWidth: spacing.SCALE_3, borderColor: colors.PURINE.P1, backgroundColor: colors.PURINE.P1, width: spacing.SCALE_50, marginRight: spacing.SCALE_10, paddingVertical: 1, borderRadius: spacing.SCALE_5, alignItems: 'center'}}>
  //               <Text style={{fontSize: 14, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{item.purine}</Text>
  //           </View>
  //       )
  //   }else if ((item.purine >= 51) && (item.purine <= 150)){
  //       return (
  //           <View style={{borderWidth: spacing.SCALE_3, borderColor: colors.PURINE.P2, backgroundColor: colors.PURINE.P2, width: spacing.SCALE_50, marginRight: spacing.SCALE_10, paddingVertical: 1, borderRadius: spacing.SCALE_5, alignItems: 'center'}}>
  //               <Text style={{fontSize: 14, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{item.purine}</Text>
  //           </View>
  //       )
  //   }else {
  //       return (
  //           <View style={{borderWidth: spacing.SCALE_3, borderColor: colors.PURINE.P3, backgroundColor: colors.PURINE.P3, width: spacing.SCALE_50, marginRight: spacing.SCALE_10, paddingVertical: 1, borderRadius: spacing.SCALE_5, alignItems: 'center'}}>
  //               <Text style={{fontSize: 14, fontWeight: 'bold', color: colors.TEXT.BLACK}}>{item.purine}</Text>
  //           </View>
  //       )
  //   }

  // }

  return (
    <PaperProvider theme={theme}>
       <StatusBar translucent={false} backgroundColor={colors.COLORS.DEEP_BLUE} barStyle="light-content"/>
    <SafeAreaProvider style={{marginTop: 0, flexGrow: 1, backgroundColor: colors.COLORS.WHITE}}>
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
      blurRadius={10}
      style={{
        flex: 1, 
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
      }}
      imageStyle={{
        opacity: 0.8
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
                  navigation.navigate('PurineEditScreen', {itemId: initialItem.id})
                }} />
          </View>
        </View>
        {/* <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 6}}>
          <View style={{justifyContent: 'center'}}>
            <Text style={{color: '#224870', fontWeight: 'bold', marginRight: 10}}>Podaj ilość:</Text>
          </View>
              <TextInput
                style={styles.textInput}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="100"
                keyboardType="numeric"
              />
              <Text style={{marginTop: 10, fontWeight: 'bold', color: '#224870'}}> g</Text>
        </View> */}

      <ScrollView>
      <View style={{marginHorizontal: spacing.SCALE_8}}>

        <View style={{flexDirection: 'row', borderWidth: 1, padding: spacing.SCALE_6, borderColor: colors.COLORS.LIGHT_BLUE, borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_5, backgroundColor: colors.COLORS.LIGHT_BLUE, elevation: 1}}>
          <Text style={{marginRight: spacing.SCALE_4, fontSize: typography.FONT_SIZE_14, color: colors.TEXT.WHITE}}>{t('purineListScreen.category')}</Text>
          <Text style={styles.titleCategory}>{initialItem.category}</Text>
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
                    //   progressFormatter={(value, number) => {
                    //     'worklet';   
                    //     return value.toFixed(0);
                    //   }}
                    />
                    <Text style={{fontSize: typography.FONT_SIZE_10, color: colors.TEXT.DEEP_BLUE, marginTop: spacing.SCALE_5}}>{t('purineListScreen.uric-acid')} [mg]</Text>
          </View>
        </View>

        </View>
        

      


      {/* <View style={{flex: 1,alignItems: 'center', marginTop: 10}}>
        <TouchableOpacity onPress={addMeal} style={styles.btnModal}>
          <Text style={styles.textBtn}>Dodaj do posiłku</Text>
        </TouchableOpacity>
       
      </View> */}
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
          placeholder={t('purineListScreen.search')}
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
                        <Text numberOfLines={1} style={styles.itemText}>{item.name.toUpperCase()}</Text>
                      </View>
                  
                      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: spacing.SCALE_10}}>
                      <MyCircle percentage={item.purine} /> 
                        {/* <Text>{boxPurine(item)}</Text> */}
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
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: spacing.SCALE_2, marginTop: spacing.SCALE_3, backgroundColor: colors.COLORS.WHITE}}>

              <MyButton icons="sort-alphabetical-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaASC}/>
              <MyButton icons="sort-alphabetical-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListAlfaDES}/>
              <MyButton icons="sort-numeric-ascending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListASC}/>
              <MyButton icons="sort-numeric-descending" borderColor={colors.COLORS.DEEP_BLUE} backgroundColor={colors.COLORS.DEEP_BLUE} onPress={sortListDES}/>
              
        
      </View>

    <AnimatedFAB
        icon={'plus'}
        label={'Dodaj'}
        //extended={isExtended}
        onPress={() => {
          navigation.navigate('PurineAddScreen');
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

export default PurineListScreen;

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
      borderRadius: spacing.SCALE_10,
      alignItems: 'center',
      backgroundColor: colors.COLORS.DEEP_BLUE,
      elevation: 3,
      marginBottom: spacing.SCALE_10,
    },
    textBtn: {
      color: colors.COLORS.WHITE
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
      color: colors.COLORS.WHITE,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    titleKcal:{
      fontSize: typography.FONT_SIZE_30,
      color: colors.COLORS.DEEP_BLUE,
      fontWeight: 'bold',
    },
    textInput: {
      borderBottomWidth: spacing.SCALE_4,
      borderTopLeftRadius: spacing.SCALE_5,
      borderTopRightRadius: spacing.SCALE_5,
      borderBottomColor: colors.COLORS.DEEP_BLUE,
      width: 200,
      textAlign: 'center',
      height: 40,
      color: colors.TEXT.DEEP_BLUE,
      fontWeight: 'bold',
    },
    fabStyle: {
      bottom: spacing.SCALE_20,
      right: spacing.SCALE_16,
      position: 'absolute',
      marginBottom: spacing.SCALE_35,
    },
})