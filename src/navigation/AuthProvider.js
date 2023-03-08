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
              ToastAndroid.show(t('provider.user-account-created'), ToastAndroid.LONG, ToastAndroid.CENTER);
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                ToastAndroid.show(t('provider.email-already-in-use'), ToastAndroid.LONG, ToastAndroid.CENTER);
              }
          
              if (error.code === 'auth/invalid-email') {
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
            await auth()
                .createUserWithEmailAndPassword(
                    values.email,
                    values.password
                )
                .catch(error => {
                  if (error.code === 'auth/email-already-in-use') {
                    ToastAndroid.show(t('provider.email-already-in-use'), ToastAndroid.LONG, ToastAndroid.CENTER);
                  }
              
                  if (error.code === 'auth/invalid-email') {
                    ToastAndroid.show(t('provider.invalid-email'), ToastAndroid.LONG, ToastAndroid.CENTER);
                  }
                           
                  console.error(error);
                })
                .then(() => {
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
                      heightNameIN: 0,
                      targetWeightLB: 0,
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
          } catch (e) {
            console.log(e);
          }
        },

      }}>
      {children}
    </AuthContext.Provider>
  );
};