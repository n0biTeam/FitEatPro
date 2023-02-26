import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React, {useState, useContext, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, TextInput, Button, Checkbox } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';
import { ScrollView } from 'react-native-gesture-handler';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6580805673232587/8267133529';

const WhrScreen = ({ navigation }) => {

    const {t, i18n} = useTranslation();

    const {user} = useContext(AuthContext); 
    const [sumWHR, setSumWHR] = useState(0.00);
    const [waistSize, setWaistSize] = useState('');
    const [hipGirth, setHipGirth] = useState('');
    //const [male, setMale] = useState(false);
    //const [female, setFemale] = useState(false);
    const [type, setType] = useState('');
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

    // const femaleGender = () => {
    //     setFemale(true);
    //     setMale(false);
    //   }
    
    //   const maleGender = () => {
    //     setFemale(false);
    //     setMale(true);
    //   }
  
    const _goBack = () => navigation.navigate('HomeScreen');
  


  const calcWHR = () => {

    if(userData.gender === 1){
      if(userData.growthUnit === UNIT.CM){
        const whr = waistSize / hipGirth;
        setSumWHR(whr);
      }else{
        const whr = (waistSize / 2,54) / (hipGirth / 2,54);
        setSumWHR(whr);
      }
        

        if(sumWHR > 0.8){
            setType(
                <View>
                    <Text style={styles.textOne}>{t('whrScreen.text-1')}</Text>
                    <Text style={styles.textOne}>{t('whrScreen.text-2')}</Text>
                    <Text style={styles.textTwo}>{t('whrScreen.text-3')}</Text>
                </View>
            )
        } else {
            setType(
                <View>
                    <Text style={styles.textOne}>{t('whrScreen.text-4')}</Text>
                    <Text style={styles.textOne}>{t('whrScreen.text-5')}</Text>
                    <Text style={styles.textTwo}>{t('whrScreen.text-6')}</Text>
                </View>
            )
        }


    }else{
        const whr = waistSize / hipGirth;
        setSumWHR(whr);

        if(sumWHR > 1){
            setType(
                <View>
                    <Text style={styles.textOne}>{t('whrScreen.text-7')}</Text>
                    <Text style={styles.textOne}>{t('whrScreen.text-8')}</Text>
                    <Text style={styles.textTwo}>{t('whrScreen.text-9')}</Text>
                </View>
            )
        } else {
            setType(
                <View>
                    <Text style={styles.textOne}>{t('whrScreen.text-10')}</Text>
                    <Text style={styles.textOne}>{t('whrScreen.text-11')}</Text>
                    <Text style={styles.textTwo}>{t('whrScreen.text-12')}</Text>
                </View>
            )
        }
    }


  }

  const emptyBtn = (waistSize != null && waistSize != '') 
                && (hipGirth != null && hipGirth != '');
   // && ((male != null && male != '' ) || (female != null && female != '' ));
   
  const image = require('../../assets/images/owoce8.jpg');

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
       <Appbar.Content title={t('whrScreen.whr-calculator')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor={colors.COLORS.BLACK} barStyle="light-content"/>
    <ImageBackground 
    source={image}
    blurRadius={1}
    resizeMode="cover"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        //opacity: 0.7
      }}
    
  >
    <View style={styles.rootContainer}>
      <View style={{}}>
        <Text style={{color: colors.TEXT.YELLOW, fontWeight: 'bold', fontSize: typography.FONT_SIZE_14}}>{t('whrScreen.whr-indicator')}</Text>
      </View>
        <Text style={{marginBottom: spacing.SCALE_6, color: colors.TEXT.WHITE}}>{t('whrScreen.enter-values')}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: spacing.SCALE_3, elevation: 5}}>
        <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('whrScreen.waist-circumference') + ' (' + userData.growthUnit + ')'}
                value={waistSize.toString()}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={setWaistSize}
                keyboardType="numeric"
            />
        </View>

        <View style={{flex: 1, marginLeft: spacing.SCALE_3, elevation: 5}}>
            <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('whrScreen.hip-circumference') + ' (' + userData.growthUnit + ')'}
                value={hipGirth.toString()}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={setHipGirth}
                keyboardType="numeric"
            />
        </View>
      </View>

      <View style={{ marginTop: spacing.SCALE_6, elevation: 5, borderWidth: 1, borderColor: colors.COLORS.WHITE, backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: 5, borderTopEndRadius: 5}}>
            <View style={{padding: spacing.SCALE_10}}>
              <Text style={{fontSize: typography.FONT_SIZE_12}}>{t('whrScreen.gender')}</Text>
            </View>
            <View style={{marginLeft: spacing.SCALE_10, marginTop: -spacing.SCALE_5, marginBottom: spacing.SCALE_10}}>
            { userData.gender === 1 ? 
                ( 
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons name='gender-female' size={spacing.SCALE_22} color={colors.COLORS.GREEN} />
                  <Text style={{marginLeft: spacing.SCALE_10, marginTop: spacing.SCALE_3}}>{t('whrScreen.women')}</Text>
                </View>
                 ) 
                :
                (
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons name='gender-male' size={spacing.SCALE_22} color={colors.COLORS.GREEN} />
                  <Text style={{marginLeft: spacing.SCALE_10, marginTop: spacing.SCALE_3}}>{t('whrScreen.men')}</Text>
                </View>
                 ) 
              }
            </View>

          </View>

      <View style={{marginTop: spacing.SCALE_10}}>
        <Button mode="contained" color={colors.COLORS.YELLOW} onPress={calcWHR} disabled={!emptyBtn}>
            {t('whrScreen.calculate')}
        </Button>
      </View>
      <ScrollView>
      <View style={{marginTop: spacing.SCALE_10, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5, elevation: 4}}>
        <CircularProgress
            value={sumWHR}
            radius={80}
            maxValue={2}
            inActiveStrokeOpacity={0.8}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_35, marginBottom: -spacing.SCALE_8 }}
            activeStrokeColor={colors.BMI.BMI_3}
            inActiveStrokeColor={colors.COLORS.GREY_999}
            duration={1000}
            title={'WHR'}
            titleColor={colors.COLORS.DEEP_BLUE}
            titleStyle={{fontWeight: '300', fontSize: typography.FONT_SIZE_15}}
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
        { sumWHR !== 0 &&
        <View style={{marginTop: spacing.SCALE_6, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5, elevation: 5 }}>
        
               {type}
        
        </View>
        }
    </ScrollView>
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

export default WhrScreen;

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
        marginBottom: spacing.SCALE_5
      },
      textTwo: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_13
      }
      
});