import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, Alert } from 'react-native'
import { AnimatedFAB, DefaultTheme, Provider as PaperProvider, Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import BigList from "react-native-big-list";
import { colors, typography, spacing } from '../../styles';
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
const image = {uri: 'https://reactjs.org/logo-og.png'};

const NotesScreen = ({  
  navigation,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode }) => {
  
  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === 'ios';
    
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
    setIsExtended(currentScrollPosition <= 0);
  };
  
  const fabStyle = { [animateFrom]: 16 };

  const {user} = useContext(AuthContext);
  const [getData, setGetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNotes = () => {
    firestore().collection('users').doc(user.uid).collection('notes')
      .orderBy('createdAt', 'desc')
      //.limit(30)
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
      
    getNotes();

    const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
  }, [navigation, loading]);

  const _alertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '',
      //body
      'Czy napewno chcesz usunąć wszystkie notatki ?',
      [
        { text: 'TAK', onPress: () => _handleDeleteAllNote() },
        {
          text: 'NIE',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  const _handleDeleteAllNote = async () => {
    const notesQuerySnapshot = 
        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('notes')
        .get();
      
        const batch = firestore().batch();
      
        notesQuerySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        navigation.navigate('NotesScreen');
        return batch.commit();
  }

  const _goBack = () => navigation.navigate('HomeScreen');

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


  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Notatki" />
        <Appbar.Action icon="trash-can" onPress={_alertHandler} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={require('../../assets/images/note1.jpg')}
    blurRadius={1}
    resizeMode="cover"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.7
      }}
    
  >
    
        <View style={styles.rootContainer}>
        
        { getData.length > 0 ?
          (
          <BigList
              data={getData}
              onEndReachedThreshold={1}
              itemHeight={58}
              renderItem={({item}) => (
              
                <TouchableOpacity onPress={() => 
                  navigation.navigate('NotesEditScreen', {itemId: item.id})
                }>
                
                <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_8, borderRadius: 5, elevation: 4, marginHorizontal: spacing.SCALE_6}}>
                  <View>
                    <Text numberOfLines={1} style={{fontSize: typography.FONT_SIZE_16, color: colors.TEXT.DEEP_BLUE}}>{item.title}</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <Text style={styles.dateText}>Ostatni zapis: </Text>
                        <Text style={styles.dateText}>{format(item.createdAt.toDate(), 'yyyy/MM/dd')}, </Text>
                        <Text style={styles.dateText}>{format(item.createdAt.toDate(), 'HH:mm')}</Text>
                  </View>
                </View>

                </TouchableOpacity>
                
              )}
            />
            ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, fontWeight: 'bold'}}>Brak notatek</Text>
            </View>
            )
           
            }
      
        </View>
        
        <View>
        <AnimatedFAB
        icon={'plus'}
        label={'Dodaj'}
       // extended={isExtended}
        onPress={() => {
            navigation.navigate('NotesAddScreen');
        }}
        visible={visible}
        theme={'tertiary'}
        animateFrom={'right'}
        iconMode={'static'}
        //color={COLORS.ORANGE}

        style={[styles.fabStyle, style, fabStyle]}
      />
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
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default NotesScreen;

const styles = StyleSheet.create({
  rootContainer: {
    //marginHorizontal: 6,
    flex: 1,
    marginTop: spacing.SCALE_6
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