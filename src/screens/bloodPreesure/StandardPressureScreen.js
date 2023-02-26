import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, spacing, typography } from '../../styles';
import { useTranslation } from 'react-i18next';


const StandardPressureScreen = ({ route, navigation }) => {
  
  const {t, i18n} = useTranslation();
  const _goBack = () => navigation.navigate('BloodPressureScreen');
  const imageBG = require('../../assets/images/bloodpreesure1.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('standardPressureScreen.title-screen')} />
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
        opacity: 0.2
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
            <View style={styles.rootBox}>
                <View style={{}}>
                    <Text style={styles.title}>{t('standardPressureScreen.title')}</Text>
                    <Text style={styles.title}>{t('standardPressureScreen.subtitle')}</Text>
                </View>
            

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between', borderBottomWidth: 1, borderBottomColor: colors.COLORS.GREY_CCC}}>

                <View style={{flex: 3}}>
                    <Text style={[styles.rowText, {color: colors.TEXT.GREEN}]}>{t('standardPressureScreen.category')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={[styles.rowText, {color: colors.TEXT.RED}]}>{t('bloodPressureScreen.systolic')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={[styles.rowText, {color: colors.TEXT.ORANGE}]}>{t('bloodPressureScreen.diastolic')}</Text>
                </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between'}}>

                <View style={{flex: 3}}>
                    <Text style={styles.rowText1}>{t('bloodPressureScreen.optimal')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText2}>{'\u003C'} 120</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText3}>{'\u003C'} 80</Text>
                </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between'}}>

                <View style={{flex: 3}}>
                    <Text style={styles.rowText1}>{t('bloodPressureScreen.correct')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText2}>120-129</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText3}>80-84</Text>
                </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between'}}>

                <View style={{flex: 3}}>
                    <Text style={styles.rowText1}>{t('bloodPressureScreen.high-correct')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText2}>130-139</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText3}>85-89</Text>
                </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between'}}>

                <View style={{flex: 3}}>
                    <Text style={styles.rowText1}>{t('"standardPressureScreen.value-1st')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText2}>140-159</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText3}>90-99</Text>
                </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between'}}>

                <View style={{flex: 3}}>
                    <Text style={styles.rowText1}>{t('"standardPressureScreen.value-2st')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText2}>160-179</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText3}>100-109</Text>
                </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between'}}>

                <View style={{flex: 3}}>
                    <Text style={styles.rowText1}>{t('"standardPressureScreen.value-3st')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText2}>{'\u2265'} 180</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText3}>{'\u2265'} 110</Text>
                </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, justifyContent:'space-between'}}>

                <View style={{flex: 3}}>
                    <Text style={styles.rowText1}>{t('standardPressureScreen.systolic-isolated-pressure')}</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText2}>{'\u2265'} 140</Text>
                </View>

                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={styles.rowText3}>{'\u003C'} 90</Text>
                </View>

            </View>
           
           </View>
        </View>

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>

  )
}

export default StandardPressureScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        marginHorizontal: spacing.SCALE_6,

    },
    rootBox:{
        backgroundColor: colors.COLORS.WHITE,
        flex: 1,
        marginBottom: spacing.SCALE_6,
        borderRadius: spacing.SCALE_5,
        padding: spacing.SCALE_10
    },
    title: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_14,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    rowText: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_12,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    rowText1: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_12,
        
    },
    rowText2: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_12,
        fontWeight: 'bold'
    },
    rowText3: {
        color: colors.TEXT.DEEP_BLUE,
        fontSize: typography.FONT_SIZE_12,
        fontWeight: 'bold'
    }
})