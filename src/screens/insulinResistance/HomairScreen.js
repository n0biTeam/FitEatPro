import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, TextInput, Button } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Purchases from 'react-native-purchases';
import { ScrollView } from 'react-native-gesture-handler';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6580805673232587/8267133529';

const HomairScreen = ({ navigation }) => {

    const {t, i18n} = useTranslation();
    const {user} = useContext(AuthContext); 
    const [sumHomair, setSumHomair] = useState(0.00);
    const [userData, setUserData] = useState('');
    const [insulin, setInsulin] = useState('');
    const [glucose, setGlucose] = useState('');

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

    const homairCalc = () => {
        const homair = (insulin * glucose)/405;
        setSumHomair(homair);
    }
  
    const emptyBtn = (insulin != null && insulin != '') 
                    && (glucose != null && glucose != '');
  
    const _goBack = () => navigation.navigate('HomeScreen');

    const textHomair = (sumHomair) => {
        if(sumHomair >= 2){
            return( 
              <View style={{}}>
                <Text style={styles.textTitle1}>{t('homairScreen.correct-result')}</Text>
                <Text style={styles.textTitle1}>{t('homairScreen.no-symptoms')}</Text>
                <Text style={styles.textSubtitle}>{t('homairScreen.warning')}</Text>
                </View>
             
             );
            } else if(sumHomair > 2 && sumHomair < 2.5){
                return( 
                    <View style={{}}>
                      <Text style={styles.textTitle2}>{t('homairScreen.moderate-result')}</Text>
                      <Text style={styles.textTitle2}>{t('homairScreen.symptoms')}</Text>
                      <Text style={styles.textSubtitle}>{t('homairScreen.warning')}</Text>
                      </View>
                   
                   );
            }
            
            else  {
            return( 
              <View>
                <Text style={styles.textTitle3}>{t('homairScreen.error-1')}</Text>
                <Text style={styles.textTitle3}>{t('homairScreen.error-2')}</Text>
                <Text style={styles.textSubtitle}>{t('homairScreen.warning')}</Text>
              </View>
             );
        }
  };


  const colorHomair = (sumHomair) => {
    let color;
    if(sumHomair >= 2){
      color = colors.COLORS.GREEN;
    } else if(sumHomair > 2 && sumHomair < 2.5){
        color = colors.COLORS.ORANGE;
    }else {
      color = colors.COLORS.RED;
    }
    return color;
  }

  const imageBG = require('../../assets/images/glukometr4.jpg');

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
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('homairScreen.title')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={1}
    resizeMode="cover"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.3
      }}
    
  >
        <View style={styles.rootContainer}>
            <View style={{}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold', fontSize: typography.FONT_SIZE_16}}>{t('homairScreen.insulin-resistance-index')}</Text>
            </View>

            <Text style={{marginBottom: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE}}>{t('homairScreen.enter-value')}</Text>
            
                <View style={{elevation: 5}}>
                    <TextInput
                        underlineColor={colors.COLORS.LIGHT_GREY}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('homairScreen.insulin') + ' (mU/ml)'}
                        value={insulin.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setInsulin}
                        keyboardType="numeric"
                    />
                </View>

                <View style={{ elevation: 5, marginTop: spacing.SCALE_6}}>
                    <TextInput
                        underlineColor={colors.COLORS.LIGHT_GREY}
                        activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                        label={t('homairScreen.glucose') + ' (mg/dl)'}
                        value={glucose.toString()}
                        style={{backgroundColor: colors.COLORS.WHITE}}
                        onChangeText={setGlucose}
                        keyboardType="numeric"
                    />
                </View>

                <View style={{marginTop: spacing.SCALE_10}}>
                    <Button mode="contained" color={colors.COLORS.DEEP_BLUE} onPress={homairCalc} disabled={!emptyBtn}>
                        {t('homairScreen.calculate')}
                    </Button>
                </View>    
                <ScrollView>
                <View style={{marginTop: spacing.SCALE_10, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5, elevation: 5}}>
                    <CircularProgress
                        value={homairCalc === NaN ? 0.00 : sumHomair}
                        radius={80}
                        maxValue={5}
                        inActiveStrokeOpacity={0.8}
                        activeStrokeWidth={20}
                        inActiveStrokeWidth={20}
                        progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_35, marginBottom: -spacing.SCALE_8 }}
                        activeStrokeColor={colorHomair(sumHomair)}
                        inActiveStrokeColor={colors.COLORS.GREY_999}
                        duration={5000}
                        title={'HOMA-IR'}
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
                { sumHomair !== 0 &&
                <View style={{marginTop: spacing.SCALE_6, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_20, borderRadius: 5, elevation: 5 }}>
        
                {textHomair(sumHomair)}
                
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

export default HomairScreen;

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
        color: colors.TEXT.WHITE,
      },
      textTitle1: {
        fontSize: typography.FONT_SIZE_14,
        color: colors.TEXT.GREEN,
        fontWeight: '700',
        textTransform: 'uppercase'

      },
      textTitle2: {
        fontSize: typography.FONT_SIZE_14,
        color: colors.TEXT.ORANGE,
        fontWeight: '700',
        textTransform: 'uppercase'

      },
      textTitle3: {
        fontSize: typography.FONT_SIZE_14,
        color: colors.TEXT.RED,
        fontWeight: '700',
        textTransform: 'uppercase'

      },
      textSubtitle: {
        fontSize: 12,
      }
});