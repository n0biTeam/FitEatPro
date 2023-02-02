import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native';
import { TextInput, Button, DefaultTheme, Checkbox } from 'react-native-paper';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';




const registerValidationSchema = yup.object().shape({
  firstName: yup.string().min(2, 'Zamała ilość znaków').max(50, 'Za długa nazwa'),
  lastName: yup.string().min(2, 'Zamała ilość znaków').max(50, 'Za długa nazwa'),
  email: yup.string().email('Proszę podać poprawny adres e-mail').required('Adres e-mail jest wymagany'),
  password: yup.string().min(8, ({ min }) => `Hasło musi mieć co najmniej ${min} znaków`).required('Hasło jest wymagane'),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  //   "Musi zawierać 8 znaków, jedną wielką literę, jedną małą literę, jedną cyfrę i jedną specjalną literę"
  // ),
  confirmPassword: yup.string()
                    .min(8, ({ min }) => `Hasło musi mieć co najmniej ${min} znaków`)
                    .oneOf([yup.ref('password')], 'Twoje hasło nie jest takie samo')
                    .required('Potwierdzenie hasła jest wymagane')
});

const RegisterScreen = ({ navigation }) => {
  //alert(RNLocalize.getLocales()[0].languageCode);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const {t, i18n} = useTranslation();

  const registerUser = (values) => {
    const firstName = values.firstName;
    const lastName = values.lastName;
    const email = values.email;
    auth()
        .createUserWithEmailAndPassword(
            values.email,
            values.password
        )
        .then(() => {
            console.log('User account created & signed in!');
            ToastAndroid.show('Konto zostało utworzone.', ToastAndroid.LONG, ToastAndroid.CENTER);
            navigation.navigate('Home');
        })
        .then(() => {
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              firstName,
              lastName,
              email
            })
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
           // console.log('That email address is already in use!');
            ToastAndroid.show('Adres e-mail jest już używany przez inne konto.', ToastAndroid.LONG, ToastAndroid.CENTER);
            }

            if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            }

            console.error(error);
        });
  }

  return (
    <Formik
     initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
     validateOnMount={true}
     onSubmit={values => {
        registerUser(values)
     }}
     validationSchema={registerValidationSchema}
   >
     {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
    <SafeAreaView style={{flex: 1, backgroundColor: '#CECFD3'}}
     
    >
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
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{justifyContent: 'center', marginRight: 10}}>
                <View style={{borderWidth: 1, padding: 8, borderRadius: 16, borderColor: '#224870'}}>
                    <AntDesign name='left' size={16} color='#224870' />
                </View>
            </TouchableOpacity>
            <View>
                <Text style={{color: '#224870', fontSize: 34}}>Rejestracja</Text>
            </View>
          </View>

          {/* Fofmularz */}
          <View style={{marginTop: 20, backgroundColor: 'rgba(52, 52, 52, 0.1)', paddingHorizontal: 10, paddingVertical: 20, borderWidth: 1, borderRadius: 10, borderColor: 'rgba(52, 52, 52, 0.1)'}}>
          
          <TextInput 
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              label='Imię'
              underlineColorAndroid = "transparent"
              placeholderTextColor = "#224870"
              autoCapitalize = "none"
              mode='outlined'
              left={<TextInput.Icon icon='account' iconColor='#224870' />}
              right={ !errors.firstName ? <TextInput.Icon icon='check' iconColor='#224870' /> : <TextInput.Icon icon='close' iconColor='red' />}
              activeOutlineColor='#224870'
            />
            {(errors.firstName && touched.firstName) && 
              <Text style={styles.errors}>{errors.firstName}</Text>
            }

            <TextInput 
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              label='Nazwisko'
              underlineColorAndroid = "transparent"
              placeholderTextColor = "#224870"
              autoCapitalize = "none"
              mode='outlined'
              left={<TextInput.Icon icon='account' iconColor='#224870' />}
              right={ !errors.lastName ? <TextInput.Icon icon='check' iconColor='#224870' /> : <TextInput.Icon icon='close' iconColor='red' />}
              activeOutlineColor='#224870'
            />
            {(errors.lastName && touched.lastName) && 
              <Text style={styles.errors}>{errors.lastName}</Text>
            }

          <TextInput 
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              label={t('login-screen-email')}
              underlineColorAndroid = "transparent"
              placeholderTextColor = "#224870"
              autoCapitalize = "none"
              mode='outlined'
              left={<TextInput.Icon icon='email' iconColor='#224870' />}
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

            <TextInput 
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              underlineColorAndroid = "transparent"
              placeholderTextColor = "#224870"
              mode='outlined'
              label='Powtórz hasło'
              secureTextEntry={showConfirmPassword}
              activeOutlineColor='#224870'
              left={<TextInput.Icon icon='lock' iconColor='#224870' />}
              right={ showConfirmPassword ? <TextInput.Icon icon="eye" iconColor='#224870' onPress={() => { showConfirmPassword ? setShowConfirmPassword(false) : setShowConfirmPassword(true) }} /> : <TextInput.Icon icon="eye-off" iconColor='#224870' onPress={() => { showConfirmPassword ? setShowConfirmPassword(false) : setShowConfirmPassword(true) }} />}
            />
            {(errors.confirmPassword && touched.confirmPassword) && 
              <Text style={styles.errors}>{errors.confirmPassword}</Text>
            }

            <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
              
              <Button 
                  disabled={!isValid}
                  iconColor='#fff'
                  mode='contained' 
                  buttonColor='#224870'
                  onPress={handleSubmit} 
                  style={{
                    width: Dimensions.get('window').width-80, 
                    backgroundColor: isValid ? '#224870' : '#CACFD2' ,
                    
                  }}>
                <Text>REJESTRACJA</Text>
              </Button>

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

export default RegisterScreen;