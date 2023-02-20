import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, FlatList, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, spacing, typography } from '../../styles';
import Purchases from 'react-native-purchases';
import PackageItem from '../../components/PackageItem';
import { ENTITLEMENT_ID } from '../../styles/constants';
import { AuthContext } from '../../navigation/AuthProvider';

const ShopScreen = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('SettingScreen');
  const {user} = useContext(AuthContext);
  const imageBG = require('../../assets/images/bg5.jpg');
  const [packages, setPackages] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  //const [isAnonymous, setIsAnonymous] = useState(true);
  const [userId, setUserId] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  // get the latest details about the user (is anonymous, user id, has active subscription)
  const getUserDetails = async () => {
    //setIsAnonymous(await Purchases.isAnonymous());
    setUserId(await Purchases.getAppUserID());

    const customerInfo = await Purchases.getCustomerInfo();
    setSubscriptionActive(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined');
  };

  useEffect(() => {
    // Get user details when component first mounts
    getUserDetails();
  }, []);

  useEffect(() => {
    // Subscribe to purchaser updates
    Purchases.addCustomerInfoUpdateListener(getUserDetails);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(getUserDetails);
    };
  });

  useEffect(() => {
    const getPackages = async () =>{
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {  
           //console.log(offerings.current);
           setPackages(offerings.current.availablePackages);
           //console.log(packages)
        }
      } catch (e) {
        console.error(e)
      }
    };
    getPackages();
  },[]);

  const header = () => <Text style={styles.text}>FitEat Pro Premium</Text>;

  const footer = () => {
    
    return (
      <Text style={styles.text}>
       
      </Text>
    );
  };

  
    const restorePurchases = async () => {
      try {
        await Purchases.restorePurchases();
        navigation.navigate('HomeScreen');
      } catch (e) {
        Alert.alert('Error restoring purchases', e.message);
      }
    };

//     const Info = async () => {
//       try {
//         const customerInfo = await Purchases.getCustomerInfo();
//         // access latest customerInfo
//         return customerInfo()
//       } catch (e) {
//        // Error fetching customer info
//       }
//     }
// console.log(Info())
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Kup / Subskrypcje" />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={5}
    resizeMode="cover"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.8
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
        <View style={styles.rootContainer}>
            <View style={styles.boxContainer}>

              <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_10, elevation: 4}}>
                <View>
                  <Text style={styles.text2}>FitEat Pro Premium</Text>
                </View>
                <View style={{alignItems: 'center', marginTop: spacing.SCALE_10}}>
                   <Text style={{color: colors.TEXT.DEEP_BLUE, textTransform: 'uppercase', fontSize: typography.FONT_SIZE_12}}>Status subskrybcji</Text>
                   <Text style={{ color: subscriptionActive ? colors.COLORS.GREEN : colors.COLORS.RED, fontSize: typography.FONT_SIZE_20, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {subscriptionActive ? 'Aktywna' : 'Nie aktywna'}
                  </Text>
                </View>
                
              </View>

              <View style={{backgroundColor: colors.COLORS.WHITE, borderRadius: spacing.SCALE_5, marginBottom: spacing.SCALE_10, elevation: 4}}>
                <View style={{backgroundColor: colors.COLORS.GREY_999, padding: spacing.SCALE_10, borderTopEndRadius: spacing.SCALE_5, borderTopStartRadius: spacing.SCALE_5, alignItems: 'center'}}>
                  <Text style={{color: colors.TEXT.WHITE, fontWeight: 'bold', textTransform: 'uppercase'}}>Funkcje premium</Text>
                </View>
                
                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_6}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Własna lista produktów (możliwość dodawania, modyfikacji i kasowania)</Text>
                  </View>
                </View>
                
                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_3}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Dziennik posiłków</Text>
                  </View>
                </View>

                

                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_3}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Dziennik wagi</Text>
                  </View>
                </View>

                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_3}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Dziennik ciśnienia krwi</Text>
                  </View>
                </View>

                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_3}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Dziennik pomiarów glukozy</Text>
                  </View>
                </View>

                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_3}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Dziennik wyników badań</Text>
                  </View>
                </View>

                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_3}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Sortowanie produktów po wartościach odżywczych / witaminy</Text>
                  </View>
                </View>

                <View style={{paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', marginTop: spacing.SCALE_3, marginBottom: spacing.SCALE_6}}>
                  <View>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
                  <View>
                  <Text style={styles.text}>Własna lista - puryny (kwas moczowy)</Text>
                  </View>
                </View>
                
              </View>
              
              <View style={{marginTop: spacing.SCALE_10, marginBottom: spacing.SCALE_3}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE}}>Wybierz subskrypcję:</Text>
               
              </View>
              
           {/* <Text>{userId}</Text> */}
          


      {/* The paywall flat list displaying each package */}
            <FlatList
              data={packages}
              numColumns={2}
              renderItem={({ item }) => <PackageItem purchasePackage={item} setIsPurchasing={setIsPurchasing} />}
              keyExtractor={(item) => item.identifier}
              //ListHeaderComponent={header}
              ListHeaderComponentStyle={styles.headerFooterContainer}
              ListFooterComponent={footer}
              ListFooterComponentStyle={styles.headerFooterContainer}
            />

            {isPurchasing && <View style={styles.overlay} />}
            
            <View>
              <Text style={{fontSize: typography.FONT_SIZE_13, marginBottom: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE}}>* Jeżeli posiadasz subskrypcję wciśnij przycisk poniżej</Text>
              <View style={{marginBottom: spacing.SCALE_10}}>
                <TouchableOpacity onPress={restorePurchases} style={{backgroundColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_10, borderRadius: spacing.SCALE_5, alignItems: 'center'}}>
                  <Text style={{color: colors.TEXT.WHITE, textTransform: 'uppercase'}}>Przywróc subskrypcję</Text>
                </TouchableOpacity>
              </View>
            </View>
            </View>

            
        </View>
    
    </ImageBackground>
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default ShopScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        //marginHorizontal: spacing.SCALE_6,
    },
    boxContainer: {
        flex: 1,
        backgroundColor: colors.COLORS.LIGHT_GREY,
        padding: spacing.SCALE_6,
        //marginBottom: spacing.SCALE_6,
        borderTopLeftRadius: spacing.SCALE_5,
        borderTopRightRadius: spacing.SCALE_5,
    },
    page: {
      padding: 6,
      flex: 1
    },
    text2: {
      color: colors.TEXT.DEEP_BLUE,
      fontWeight: 'bold',
      fontSize: typography.FONT_SIZE_16,
    },
    headerFooterContainer: {
      marginVertical: 10,
    },
    overlay: {
      flex: 1,
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: 0.5,
      backgroundColor: 'black',
    },
    title: {
      color: colors.TEXT.DEEP_BLUE,
      fontSize: 16,
      fontWeight: 'bold',
    },
    text: {
      fontSize: typography.FONT_SIZE_13,
      color: colors.TEXT.DEEP_BLUE
    },
    dot: {
      fontSize: typography.FONT_SIZE_13,
      color: colors.TEXT.ORANGE,
      marginRight: spacing.SCALE_6
    }
})