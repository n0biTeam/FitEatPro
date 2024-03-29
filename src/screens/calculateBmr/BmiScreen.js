import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions, ScrollView } from 'react-native'
import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, TextInput, Button } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6580805673232587/8267133529';

const BmiScreen = ({ navigation }) => {

    const {t, i18n} = useTranslation();
    
    const {user} = useContext(AuthContext); 
    const [sumBMI, setSumBMI] = useState(0.00);
    const [userData, setUserData] = useState('');

    const getUser = async () => {
        await firestore()
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
  
    const bmiCalc = () => {

        console.log(parseFloat(userData.weightName))
        console.log((parseFloat(userData.heightName)))
        if(userData.weightUnit === UNIT.KG){
          const result = parseFloat(userData.weightName) / ((parseFloat(userData.heightName)*parseFloat(userData.heightName))/10000);
          setSumBMI(result);
        }else{
          const result = parseFloat(userData.weightNameLB * 0.45359237) / ((parseFloat(userData.heightNameIN * 2.54) * parseFloat(userData.heightNameIN * 2.54))/10000);
          setSumBMI(result);
        }
        
  }

  

  const colorBMI = (sumBMI) => {
    let color;
    if(sumBMI < 16.00){
      color = colors.BMI.BMI_1;
    } else if ((sumBMI >= 16.00) && (sumBMI <= 16.99)){
      color = colors.BMI.BMI_2;
    } else if ((sumBMI >= 17.00) && (sumBMI <= 18.49)){
        color = colors.BMI.BMI_3;
    } else if ((sumBMI >= 18.50) && (sumBMI <= 24.99)){
        color = colors.BMI.BMI_4;
    } else if ((sumBMI >= 25.00) && (sumBMI <= 29.99)){
        color = colors.BMI.BMI_5;
    } else if ((sumBMI >= 30.00) && (sumBMI <= 34.99)){
        color = colors.BMI.BMI_6;
    } else if ((sumBMI >= 35.00) && (sumBMI <= 39.99)){
        color = colors.BMI.BMI_7;
    }else {
      color = colors.BMI.BMI_8;
    }
    return color;
  }

  const textBMI = (sumBMI) => {
    if(sumBMI < 16.00){
        return( 
          <View>
            <Text style={styles.textTitle}>{t('value.starvation')}</Text>
            <Text style={styles.textSubtitle}>
              {t('bmiScreen.text-1')}
            </Text>
          </View>
         );
    } else if ((sumBMI >= 16.00) && (sumBMI <= 16.99)){
        return( 
          <View>
            <Text style={styles.textTitle}>Wychudzenie</Text>
            <Text style={styles.textSubtitle}>
              {t('bmiScreen.text-1')}
            </Text>
          </View>
         );
    } else if ((sumBMI >= 17.00) && (sumBMI <= 18.49)){
        return( 
          <View>
            <Text style={styles.textTitle}>Niedowaga</Text>
            <Text style={styles.textSubtitle}>
              {t('bmiScreen.text-1')}
            </Text>
          </View>
         );
    } else if ((sumBMI >= 18.50) && (sumBMI <= 24.99)){
       return( 
        <View>
            <Text style={styles.textTitle}>Wartość prawidłowa</Text>
            <Text style={styles.textSubtitle}>
                {t('bmiScreen.text-2')}
            </Text>
        </View>
       );
    } else if ((sumBMI >= 25.00) && (sumBMI <= 29.99)){
        return( 
          <View>
            <Text style={styles.textTitle}>Nadwaga</Text>
            <Text style={styles.textSubtitle}>
              {t('bmiScreen.text-3')}
            </Text>
        </View>
         );
    } else if ((sumBMI >= 30.00) && (sumBMI <= 34.99)){
        return( 
            <View>
              <Text style={styles.textTitle}>I stopien otyłości</Text>
              <Text style={styles.textSubtitle}>
                {t('bmiScreen.text-4')}
              </Text>
          </View>
         );
    } else if ((sumBMI >= 35.00) && (sumBMI <= 39.99)){
        return( 
          <View>
              <Text style={styles.textTitle}>II stopien otyłości</Text>
              <Text style={styles.textSubtitle}>
                {t('bmiScreen.text-4')}
              </Text>
          </View>
         );
    }else {
        return( 
          <View>
              <Text style={styles.textTitle}>III stopien otyłości</Text>
              <Text style={styles.textSubtitle}>
                  {t('bmiScreen.text-4')}
              </Text>
          </View>
         );
    }
  }

  const image = require('../../assets/images/owoce4.jpg');

  const emptyBtn = (userData.heightName != null && userData.heightName != '');

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
    <SafeAreaProvider style={{}}>
      <Appbar.Header style={{backgroundColor: colors.COLORS.BLACK, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('bmiScreen.bmi-calculator')} />
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
        <Text style={{color: colors.TEXT.YELLOW, fontWeight: 'bold', fontSize: fontScale(typography.FONT_SIZE_16)}}>{t('bmiScreen.body-mass-index')}</Text>
      </View>
      <ScrollView>
        <Text style={{marginBottom: spacing.SCALE_6, color: colors.TEXT.WHITE}}>{t('bmiScreen.enter-values')}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: spacing.SCALE_3, elevation: 5}}>
        <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={ t('bmiScreen.body-weight') + ' (' + userData.weightUnit + ')'}
                value={userData ? (userData.weightUnit === UNIT.KG ? (userData.weightName).toString() : (userData.weightNameLB).toString()) : ''}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={(txt) => userData.weightUnit === UNIT.KG ? (setUserData({...userData, weightName: txt})) : (setUserData({...userData, weightNameLB: txt}))}
                //onChangeText={setWeightName}
                keyboardType="numeric"
            />
        </View>

        <View style={{flex: 1, marginLeft: 3, elevation: 5}}>
            <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={ t('bmiScreen.height') +  ' (' + userData.growthUnit + ')' }
                value={userData ? (userData.growthUnit === UNIT.CM ? (userData.heightName).toString() : (userData.heightNameIN).toString()) : ''}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={(txt) => userData.growthUnit === UNIT.CM ? (setUserData({...userData, heightName: txt})) : (setUserData({...userData, heightNameIN: txt}))}
                keyboardType="numeric"
            />
        </View>
      </View>
      <View style={{marginTop: spacing.SCALE_10}}>
        <Button mode="contained" color={colors.COLORS.YELLOW} onPress={bmiCalc} disabled={!emptyBtn}>
            {t('bmiScreen.calculate')}
        </Button>
      </View>

      <View style={{marginTop: spacing.SCALE_10, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5}}>
        <CircularProgress
            value={bmiCalc === NaN ? 0.00 : sumBMI}
            radius={80}
            maxValue={sumBMI > 40 ? sumBMI : 41}
            inActiveStrokeOpacity={0.8}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_35), marginBottom: -spacing.SCALE_8 }}
            activeStrokeColor={colorBMI(sumBMI)}
            inActiveStrokeColor={colors.COLORS.GREY_999}
            duration={5000}
            title={'BMI'}
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
        { sumBMI !== 0 &&
        <View style={{marginTop: spacing.SCALE_6, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5, elevation: 5 }}>
        
                {textBMI(sumBMI)}
        
        </View>
        }

        
    </ScrollView>
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

  )
}

export default BmiScreen;

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
        fontSize: fontScale(typography.FONT_SIZE_18),
        color: colors.TEXT.DEEP_BLUE,
        fontWeight: 'bold'

      },
      textSubtitle: {
        fontSize: fontScale(typography.FONT_SIZE_12),
      }
});