import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TextInput, Platform, Keyboard, StatusBar, TouchableOpacity } from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../../navigation/AuthProvider';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { colors, typography, spacing } from '../../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const SignupScreen = ({ navigation }) => {
 
    const { register } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const {t, i18n} = useTranslation();
    
    const registerValidationSchema = yup.object().shape({
    email: yup.string().email(i18n.t('signupScreen.text-5')).required(i18n.t('signupScreen.text-6')),
    password: yup.string().min(8, ({ min }) => `${i18n.t('forgetScreen.text-3a')} ${min} ${i18n.t('forgetScreen.text-3b')})`).required(i18n.t('forgetScreen.text-4'))
                  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, i18n.t('forgetScreen.text-5')),
    confirmPassword: yup.string()
                      .min(8, ({ min }) => `${i18n.t('forgetScreen.text-3a')} ${min} ${i18n.t('forgetScreen.text-3b')})`)
                      .oneOf([yup.ref('password')], i18n.t('signupScreen.text-7'))
                      .required(i18n.t('signupScreen.text-8'))
  });  
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
           'keyboardDidShow',
              () => {
                  setKeyboardVisible(true);
              },
          );
          const keyboardDidHideListener = Keyboard.addListener(
              'keyboardDidHide',
              () => {
                  setKeyboardVisible(false);
              },
          );
  
          return () => {
              keyboardDidHideListener.remove();
              keyboardDidShowListener.remove();
          };
      }, []);
  
     const getFlex = () => {
      if(isKeyboardVisible === true){
        return 3
      } else {
        return 2
      }
    }

    const zoomIn = {
      0: {
        opacity: 1,
        scale: 0.5,
      },
      0.5: {
        opacity: 1,
        scale: 0.8,
      },
      1: {
        opacity: 1,
        scale: 1,
      },
    };

    const zoomOut = {
      0: {
        opacity: 1,
        scale: 0.5,
      },
      0.5: {
        opacity: 1,
        scale: 0.9,
      },
      1: {
        opacity: 1,
        scale: 1,
      },
    };
    
  return (
    <Formik
     initialValues={{ email: '', password: '', confirmPassword: '' }}
     validateOnMount={true}
     onSubmit={values => {
        register(values)
     }}
     validationSchema={registerValidationSchema}
   >
     {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
    <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
      <View style={styles.header}>
        <ImageBackground 
          source={require('../../assets/images/bg.jpg')}
          blurRadius={5}
          style={{
            flex: 1, 
            height: Dimensions.get('window').height+200,
            width: Dimensions.get('window').width
          }}
          imageStyle={{
            
          }}
        >
  
         <View style={styles.logoContainer}>
          <View style={[styles.textContainer, {flexDirection: 'row'}]}>
            <View>
              <Text style={styles.logoText}>FitEat Pro</Text>
            </View>
            <View style={{marginTop: -spacing.SCALE_20}}>
              <Text style={{fontSize: typography.FONT_SIZE_22, color: colors.TEXT.LIGHT_BLUE}}>{'\xAE'}</Text>
            </View>            
          </View>
        </View>
        </ImageBackground>
      </View>

    <Animatable.View style={{flex: 2}} animation='fadeInUp' duration={2000}>
    <ImageBackground 
        source={require('../../assets/images/bg5.jpg')}
        resizeMode="stretch"
        style={{ 
          flex: getFlex(), 
          backgroundColor: colors.COLORS.WHITE,
          borderTopRightRadius: spacing.SCALE_50,
          borderTopLeftRadius: spacing.SCALE_50,
          overflow: 'hidden',
           }}
        imageStyle= {{
          opacity: 0.3
          }}
      >
      <KeyboardAwareScrollView>
      <View style={styles.footer}>
      
      <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{justifyContent: 'center', marginRight: spacing.SCALE_10}}>
                <View style={{borderWidth: 1, padding: spacing.SCALE_8, borderRadius: spacing.SCALE_16, borderColor: colors.COLORS.DEEP_BLUE}}>
                    <Fontisto name='angle-left' size={spacing.SCALE_16} color={colors.COLORS.DEEP_BLUE} />
                </View>
            </TouchableOpacity>
            <View>
                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_30}}>{t('signup-registration')}</Text>
            </View>
      </View>
        
        {/* Formularz */}
        <View style={styles.formContainer}>
        
        <Text style={[styles.text_footer, {marginTop: spacing.SCALE_15}]}>{t('signup-email')}</Text>
        <View style={styles.action}>
          <Ionicons name='ios-mail' size={spacing.SCALE_20} color={colors.COLORS.DEEP_BLUE} />
          <TextInput 
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            underlineColorAndroid = "transparent"
            placeholder={t('signup-email')}
            style={styles.textInput}
            autoCapitalize="none"
          />
          { !errors.email ? <Feather name="check-circle" size={spacing.SCALE_20} color={colors.COLORS.GREEN}/> : null }
        </View>
        {(errors.email && touched.email) && 
              <Text style={styles.errors}>{errors.email}</Text>
        }

        <Text style={[styles.text_footer, {marginTop: spacing.SCALE_15}]}>{t('signup-new-password')}</Text>
        <View style={styles.action}>
          <Ionicons name='lock-closed' size={spacing.SCALE_20} color={colors.COLORS.DEEP_BLUE} />
          <TextInput 
            placeholder={t('signup-new-password')}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry={showPassword}
          />
          <TouchableOpacity onPress={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }} >
            {showPassword ? <Feather name="eye" size={spacing.SCALE_20} color={colors.COLORS.GREEN} /> : <Feather name="eye-off" size={spacing.SCALE_20} color={colors.COLORS.GREEN} />}
          </TouchableOpacity>
        </View>
        {(errors.password && touched.password) && 
              <Text style={styles.errors}>{errors.password}</Text>
        }

        <Text style={[styles.text_footer, {marginTop: spacing.SCALE_15}]}>{t('signup-repeat-new-password')}</Text>
        <View style={styles.action}>
          <Ionicons name='lock-closed' size={spacing.SCALE_20} color={colors.COLORS.DEEP_BLUE} />
          <TextInput 
            placeholder={t('signup-repeat-new-password')}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry={showConfirmPassword}
          />
          <TouchableOpacity onPress={() => { showConfirmPassword ? setShowConfirmPassword(false) : setShowConfirmPassword(true) }} >
            {showConfirmPassword ? <Feather name="eye" size={spacing.SCALE_20} color={colors.COLORS.GREEN} /> : <Feather name="eye-off" size={spacing.SCALE_20} color={colors.COLORS.GREEN} />}
          </TouchableOpacity>
        </View>
        {(errors.confirmPassword && touched.confirmPassword) && 
              <Text style={styles.errors}>{errors.confirmPassword}</Text>
        }

        <View style={{marginTop: spacing.SCALE_20, justifyContent: 'center', alignItems: 'center'}}>
              
              <TouchableOpacity 
                  disabled={!isValid}
                  onPress={handleSubmit}
                  style={{
                    width: '100%', 
                    backgroundColor: isValid ? colors.COLORS.DEEP_BLUE : colors.COLORS.GREY_CCC,
                    padding: spacing.SCALE_10,
                    alignItems: 'center',
                    borderRadius: spacing.SCALE_20,
                    elevation: 5
                    
                  }}>
                   <View style={{flexDirection: 'row' }}>
                        <Text style={{color: !isValid ? colors.COLORS.DEEP_BLUE : colors.COLORS.WHITE, marginLeft: spacing.SCALE_10, fontWeight: 'bold'}}>{t('signup-join')}</Text> 
                    </View>
              </TouchableOpacity>

        </View>
        </View>
      
        
      </View>
      </KeyboardAwareScrollView>
     </ImageBackground>
     </Animatable.View>
    </View>
     )}
     </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
  },
  footer: {
    borderTopLeftRadius: spacing.SCALE_60,
    borderTopRightRadius: spacing.SCALE_60,
    paddingHorizontal: spacing.SCALE_30,
    paddingVertical: spacing.SCALE_30
  },
  text_footer: {
    fontSize: typography.FONT_SIZE_14,
    color: colors.TEXT.DEEP_BLUE
  },
  action: {
    flexDirection: 'row',
    marginTop: spacing.SCALE_10,
    borderBottomWidth: 1,
    borderBottomColor: colors.COLORS.GREY_777
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: spacing.SCALE_10,
    color: colors.TEXT.DEEP_BLUE,
    marginBottom: -spacing.SCALE_10
    
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    borderWidth: 1,
    borderRadius: spacing.SCALE_10,
    borderColor: 'rgba(52, 52, 52, 0.3)',
    padding: 0,
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    height: 80,
    width: Dimensions.get('window').width-12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer2: {
    borderWidth: 1,
    borderRadius: spacing.SCALE_10,
    borderColor: 'rgba(52, 52, 52, 0.1)',
    padding: 0,
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    height: 50,

    width: Dimensions.get('window').width-12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: spacing.SCALE_20,
    backgroundColor: 'rgba(52, 52, 52, 0.1)', 
    paddingHorizontal: spacing.SCALE_20, 
    paddingBottom: spacing.SCALE_10, 
    borderWidth: 1, 
    borderRadius: spacing.SCALE_10, 
    borderColor: 'rgba(52, 52, 52, 0.1)',
  },
  logoText: {
    color: colors.COLORS.LIGHT_BLUE,
    fontSize: typography.FONT_SIZE_50,
    fontWeight: 'bold',
  },
  logoText2: {
    color: colors.TEXT.WHITE,
    fontSize: typography.FONT_SIZE_26,
    fontWeight: 'bold',
    opacity: 0.4,
  },
  forgotPassView: {
    marginTop: spacing.SCALE_5,
    flexDirection: 'row', 
  },
  errors:{
    fontSize: typography.FONT_SIZE_12,
    color: colors.TEXT.RED,
    marginTop: spacing.SCALE_5,
    
  }
});


export default SignupScreen;