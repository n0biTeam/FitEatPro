import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, spacing, typography } from '../../styles';
import { version } from '../../styles/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { fontScale, isTablet } from 'react-native-utils-scale';

const AboutTheAppScreen = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('SettingScreen');
  const imageBG = require('../../assets/images/bg5.jpg');
  const {t, i18n} = useTranslation();

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#224870', marginTop: 30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="O aplikacji" />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={5}
    resizeMode="cover"
    style={{ 
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
         height: isTablet ? 300 : 126,
      }}
      imageStyle={{
        
      }}
      >

        <View style={styles.rootContainer}>
            <View style={styles.boxContainer}>
              <Text style={styles.title}>FitEat Pro v. {version.namber}</Text>
              <ScrollView>
              <Text style={styles.text}>{t('aboutTheApp.text-1')}</Text>
              <View style={{marginTop: spacing.SCALE_10}}>
                <Text style={{color: colors.TEXT.GREEN, fontWeight: 'bold'}}>{t('aboutTheApp.text-2')}</Text>
                
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-3')}</Text>
                    <Text style={styles.text}>{t('aboutTheApp.text-4')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-5')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-6')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-7')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-8')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-9')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-10')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-11')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-12')}</Text>
                  </View>
                </View>

                <View style={{marginTop: spacing.SCALE_10}}>
                  <Text style={{color: colors.TEXT.GREEN, fontWeight: 'bold'}}>{t('aboutTheApp.text-13')}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-14')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-15')}</Text>
                  </View>
                </View>
  
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-16')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{t('aboutTheApp.text-17')}</Text>
                  </View>
                </View>

              </View>

              <View style={{marginTop: spacing.SCALE_10}}>
                  <Text style={{color: colors.TEXT.GREEN, fontWeight: 'bold'}}>{t('aboutTheApp.text-18')}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>{t('aboutTheApp.text-19')}</Text>
                </View>

              <View style={{marginTop: spacing.SCALE_15}}>
                <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{t('aboutTheApp.text-21')}</Text>
                <View>
                  <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}>{t('aboutTheApp.text-22')}</Text>
                </View>
              </View>

            
              </ScrollView>
            </View>
        </View>
    
    </ImageBackground>
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default AboutTheAppScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    boxContainer: {
        flex: 1,
        backgroundColor: colors.COLORS.WHITE,
        padding: spacing.SCALE_10,
        borderTopLeftRadius: spacing.SCALE_5,
        borderTopRightRadius: spacing.SCALE_5,
    },
    title:{
      fontSize: fontScale(typography.FONT_SIZE_16),
      fontWeight: 'bold',
      color: colors.TEXT.DEEP_BLUE
    },
    text: {
      fontSize: fontScale(typography.FONT_SIZE_13),
      color: colors.TEXT.DEEP_BLUE,
    },
    dot: {
      fontSize: fontScale(typography.FONT_SIZE_13),
      color: colors.TEXT.DEEP_BLUE
    }
})