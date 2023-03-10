import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, TextInput, Button } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';
import { fontScale, isTablet } from 'react-native-utils-scale';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6580805673232587/8267133529';

const WhtrScreen = ({ navigation }) => {

    const {t, i18n} = useTranslation();

    const {user} = useContext(AuthContext); 
    const [sumWHtR, setSumWHtR] = useState(0.00);
    const [waistSize, setWaistSize] = useState('');
    const [male, setMale] = useState(false);
    const [female, setFemale] = useState(false);
    const [userData, setUserData] = useState('');

    const getUser = async () => {
        const currentUser = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('profile')
        .doc('profil')
        .get()
        .then(( doc ) => {
          if( doc.exists ) {
            setUserData(doc.data());
          }
        })
      }
    
      useEffect(() => {
        getUser();
        
      }, []);

     
  const _goBack = () => navigation.navigate('HomeScreen');
  
  const emptyBtn = (waistSize != null && waistSize != '');
   
  const calcWHtR = () => {
  
    if(userData.growthUnit === UNIT.CM){
      if(female === true){
        const whtr = (waistSize / userData.heightName) * 100;
        setSumWHtR(whtr);        
      }else{
        const whtr = (waistSize / userData.heightName) * 100;
        setSumWHtR(whtr);
      }
    }else{
      if(female === true){
        const whtr = ((waistSize * 2.54) / (userData.heightNameIN * 2.54)) * 100;
        setSumWHtR(whtr);        
      }else{
          const whtr = ((waistSize * 2.54) / (userData.heightNameIN * 2.54)) * 100;
          setSumWHtR(whtr);
      }
    }
    
  }

  const textWHtR = (sumWHtR) => {
        console.log(female);
        if(female === true){
            if(sumWHtR < 35 ) {
              return (
                <Text style={styles.textBox}>{t('whtrScreen.malnutrition')}</Text>
                );
            } else if ((sumWHtR > 35) && (sumWHtR < 42)) {
                return (
                  <Text style={styles.textBox}>{t('whtrScreen.underweight')}</Text>
                );
            } else if (sumWHtR > 42 && sumWHtR < 46) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.slight-underweight')}</Text>
                );
              } else if (sumWHtR > 46 && sumWHtR < 49) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.correct-body-weight')}</Text>
                );
              } else if (sumWHtR > 49 && sumWHtR < 54) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.overweight')}</Text>
                );
              } else if (sumWHtR > 54 && sumWHtR < 58) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.serious-overweight')}</Text>
                );
            } else {
                return (
                <Text style={styles.textBox}>{t('whtrScreen.obesity')}</Text>
                );
            }
      }else {
            if(sumWHtR < 35 ) {
              return (
                <Text style={styles.textBox}>{t('whtrScreen.malnutrition')}</Text>
                );
            } else if ((sumWHtR > 35) && (sumWHtR < 43)) {
                return (
                  <Text style={styles.textBox}>{t('whtrScreen.underweight')}</Text>
                );
            } else if (sumWHtR > 43 && sumWHtR < 46) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.slight-underweight')}</Text>
                );
              } else if (sumWHtR > 46 && sumWHtR < 53) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.correct-body-weight')}</Text>
                );
              } else if (sumWHtR > 53 && sumWHtR < 58) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.overweight')}</Text>
                );
              } else if (sumWHtR > 58 && sumWHtR < 63) {
                return (
                    <Text style={styles.textBox}>{t('whtrScreen.serious-overweight')}</Text>
                );
            } else {
                return (
                <Text style={styles.textBox}>{t('whtrScreen.obesity')}</Text>
                );
            }
      }
  }

  const colorWHtR = (sumWHtR) => {
    let color;
    if(female === true){
        if(sumWHtR < 35 ) {
            color = colors.WHtR.WHtR_4;
        } else if ((sumWHtR > 35) && (sumWHtR < 42)){
            color = colors.WHtR.WHtR_3;
        } else if ((sumWHtR > 42) && (sumWHtR < 46)){
            color = colors.WHtR.WHtR_2;
        } else if ((sumWHtR > 46) && (sumWHtR < 49)){
            color = colors.WHtR.WHtR_1;
        } else if ((sumWHtR > 49) && (sumWHtR < 54)){
            color = colors.WHtR.WHtR_2;
        } else if ((sumWHtR > 54) && (sumWHtR < 58)){
            color = colors.WHtR.WHtR_3;
        }else {
          color = colors.WHtR.WHtR_4;
        }
      }else {
        if(sumWHtR < 35 ) {
            color = colors.WHtR.WHtR_4;
        } else if ((sumWHtR > 35) && (sumWHtR < 43)){
            color = colors.WHtR.WHtR_3;
        } else if ((sumWHtR > 43) && (sumWHtR < 46)){
            color = colors.WHtR.WHtR_2;
        } else if ((sumWHtR > 46) && (sumWHtR < 53)){
            color = colors.WHtR.WHtR_1;
        } else if ((sumWHtR > 53) && (sumWHtR < 58)){
            color = colors.WHtR.WHtR_2;
        } else if ((sumWHtR > 58) && (sumWHtR < 63)){
            color = colors.WHtR.WHtR_3;
        }else {
          color = colors.WHtR.WHtR_4;
        }
      }
        return color;
  }

  const image = require('../../assets/images/owoce10.jpg');
 
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
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.BLACK, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('whtrScreen.whtr-calculate')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor={colors.COLORS.BLACK} barStyle="light-content"/>
    <ImageBackground 
    source={image}
    blurRadius={1}
    resizeMode="cover"
    style={{  
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        
      }}
    
  >
    <View style={styles.rootContainer}>
      <View style={{}}>
        <Text style={{color: colors.TEXT.YELLOW, fontWeight: 'bold', fontSize: fontScale(typography.FONT_SIZE_14)}}>{t('whtrScreen.whtr-ratio')}</Text>
      </View>
        <Text style={{marginBottom: spacing.SCALE_6, color: colors.TEXT.WHITE}}>{t('whtrScreen.enter-values')}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: spacing.SCALE_3, elevation: 5}}>
        <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('whtrScreen.waist-circumference') + ' (' + userData.growthUnit + ')'}
                value={waistSize.toString()}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={setWaistSize}
                keyboardType="numeric"
            />
        </View>

        <View style={{flex: 1, marginLeft: 3, elevation: 5}}>
        <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('whtrScreen.height') + ' (' + userData.growthUnit + ')'}
                value={userData ? (userData.growthUnit === UNIT.CM ? (userData.heightName).toString() : (userData.heightNameIN).toString()) : ''}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={(txt) => userData.growthUnit === UNIT.CM ? (setUserData({...userData, heightName: txt})) : (setUserData({...userData, heightNameIN: txt}))}
                keyboardType="numeric"
            />
        </View>
      </View>

      <View style={{ marginTop: spacing.SCALE_6, elevation: 5, borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: 5, borderTopEndRadius: 5}}>
            <View style={{padding: spacing.SCALE_10}}>
              <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{t('whtrScreen.gender')}</Text>
            </View>
            <View style={{marginLeft: spacing.SCALE_10, marginTop: -spacing.SCALE_5, marginBottom: spacing.SCALE_10}}>
            { userData.gender === 1 ? 
                ( 
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons name='gender-female' size={isTablet ? spacing.SCALE_12 : spacing.SCALE_22} color={colors.COLORS.GREEN} />
                  <Text style={{marginLeft: spacing.SCALE_10, marginTop: spacing.SCALE_3}}>{t('whtrScreen.women')}</Text>
                </View>
                 ) 
                :
                (
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons name='gender-male' size={isTablet ? spacing.SCALE_12 : spacing.SCALE_22} color={colors.COLORS.GREEN} />
                  <Text style={{marginLeft: spacing.SCALE_10, marginTop: spacing.SCALE_3}}>{t('whtrScreen.men')}</Text>
                </View>
                 ) 
              }
            </View>

          </View>

      <View style={{marginTop: spacing.SCALE_10}}>
        <Button mode="contained" color={colors.COLORS.YELLOW} onPress={calcWHtR} disabled={!emptyBtn}>
            {t('whtrScreen.calculate')}
        </Button>
      </View>

      <View style={{marginTop: spacing.SCALE_10, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5, elevation: 4}}>
        <CircularProgress
            value={sumWHtR}
            radius={80}
            maxValue={65}
            inActiveStrokeOpacity={0.8}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_35), marginBottom: -spacing.SCALE_8 }}
            activeStrokeColor={colorWHtR(sumWHtR)}
            inActiveStrokeColor={colors.COLORS.GREY_999}
            duration={1000}
            title={'WHtR'}
            titleColor={colors.COLORS.DEEP_BLUE}
            titleStyle={{fontWeight: '300', fontSize: fontScale(typography.FONT_SIZE_15)}}
            dashedStrokeConfig={{
                count: 60,
                width: 8,
            }}
            progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(2);
            }}
        />
              
    </View>
        { sumWHtR !== 0 &&
        <View style={{marginTop: spacing.SCALE_6, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5, elevation: 5 }}>
        
               {textWHtR(sumWHtR)}
        
        </View>
        }
    </View>

    {activated.length === 0 ?
        <View style={{marginBottom: 3, marginTop: spacing.SCALE_6, alignItems: 'center'}}>
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

  )
}

export default WhtrScreen;

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: spacing.SCALE_6,
        marginVertical: spacing.SCALE_6,
        flex: 1,
    },
    input: {
        borderBottomWidth: spacing.SCALE_2,
        borderBottomColor: colors.COLORS.DEEP_BLUE,
        backgroundColor: colors.COLORS.WHITE,
        paddingLeft: spacing.SCALE_10,
        elevation: 4
      },
      textBtn: {
        color: colors.TEXT.WHITE
      },
      textTitle: {
        fontSize: typography.FONT_SIZE_18,
        color: colors.TEXT.DEEP_BLUE,
        fontWeight: 'bold'

      },
      textSubtitle: {
        fontSize: typography.FONT_SIZE_12,
      },
      textOne: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_16,
        marginBottom: 5
      },
      textTwo: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_13
      },
      textBox: {
        color: colors.COLORS.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_18,
        fontWeight: 'bold'
      }
      
});