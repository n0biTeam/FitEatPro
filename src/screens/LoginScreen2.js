import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native';
import { TextInput, Button, DefaultTheme, Checkbox } from 'react-native-paper';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import auth from '@react-native-firebase/auth';


const loginValidationSchema = yup.object().shape({
  email: yup.string().email('Proszę podać poprawny adres e-mail').required('Adres e-mail jest wymagany'),
  password: yup.string().min(8, ({ min }) => `Hasło musi mieć co najmniej ${min} znaków`).required('Hasło jest wymagane')
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  //   "Musi zawierać 8 znaków, jedną wielką literę, jedną małą literę, jedną cyfrę i jedną specjalną literę"
  // ),
});

const LoginScreen = ({ navigation }) => {
  //alert(RNLocalize.getLocales()[0].languageCode);
  const [showPassword, setShowPassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const {t, i18n} = useTranslation();

  const loginUser = (values) => {
    auth()
  .signInWithEmailAndPassword(
    values.email,
    values.password
  )
  .then(() => {
    console.log('User account created & signed in!');
    navigation.navigate('Home');
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    if (error.code === 'auth/user-not-found') {
      ToastAndroid.show('Brak rekordu użytkownika odpowiadającego temu identyfikatorowi. Użytkownik mógł zostać usunięty.', ToastAndroid.LONG, ToastAndroid.CENTER);
    }

    console.error(error);
  });
  }

  return (
    <Formik
     initialValues={{ email: '', password: '' }}
     validateOnMount={true}
     onSubmit={values => {
      loginUser(values)
     }}
     validationSchema={loginValidationSchema}
   >
     {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
    <SafeAreaView style={{flex: 1, backgroundColor: '#CECFD3'}}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
      <ImageBackground
        source={require('../assets/images/bg.jpg')}
        style={{
          height: Dimensions.get('window').height /2.5,
        }}
      >
        <View style={styles.logoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.logoText}>FitEat 2</Text>
          </View>
        </View>
      </ImageBackground>
      <ImageBackground
        source={require('../assets/images/bg6.jpg')}
        style={styles.bootomView}
        imageStyle={{ 
          overflow: 'hidden',
          borderTopRightRadius: 50,
          borderTopLeftRadius: 50,
          opacity: 0.5
        }}
      >
        
        <View style={{padding: 30}}>
          
          <Text style={{color: '#224870', fontSize: 34}}>{t('login-screen-welcome')}</Text>
          
          <View style={{flexDirection: 'row'}}>
          <Text>{t('login-screen-text-1')} {' '}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{color: '#122c34', fontStyle: 'italic', fontWeight: 'bold'}}>{t('login-screen-text-2')}</Text>
            </TouchableOpacity>
          </View>
          
          

          {/* Fofmularz */}
          <View style={{marginTop: 20, backgroundColor: 'rgba(52, 52, 52, 0.1)', paddingHorizontal: 10, paddingVertical: 20, borderWidth: 1, borderRadius: 10, borderColor: 'rgba(52, 52, 52, 0.1)'}}>
          <TextInput 
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              label={t('login-screen-email')}
              underlineColorAndroid = "transparent"
              placeholderTextColor = "#224870"
              autoCapitalize = "none"
              mode='outlined'
              left={<TextInput.Icon icon='account' iconColor='#224870' />}
              right={ !errors.email ? <TextInput.Icon icon='check' iconColor='#224870' /> : <TextInput.Icon icon='close' iconColor='red' />}
              activeOutlineColor='#224870'
            />
            {(errors.email && touched.email) && 
              <Text style={styles.errors}>{errors.email}</Text>
            }

            <TextInput 
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              underlineColorAndroid = "transparent"
              
              placeholderTextColor = "#224870"
              mode='outlined'
              label={t('login-screen-password')}
              secureTextEntry={showPassword}
              activeOutlineColor='#224870'
              left={<TextInput.Icon icon='lock' iconColor='#224870' />}
              right={ showPassword ? <TextInput.Icon icon="eye" iconColor='#224870' onPress={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }} /> : <TextInput.Icon icon="eye-off" iconColor='#224870' onPress={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }} />}
            />
            {(errors.password && touched.password) && 
              <Text style={styles.errors}>{errors.password}</Text>
            }

            <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
              
              <Button 
                  disabled={!isValid}
                  icon="login" 
                  iconColor='#fff'
                  mode='contained' 
                  buttonColor='#224870'
                  onPress={handleSubmit} 
                  style={{
                    width: Dimensions.get('window').width-80, 
                    backgroundColor: isValid ? '#224870' : '#CACFD2' ,
                    
                  }}>
                <Text>{t('login-screen-login')}</Text>
              </Button>

            </View>

            <View style={styles.forgotPassView}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Checkbox
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setRememberMe(!rememberMe)
                  }}
                  color='#224870'
                  uncheckedColor='#224870'
                />
                <Text style={{color: '#000', alignSelf: 'center'}}>{t('login-screen-rememberMe')}</Text>
              </View>

              <View style={{alignSelf: 'center', alignItems: 'flex-end'}}>
                <Text style={{color: '#000', alignSelf: 'center'}}>{t('login-screen-forgotPassword')}</Text>
              </View>

            </View>

          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
    )}
    </Formik>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      flex: 1,
      //marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'rgba(52, 52, 52, 0.3)',
      padding: 6,
      backgroundColor: 'rgba(52, 52, 52, 0.3)',
      height: 80,

      width: Dimensions.get('window').width-12,
      justifyContent: 'center',
      alignItems: 'center'
    },
    logoText: {
      color: '#fff',
      fontSize: 50,
      fontWeight: 'bold',
    },
    bootomView: {
      flex: 1.5,
      backgroundColor: '#D3D4D8',
      bottom: 50,
      borderTopStartRadius: 50,
      borderTopEndRadius: 50,
      height: Dimensions.get('window').height-10
    },
    forgotPassView: {
      marginTop: 5,
      flexDirection: 'row', 
    },
    errors:{
      fontSize: 12,
      color: 'red',
      //fontWeight: 'bold',
      marginTop: 5,
      
    }

  });

export default LoginScreen;

