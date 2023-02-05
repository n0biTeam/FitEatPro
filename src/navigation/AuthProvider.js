import React, {createContext, useState } from 'react';
import { ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import dataPL from '../data/dataPL';
import dataPurinePL from '../data/dataPurinePL';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
   const [user, setUser] = useState();

   const dataJsonPL = dataPL;
   const dataPurineJsonPL = dataPurinePL;
   
   const insertJson = async (dataJsonPL) => {
    try {
      const promises = [];
      dataJsonPL.forEach((item) => {
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

const insertPurineJson = async (dataPurineJsonPL) => {
  try {
    const promises = [];
    dataPurineJsonPL.forEach((item) => {
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
              console.log('User account created & signed in!');
              //navigation.navigate('Home');
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
        },
   
        register: async (values) => {
    
            const email = values.email;
            //console.log(email);
            await auth()
                .createUserWithEmailAndPassword(
                    values.email,
                    values.password
                )
                .then(() => {
                    console.log('User account created & signed in!');
                    ToastAndroid.show('Konto zostało utworzone.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
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
                      weightUnit: 'kg',
                      growthUnit: 'cm',
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
                  await insertJson(dataJsonPL);
                 })
                 .catch((error) => {
                  console.log('Error: 2' + error);
                 })
                 .then(async () => {
                    await insertPurineJson(dataPurineJsonPL);
                  })
                 .catch((error) => {
                    console.log('Error: 3' + error);
               })

                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                   // console.log('That email address is already in use!');
                    ToastAndroid.show('Adres e-mail jest już używany przez inne konto.', ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
        
                    if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    }
        
                    //console.error('Error: 2' + error);
                });
          },

        // forgetPassword: async (values) => {
        //   const email = values.email;
        //   await auth().sendPasswordResetEmail(email)
        //   .then(() => {
        //     Alert.alert('Wysłano na e-mail reset hasła.');
        //     //navigation.navigate('Login');
        //   }).catch((error) => {
        //     console.log(error);
        //   })
        // },

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