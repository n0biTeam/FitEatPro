import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Linking, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, spacing } from '../../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { version } from '../../styles/constants';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6580805673232587/8267133529';

const SettingScreen = ({ route, navigation }) => {
  
  //const _goBack = () => navigation.navigate('GlycemicIndex');
 
  const openPlayStore = () => {

    const GOOGLE_PACKAGE_NAME = 'pl.it.impact.fiteatpro';

    Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`);
  };

  const [loading, setLoading] = useState(true);

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
    const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
    return unsubscribe;
   }, [navigation, loading, activated]);
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE}}>
   
       {/* <Appbar.Content title="Ustawienia" /> */}
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    
   
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.rootContainer}>

            <View style={{flex: 1}}>
                <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('UnitSettingScreen')}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='cog' size={25} color={colors.COLORS.GREEN} />
                        </View>
                        <View style={{justifyContent: 'center', marginLeft: spacing.SCALE_10, flex: 1}}>
                            <Text style={styles.text}>Ustawienie jednostek</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='chevron-right' size={25} />
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_DDD, marginVertical: spacing.SCALE_10}}></View>

                <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('ShopScreen')}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='cart-outline' size={25} color={colors.COLORS.GREEN} />
                        </View>
                        <View style={{justifyContent: 'center', marginLeft: spacing.SCALE_10, flex: 1}}>
                            <Text style={styles.text}>Kup / Subskrypcje</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='chevron-right' size={25} />
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_DDD, marginVertical: spacing.SCALE_10}}></View>

            <TouchableOpacity style={styles.box} onPress={openPlayStore}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='star-outline' size={25} color={colors.COLORS.GREEN} />
                        </View>
                        <View style={{justifyContent: 'center', marginLeft: spacing.SCALE_10, flex: 1}}>
                            <Text style={styles.text}>Oceń aplikację</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='chevron-right' size={25} />
                        </View>
                    </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='eye-outline' size={25} color={colors.COLORS.GREEN} />
                        </View>
                        <View style={{justifyContent: 'center', marginLeft: spacing.SCALE_10, flex: 1}}>
                            <Text style={styles.text}>Polityka prywatności</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='chevron-right' size={25} />
                        </View>
                    </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('AboutTheAppScreen')}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='information-outline' size={25} color={colors.COLORS.GREEN} />
                        </View>
                        <View style={{justifyContent: 'center', marginLeft: spacing.SCALE_10, flex: 1}}>
                            <Text style={styles.text}>O aplikacji</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <MaterialCommunityIcons name='chevron-right' size={25} />
                        </View>
                    </View>
            </TouchableOpacity>

            <View style={{borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_DDD, marginVertical: spacing.SCALE_10}}></View>
            </View>

            <View style={{flex:1, justifyContent: 'flex-end', marginBottom: spacing.SCALE_6, alignItems: 'center'}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE}}>FitEat Pro v. {version.namber}</Text>
            </View>

        </View>
        {String(activated) !== 'fp_0599_rek' ?
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
    </ScrollView>
    
    
    
    </SafeAreaProvider>
   
  )
}

export default SettingScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        marginHorizontal: spacing.SCALE_6,
        marginTop: spacing.SCALE_6,
        flexDirection: 'column',
    },
    box: {
        backgroundColor: colors.COLORS.WHITE,
        paddingHorizontal: spacing.SCALE_10,
        paddingVertical: spacing.SCALE_16,
        borderBottomWidth: 1,
        borderBottomColor: colors.COLORS.LIGHT_GREY,
        //elevation: 1
    },
    text: {

    }
})