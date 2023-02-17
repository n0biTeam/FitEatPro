import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import { format } from 'date-fns';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Appbar, Searchbar } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';

const DiaryScreen = ({ navigation }) => {

    const {t, i18n} = useTranslation();
  
    const {user} = useContext(AuthContext); 
    const [diaryData, setDiaryData] = useState([]);

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState(diaryData);
    const [masterDataSource, setMasterDataSource] = useState(diaryData);
    const [loading, setLoading] = useState(true);
  
    const getDiary = () => {
      firestore().collection('users').doc(user.uid).collection('diary')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
           querySnapshot => {
            const diaryData = [];
              querySnapshot.forEach(doc => {

                diaryData.push({...doc.data(), id: doc.id}); 

              });
                 setDiaryData(diaryData);
                 setFilteredDataSource(diaryData);
                 setMasterDataSource(diaryData);
                 //console.log(diaryData);
              },
                error => {
                 console.log(error)
              }
          
        )
    };
  
    useEffect(() => {
      getDiary();
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
      }
    })
  }
 
  useEffect(() => {
    getUser();
   const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
   }, [navigation, loading, isSwitchOn]);
   
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

  const searchFilterFunction = (text) => {
 
    if (text) {
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.title
            ? item.title.toUpperCase()
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
    setMasterDataSource([...diaryData]);
  };
  
  const sortListDES = () => {
    filteredDataSource.sort((obj1, obj2) => {
      return obj2.index_glycemic - obj1.index_glycemic;
    });
    setMasterDataSource([...diaryData]);
  };
  
  const imageBG = require('../../assets/images/drewno2.jpg');


  return (
    <SafeAreaProvider style={{ flexGrow: 1}}>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    {/* <Appbar.BackAction onPress={_goBack} /> */}
       <Appbar.Content title={t('diaryScreen.meal-log')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <View style={{ paddingHorizontal: spacing.SCALE_6, flexDirection: 'row', backgroundColor: colors.COLORS.DEEP_BLUE}}>
       
        <View style={{flex: 1, marginBottom: spacing.SCALE_8}}>
        <Searchbar
          placeholder={t('diaryScreen.search')}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          iconColor={colors.COLORS.DEEP_BLUE}
        />
        </View>

    </View>
    <View style={{flex: 1, backgroundColor: colors.COLORS.LIGHT_GREY}}> 
 
    <View style={{flex: 1, marginHorizontal: spacing.SCALE_6, marginTop: spacing.SCALE_6, marginBottom: spacing.SCALE_6}}>
    { 
    diaryData.length > 0 ?
      (
      <BigList 
        data={filteredDataSource}
        onEndReachedThreshold={1}
        itemHeight={210}
        renderItem={({item, index}) => (
              <TouchableOpacity 
                style={{}}
                onPress={() => {
                    navigation.navigate('DiaryItemScreen', {
                      itemId: item.id
                    });
                }}
              >
               <ImageBackground 
                source={imageBG}
                blurRadius={1}
                resizeMode="cover"
                style={{
                  //flex: 1, 
                  height: Dimensions.get('window').height,
                  //width: Dimensions.get('window').width,
                 
                  height: 205,
                }}
                imageStyle={{
                  opacity: 0.6,
                  //flex: 1, 
                  borderRadius: 5,
                }}
               >
                  <View style={{flex: 1, padding: spacing.SCALE_10, borderColor: colors.COLORS.GREY_AAA, borderWidth: 1, borderRadius: 5}}>
                    <Text style={styles.titleBox}>{item.title}</Text>
                  
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_5, borderRadius: 5, marginRight: spacing.SCALE_3}}>
                          <Text style={{fontSize: 10}}>{t('diaryScreen.calories')}</Text>
                          <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_15, fontWeight: 'bold'}}>{(item.sumKcal).toFixed(0)} kcal / {(item.sumKcal*4.184).toFixed(0)} kJ</Text>
                        </View>
                        
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_5, borderRadius: 5, marginLeft: spacing.SCALE_3}}>
                           <Text style={{ fontSize: typography.FONT_SIZE_10}}>{t('diaryScreen.meal-weight')}</Text>
                           <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_15, fontWeight: 'bold'}}>{item.gramme} {UNIT.GR}</Text>
                           {isSwitchOn === true &&
                              <Text style={{ fontSize: typography.FONT_SIZE_10, fontWeight: 'bold'}}>{(item.gramme / 28.34952).toFixed(3)} {UNIT.OZ}</Text>
                           }
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: spacing.SCALE_6, alignItems: 'center'}}>
                        
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_5, borderRadius: 5, marginRight: spacing.SCALE_3}}>
                          
                            <Text style={{ fontSize: typography.FONT_SIZE_10, marginBottom: spacing.SCALE_3}}>{t('diaryScreen.meal-index')}</Text>
                              <CircularProgress
                              value={item.indexGlycemic}
                              radius={spacing.SCALE_20}
                              //duration={2000}
                              activeStrokeWidth={6}
                              inActiveStrokeWidth={6}
                              progressValueColor={colors.COLORS.DEEP_BLUE}
                              maxValue={200}
                              progressValueStyle={{ color: colors.COLORS.DEEP_BLUE, fontSize: typography.FONT_SIZE_11, fontWeight:'bold' }}
                              activeStrokeColor={colorFirst(item.indexGlycemic)}
                              progressFormatter={(value, total) => {
                                'worklet';   
                                return value.toFixed(1);
                              }}
                              dashedStrokeConfig={{
                                count: 22,
                                width: 5,
                              }}
                            />
  
                        </View>
                          

                          <View style={{marginLeft: spacing.SCALE_6, flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_5, borderRadius: 5, marginLeft: spacing.SCALE_3}}>
                             
                              <Text style={{ fontSize: typography.FONT_SIZE_10, marginBottom: spacing.SCALE_5}}>{t('diaryScreen.meal-load')}</Text>
                                  <CircularProgress
                                    value={item.loadGlycemic}
                                    radius={spacing.SCALE_20}
                                    activeStrokeWidth={6}
                                    inActiveStrokeWidth={6}
                                    //duration={2000}
                                    progressValueColor={colors.COLORS.DEEP_BLUE}
                                    maxValue={item.loadGlycemic >= 20 ? item.loadGlycemic : 20}
                                    progressValueStyle={{ color: colors.COLORS.DEEP_BLUE, fontSize: typography.FONT_SIZE_11, fontWeight:'bold' }}
                                    activeStrokeColor={colorLG(item.loadGlycemic)}
                                    progressFormatter={(value, total) => {
                                      'worklet';   
                                      return value.toFixed(1);
                                    }}
                                    dashedStrokeConfig={{
                                      count: 22,
                                      width: 5,
                                    }}
                                  />
                             
                          </View>
                          
                        
                      
                    </View>
                      
                      <View style={{alignItems: 'flex-end'}}>
                          {/* <Text style={styles.dataBox}>{t('diaryScreen.date-added')} {item.createdAt.toDate().toLocaleDateString('pl-PL')}, {item.createdAt.toDate().toLocaleTimeString('pl-PL')}</Text> */}
                          <Text style={styles.dataBox}>{t('diaryScreen.date-added')} {format(item.createdAt.toDate(), 'dd/MM/yyyy, HH:mm')}</Text>
                      </View>
                  </View>
                     
               </ImageBackground>

              </TouchableOpacity>

        )}
      />
      ) : ( 
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: colors.COLORS.DEEP_BLUE, fontSize: typography.FONT_SIZE_20, fontWeight: 'bold'}}>{t('diaryScreen.empty-list')}</Text>
        </View>
      )}
    </View>
        
    </View>
    
    
    </SafeAreaProvider>
    
  )
}

export default DiaryScreen;

const styles = StyleSheet.create({
    viewBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.COLORS.WHITE,
        backgroundColor: colors.COLORS.WHITE,
        padding: spacing.SCALE_8,
        borderRadius: 5,
        marginBottom: spacing.SCALE_6, 
        elevation: 4,
    },
    titleBox: {
        color: colors.COLORS.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_18,
        fontWeight: 'bold',
        marginBottom: spacing.SCALE_3
    },
    dataBox: {
        marginTop: spacing.SCALE_6,
        fontSize: typography.FONT_SIZE_11,
        color: colors.COLORS.DEEP_BLUE,
        fontStyle: 'italic',
        backgroundColor: colors.COLORS.WHITE,
        padding: spacing.SCALE_3,
        borderRadius: 5
    }

})