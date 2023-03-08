import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TextInput, Platform, Keyboard, StatusBar, TouchableOpacity } from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../../navigation/AuthProvider';
import { colors, typography, spacing } from '../../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const LoginScreen = ({ navigation }) => {

    const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(true);

    const {t, i18n} = useTranslation();

    const loginValidationSchema = yup.object().shape({
    email: yup.string().email(i18n.t('forgetScreen.text-1')).required(i18n.t('forgetScreen.text-2')),
    password: yup.string().min(8, ({ min }) => `${i18n.t('forgetScreen.text-3a')} ${min} ${i18n.t('forgetScreen.text-3b')})`).required(i18n.t('forgetScreen.text-4'))
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, t('forgetScreen.text-5')),
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

  return (
    <Formik
     initialValues={{ email: '', password: '' }}
     validateOnMount={true}
     onSubmit={values => {
      login(values);
     }}
     validationSchema={loginValidationSchema}
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
              <Text style={{fontSize: spacing.SCALE_22, color: colors.TEXT.LIGHT_BLUE}}>{'\xAE'}</Text>
            </View>            
          </View>
        </View>
        </ImageBackground>
      </View>
      
    <Animatable.View style={{flex: 2}} animation='fadeInUp' duration={2000}>
    <ImageBackground 
        source={require('../../assets/images/bg6.jpg')}
        blurRadius={5}
        resizeMode="stretch"
        style={{ 
          //height: getHeight(), 
          flex: getFlex(), 
          backgroundColor: colors.COLORS.WHITE,
          borderTopRightRadius: spacing.SCALE_50,
          borderTopLeftRadius: spacing.SCALE_50,
          overflow: 'hidden',
          
         // height: Dimensions.get('window').height,
        //bottom: 50
           }}
        imageStyle= {{
          opacity: 0.3,
          //borderRadius: 50,
          }}
      >
      <KeyboardAwareScrollView>
      <View style={styles.footer}>
      
      <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_34}}>{t('login-screen-welcome')}</Text>
          
          <View style={{flexDirection: 'row'}}>
          <Text>{t('login-screen-text-1')} {' '}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{color: 'red', fontStyle: 'italic', fontWeight: 'bold'}}>{t('login-screen-text-2')}</Text>
            </TouchableOpacity>
          </View>

        <View style={styles.formContainer}>
        <Text style={[styles.text_footer, {marginTop: spacing.SCALE_15}]}>{t('login-screen-email')}</Text>
        <View style={styles.action}>
          <Ionicons name='ios-mail' size={spacing.SCALE_20} color={colors.COLORS.DEEP_BLUE} />
          <TextInput 
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            underlineColorAndroid = "transparent"
            placeholder={t('login-screen-email')}
            style={styles.textInput}
            autoCapitalize="none"
          />
          { !errors.email ? <Feather name="check-circle" size={spacing.SCALE_20} color={colors.COLORS.GREEN}/> : null }
        </View>
        {(errors.email && touched.email) && 
              <Text style={styles.errors}>{errors.email}</Text>
        }

        <Text style={[styles.text_footer, {marginTop: spacing.SCALE_15}]}>{t('login-screen-password')}</Text>
        <View style={styles.action}>
          <Ionicons name='lock-closed' size={spacing.SCALE_20} color={colors.COLORS.DEEP_BLUE} />
          <TextInput 
            placeholder={t('login-screen-password')}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            //underlineColorAndroid = "transparent"
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


        <View style={{marginTop: spacing.SCALE_20, justifyContent: 'center', alignItems: 'center'}}>
              
              <TouchableOpacity 
                  disabled={!isValid}
                  onPress={handleSubmit}
                  style={{
                    width: '100%', 
                    backgroundColor: isValid ? colors.COLORS.DEEP_BLUE : colors.COLORS.GREY_CCC,
                    padding: 10,
                    alignItems: 'center',
                    borderRadius: 20,
                    elevation: 5
                    
                  }}>
                   <View style={{flexDirection: 'row' }}>
                        <Text style={{color: !isValid ? colors.TEXT.DEEP_BLUE: colors.TEXT.WHITE, marginLeft: spacing.SCALE_10, fontWeight: 'bold'}}>{t('login-screen-login')}</Text> 
                    </View>
              </TouchableOpacity>

        </View>
        </View>

        <View style={styles.forgotPassView}>
              <View style={{flexDirection: 'row', flex: 1}}>
              
              </View>
              <TouchableOpacity onPress={() => (navigation.navigate('ForgotPassword'))}>
              <View style={{alignSelf: 'center', alignItems: 'flex-end', marginTop: spacing.SCALE_10}}>
                <Text style={{color: colors.COLORS.BLACK, alignSelf: 'center', fontStyle: 'italic'}}>{t('login-screen-forgotPassword')}</Text>
              </View>
              </TouchableOpacity>
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
    paddingVertical: spacing.SCALE_30,
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
  formContainer: {
    marginTop: spacing.SCALE_20,
    backgroundColor: 'rgba(52, 52, 52, 0.1)', 
    paddingHorizontal: spacing.SCALE_20, 
    paddingVertical: spacing.SCALE_20, 
    borderWidth: 1, 
    borderRadius: spacing.SCALE_10, 
    borderColor: 'rgba(52, 52, 52, 0.1)'

  },
  logoText: {
    color: colors.COLORS.LIGHT_BLUE,
    fontSize: typography.FONT_SIZE_50,
    fontWeight: 'bold',
  },
  forgotPassView: {
    marginTop: spacing.SCALE_5,
    flexDirection: 'row', 
  },
  errors:{
    fontSize: typography.FONT_SIZE_14,
    color: 'red',
    marginTop: spacing.SCALE_5,
  },
  error: {
    marginBottom: 20,
    color: 'red',
  },
});


export default LoginScreen;