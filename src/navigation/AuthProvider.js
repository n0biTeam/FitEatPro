import React, {createContext, useState } from 'react';
import { ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import dataPL from '../data/dataPL';
import dataEN from '../data/dataEN';
import dataPurinePL from '../data/dataPurinePL';
import dataPurineEN from '../data/dataPurineEN';
import { UNIT } from '../styles/units';
import * as RNLocalize from "react-native-localize";
import { useTranslation } from 'react-i18next';

const lang = RNLocalize.getLocales()[0].languageCode;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
   const [user, setUser] = useState();
   const {t, i18n} = useTranslation();
   
   let dataJson = [];
   if(lang === 'pl'){
     dataJson = dataPL;
   }else{
     dataJson = dataEN;
   }

   let dataPurineJson = [];
   if(lang === 'pl'){
      dataPurineJson = dataPurinePL;
   }else{
      dataPurineJson = dataPurineEN;
   }
   
   const insertJson = async (dataJson) => {
    try {
      const promises = [];
      dataJson.forEach((item) => {
        promises.push(
         firestore().collection('users')
        .doc(auth().currentUser.uid).collection('products')
        .add(item));
      });
      await Promise.all(promises).then((results) => {
        console.log(results.length + ' positions added');
      });
    } catch (err) {
      console.log('Error : ' + err);
    }
}

const insertPurineJson = async (dataPurineJson) => {
  try {
    const promises = [];
    dataPurineJson.forEach((item) => {
      promises.push(
       firestore().collection('users')
      .doc(auth().currentUser.uid).collection('purines')
      .add(item));
    });
    await Promise.all(promises).then((results) => {
      console.log(results.length + ' positions added');
    });
  } catch (err) {
    console.log('Error : ' + err);
  }

}

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (values) => {
            await auth()
            .signInWithEmailAndPassword(
              values.email,
              values.password
            )
            .then(() => {
              //console.log('User account created & signed in!');
              ToastAndroid.show(t('provider.user-account-created'), ToastAndroid.LONG, ToastAndroid.CENTER);
              //navigation.navigate('Home');
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                //console.log('That email address is already in use!');
                ToastAndroid.show(t('provider.email-already-in-use'), ToastAndroid.LONG, ToastAndroid.CENTER);
              }
          
              if (error.code === 'auth/invalid-email') {
                //console.log('That email address is invalid!');
                ToastAndroid.show(t('provider.invalid-email'), ToastAndroid.LONG, ToastAndroid.CENTER);
              }
          
              if (error.code === 'auth/user-not-found') {
                ToastAndroid.show(t('provider.user-not-found'), ToastAndroid.LONG, ToastAndroid.CENTER);
              }
          
              console.error(error);
            });
        },
   
        register: async (values) => {
    
            const email = values.email;
            //console.log(email);
            await auth()
                .createUserWithEmailAndPassword(
                    values.email,
                    values.password
                )
                // .then(() => {
                //     console.log('User account created & signed in!');
                //     ToastAndroid.show('Konto zostało utworzone.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                // })
                .catch(error => {
                  if (error.code === 'auth/email-already-in-use') {
                    //console.log('That email address is already in use!');
                    ToastAndroid.show(t('provider.email-already-in-use'), ToastAndroid.LONG, ToastAndroid.CENTER);
                  }
              
                  if (error.code === 'auth/invalid-email') {
                    //console.log('That email address is invalid!');
                    ToastAndroid.show(t('provider.invalid-email'), ToastAndroid.LONG, ToastAndroid.CENTER);
                  }
                           
                  console.error(error);
                })
                // .catch((error) =>{
                //     console.log(error);
                // })
                .then(() => {
                    //const uuid = firebase.auth().currentUser.uid;

                    //console.log('User uid: ' + uuid);
                    firestore().collection('users')
                    .doc(auth().currentUser.uid).collection('profile').doc('profil')
                    .set({
                      firstName: '',
                      lastName: '',
                      email: email,
                      heightName: 0,
                      weightName: 0,
                      targetWeight: 0,
                      gender: 1,
                      birthday: firestore.Timestamp.fromDate(new Date('1992-12-09T22:56:00.000Z')),
                      atcreatedAt: firestore.Timestamp.fromDate(new Date()),
                      userImg: null,
                      weightUnit: UNIT.KG,
                      growthUnit: UNIT.CM,
                      showOunce: true,
                      weightNameLB: 0, 
                      //weightNameST: 0,
                      heightNameIN: 0,
                      //heightNameFT: 0,
                      targetWeightLB: 0,
                      //targetWeightST: 0
                    })
                }).catch((error) => {
                    console.log('Error: 1' + error);
                 })
                 .then(async() => {
                  await insertJson(dataJson);
                 })
                 .catch((error) => {
                  console.log('Error: 2' + error);
                 })
                 .then(async () => {
                    await insertPurineJson(dataPurineJson);
                  })
                 .catch((error) => {
                    console.log('Error: 3' + error);
               })

                
          },

        logout: async () => {
          try {
           await auth()
            .signOut()
            .then(() => console.log('User signed out!'));
            //navigation.navigate('Login');
          } catch (e) {
            console.log(e);
          }
        },

      }}>
      {children}
    </AuthContext.Provider>
  );
};