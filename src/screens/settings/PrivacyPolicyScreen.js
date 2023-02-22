import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, Linking } from 'react-native'
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { ScrollView } from 'react-native-gesture-handler';


const PrivacyPolicyScreen = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('SettingScreen');
  const imageBG = require('../../assets/images/bg5.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Polityka prywatności" />
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
            <ScrollView>
                <View>
                    <Text style={styles.title}>Privacy Policy</Text>
                    <Text style={styles.text}>Impact IT built the FitEat Pro app as a Commercial app. This SERVICE is provided by Impact IT and is intended for use as is.</Text>
                    <Text style={styles.text}>This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service.
                           If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy.</Text>
                    <Text style={styles.text}>The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at FitEat Pro unless otherwise defined in this Privacy Policy.</Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Information Collection and Use</Text>
                    <Text style={styles.text}>For a better experience, while using our Service, I may require you to provide us with certain personally identifiable information, including but not limited to Arkadiusz Ilków. The information that I request will be retained on your device and is not collected by me in any way.</Text>
                    <Text style={styles.text}>The app does use third-party services that may collect information used to identify you.</Text>
                    <Text style={styles.text}>Link to the privacy policy of third-party service providers used by the app:</Text>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={styles.dot}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.LIGHT_BLUE}}
                            onPress={() => Linking.openURL('https://policies.google.com/privacy')}>
                              Google Play Services
                          </Text>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={styles.dot}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.LIGHT_BLUE}}
                            onPress={() => Linking.openURL('https://support.google.com/admob/answer/6128543?hl=en')}>
                              AdMob
                          </Text>
                        </View>

                    </View>

                    {/* <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={styles.dot}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.LIGHT_BLUE}}
                            onPress={() => Linking.openURL('https://firebase.google.com/policies/analytics')}>
                              Google Analytics for Firebase
                          </Text>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={styles.dot}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.LIGHT_BLUE}}
                            onPress={() => Linking.openURL('https://firebase.google.com/support/privacy?hl=en')}>
                              Firebase Crashlytics
                          </Text>
                        </View>

                    </View> */}
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Log Data</Text>
                    <Text style={styles.text}>I want to inform you that whenever you use my Service, in a case of an error in the app I collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing my Service, the time and date of your use of the Service, and other statistics.</Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Cookies</Text>
                    <Text style={styles.text}>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</Text>
                    <Text style={styles.text}>This Service does not use these “cookies” explicitly. However, the app may use third-party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Service Providers</Text>
                    <Text style={styles.text}>I may employ third-party companies and individuals due to the following reasons:</Text>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={[styles.dot, {color: colors.TEXT.DEEP_BLUE}]}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.DEEP_BLUE}}>
                            To facilitate our Service;
                          </Text>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={[styles.dot, {color: colors.TEXT.DEEP_BLUE}]}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.DEEP_BLUE}}>
                          To provide the Service on our behalf;
                          </Text>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={[styles.dot, {color: colors.TEXT.DEEP_BLUE}]}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.DEEP_BLUE}}>
                          To perform Service-related services; or
                          </Text>
                        </View>

                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{marginRight: spacing.SCALE_6}}>
                          <Text style={[styles.dot, {color: colors.TEXT.DEEP_BLUE}]}>{'\u2B24'}</Text>
                        </View>
                        <View>
                          <Text style={{color: colors.COLORS.DEEP_BLUE}}>
                          To assist us in analyzing how our Service is used.
                          </Text>
                        </View>

                    </View>
                    <Text style={styles.text}>I want to inform users of this Service that these third parties have access to their Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Security</Text>
                    <Text style={styles.text}>I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security. </Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Links to Other Sites</Text>
                    <Text style={styles.text}>This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Children’s Privacy</Text>
                    <Text style={styles.text}>These Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13 years of age. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to do the necessary actions.</Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Changes to This Privacy Policy</Text>
                    <Text style={styles.text}>I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page.</Text>
                    <Text style={styles.text}>This policy is effective as of 2023-02-16</Text>
                </View>

                <View>
                    <Text style={[styles.title, {marginTop: spacing.SCALE_6}]}>Contact Us</Text>
                    <Text style={styles.text}>If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at impact.it.2021@gmail.com</Text>

                    
                       <View>
                          <Text>This privacy policy page was created at</Text>
                          <Text style={{color: colors.COLORS.LIGHT_BLUE}}
                            onPress={() => Linking.openURL('https://www.privacypolicytemplate.net/')}>
                              privacypolicytemplate.net
                          </Text>
                          <Text>and modified/generated by <Text> </Text>
                          <Text style={{color: colors.COLORS.LIGHT_BLUE}}
                            onPress={() => Linking.openURL('https://app-privacy-policy-generator.nisrulz.com/')}>
                              App Privacy Policy Generator
                          </Text></Text>
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

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    //marginHorizontal: spacing.SCALE_6,
},
boxContainer: {
    flex: 1,
    backgroundColor: colors.COLORS.WHITE,
    padding: spacing.SCALE_10,
    //marginBottom: spacing.SCALE_6,
    borderTopLeftRadius: spacing.SCALE_5,
    borderTopRightRadius: spacing.SCALE_5,
},
title:{
  fontSize: typography.FONT_SIZE_14,
  fontWeight: 'bold',
  color: colors.TEXT.GREEN
},
text: {
  fontSize: typography.FONT_SIZE_13,
  color: colors.TEXT.DEEP_BLUE
},
dot: {
  fontSize: typography.FONT_SIZE_13,
  color: colors.TEXT.LIGHT_BLUE
}
})