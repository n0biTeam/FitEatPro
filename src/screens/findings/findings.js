import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, Image } from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, AnimatedFAB, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { AuthContext } from '../../navigation/AuthProvider';
import { format } from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import BigList from "react-native-big-list";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.COLORS.LIGHT_BLUE,
      accent: colors.COLORS.YELLOW,
    },
  };

const FindingScreen = ({  
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
  const [getData, setGetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFindings = () => {
    firestore().collection('users').doc(user.uid).collection('findings')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
         querySnapshot => {
          const getData = [];
            querySnapshot.forEach(doc => {
          
             if( doc.exists ) {
              getData.push({...doc.data(), id: doc.id}); 
             }
             
            });
            setGetData(getData);
              
            },
              error => {
               console.log(error)
            }
        
    )
  }

  useEffect(() => {
      
    getFindings();

    const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
  }, [navigation, loading]);
  
  const _goBack = () => navigation.navigate('HomeScreen');
  const imageBG = require('../../assets/images/wynik1.jpg');
    
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('findingScreen.title')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={1}
    resizeMode="cover"
    style={{  
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.4
      }}
    
  >
    
    <View style={styles.rootContainer}>
        
        {getData.length > 0 ?
          (
          <BigList
              data={getData}
              onEndReachedThreshold={1}
              itemHeight={60}
              renderItem={({item}) => (
              
                <TouchableOpacity onPress={() => 
                  navigation.navigate('FindingViewScreen', {itemId: item.id})
                }>
                  <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_3, borderRadius: spacing.SCALE_5, elevation: 2, marginHorizontal: spacing.SCALE_6}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                          {
                            item.imageUrl != null
                            ? <Image source={{uri: item.imageUrl}} style={{width: 50, height: 50}} /> 
                            : <MaterialCommunityIcons name='image' size={spacing.SCALE_50} color={colors.COLORS.GREY_AAA} />
                          }
                        </View>

                        <View style={{flexDirection: 'column', justifyContent: 'center', flex: 1}}>
                          <View style={{marginLeft: spacing.SCALE_6}}>
                            <Text numberOfLines={1} style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE}}>{item.title}</Text>
                          </View>
                          <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                            <Text style={styles.dateText}>{t('findingScreen.last-save')} </Text>
                            <Text style={styles.dateText}>{format(item.createdAt.toDate(), 'yyyy/MM/dd')}, </Text>
                            <Text style={styles.dateText}>{format(item.createdAt.toDate(), 'HH:mm')}</Text>
                          </View>
                        </View>


                    </View>
                  </View>
                
                </TouchableOpacity>
                
              )}
            />
            ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, fontWeight: 'bold'}}>{t('findingScreen.no-test-results')}</Text>
            </View>
            )
           
            }
      
        </View>

    
    
    
    <AnimatedFAB
        icon={'plus'}
        label={'Dodaj'}
        onPress={() => {
            navigation.navigate('FindingAddScreen');
        }}
        visible={visible}
        theme={'tertiary'}
        animateFrom={'right'}
        iconMode={'static'}
          style={[styles.fabStyle, style, fabStyle]}
      />
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default FindingScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginTop: spacing.SCALE_6,
    marginBottom: spacing.SCALE_6,
  },
  fabStyle: {
    bottom: spacing.SCALE_16,
    right: spacing.SCALE_16,
    position: 'absolute',
  },
  dateText: {
    fontSize: typography.FONT_SIZE_11,
    fontStyle: 'italic'
  }
})