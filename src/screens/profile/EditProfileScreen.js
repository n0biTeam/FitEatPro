import React, {useState, useEffect, useContext, useRef} from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, StatusBar, TouchableOpacity, Platform, ActivityIndicator, ToastAndroid, Image } from 'react-native';
import { TextInput, Appbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../navigation/AuthProvider';
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import MySwitch from '../../components/MySwitch';
import { ScrollView } from 'react-native-gesture-handler';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';


const EditProfileScreen = ({ navigation }) => {

  const {t, i18n} = useTranslation();

  const {user} = useContext(AuthContext); 
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState([]);
  //const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [gender, setGender] = useState('');
  const [genderV, setGenderV] = useState('');
    
  //const {uid} = auth().currentUser;


//console.log(user.uid)



  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('profile')
      .doc('profil')
      .onSnapshot(documentSnapshot => {
        if( documentSnapshot.exists ) {
          setUserData(documentSnapshot.data());
          const dateB = new Date(documentSnapshot.data().birthday.seconds * 1000);
          setDate(dateB);
          const v = documentSnapshot.data().gender;
          setGenderV(v);
          setImage(documentSnapshot.data().userImg)
        }
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);


  
  // useEffect(() => {
  //   getUser();
    
  // }, []);

  // const getUser = async () => {
  //    await firestore()
  //   .collection('users')
  //   .doc(user.uid)
  //   .collection('profile')
  //   .doc('profil')
  //   .get()
  //   .then(( documentSnapshot ) => {
  //     if( documentSnapshot.exists ) {
  //       //console.log('User Data: ', documentSnapshot.data());
  //       setUserData(documentSnapshot.data());
  //       //console.log(documentSnapshot.data().birthday);
  //       const dateB = new Date(documentSnapshot.data().birthday.seconds * 1000);
  //       //setBirthdayDate(moment(dateB).format("DD-MM-YYYY"));
  //       setDate(dateB);
  //       const v = documentSnapshot.data().gender;
  //       setGenderV(v);
              
       
  //     }
  //   })
  // }

   
  const handleUpdate = async () => {
    let imgUrl = await uploadImage();
    console.log('imgUrl: ' + imgUrl);
    
    if( imgUrl === null && userData.userImg ) {
      imgUrl = userData.userImg;
    }
    console.log('imgUrl: ' + imgUrl);
    console.log('imageB: '+ userData.userImg);

    // Waga aktualna
    if(userData.weightUnit === 'kg'){
      weightKG = parseFloat(userData.weightName);               
      weightLB = parseFloat(userData.weightName) / 0.4536;      
      weightST = parseFloat(userData.weightName) / 6.35;        
    }else if(userData.weightUnit === 'lb'){
      weightKG = parseFloat(userData.weightName) * 0.45359237;  
      weightLB = parseFloat(userData.weightName);               
      weightST = parseFloat(userData.weightName) / 14;          
    }else{
      weightKG = parseFloat(userData.weightName) / 0.15747;     
      weightLB = parseFloat(userData.weightName) / 0.0714286;   
      weightST = parseFloat(userData.weightName);               
    }

    // Waga docelowa
    if(userData.weightUnit === 'kg'){
      targetKG = parseFloat(userData.targetWeight);                
      targetLB = parseFloat(userData.targetWeight) / 0.4536;      
      targetST = parseFloat(userData.targetWeight) / 6.35;        
    }else if(userData.weightUnit === 'lb'){
      targetKG = parseFloat(userData.targetWeight) * 0.45359237;  
      targetLB = parseFloat(userData.targetWeight);               
      targetST = parseFloat(userData.targetWeight) / 14;          
    }else{
      targetKG = parseFloat(userData.targetWeight) / 0.15747;     
      targetLB = parseFloat(userData.targetWeight) / 0.0714286;   
      targetST = parseFloat(userData.targetWeight);               
    }

    // Różnica
    if(userData.weightUnit === 'kg'){
      diffKG = parseFloat(userData.weightName) - parseFloat(userData.targetWeight);              
      diffLB = (parseFloat(userData.weightName) / 0.4536) - (parseFloat(userData.targetWeight) / 0.4536);      
      diffST = (parseFloat(userData.weightName) / 6.35) - (parseFloat(userData.targetWeight) / 6.35);        
    }else if(userData.weightUnit === 'lb'){
      diffKG = (parseFloat(userData.weightName) * 0.45359237) - (parseFloat(userData.targetWeight) * 0.45359237);  
      diffLB = parseFloat(userData.weightName) - parseFloat(userData.targetWeight);               
      diffST = (parseFloat(userData.weightName) / 14) - (parseFloat(userData.targetWeight) / 14);          
    }else{
      diffKG = (parseFloat(userData.weightName) / 0.15747) - (parseFloat(userData.targetWeight) / 0.15747);
      diffLB = (parseFloat(userData.weightName) / 0.0714286) - (parseFloat(userData.targetWeight) / 0.0714286);   
      diffST = parseFloat(userData.weightName) - parseFloat(userData.targetWeight);               
    }

    // Wzrost
    if(userData.growthUnit === 'cm'){
      heightCM = parseFloat(userData.heightName);
      heightIN = parseFloat(userData.heightName) / 2.54;
      heightFT = parseFloat(userData.heightName) / 30.48;
    }else if(userData.growthUnit === 'in'){
      heightCM = parseFloat(userData.heightName) * 2.54;
      heightIN = parseFloat(userData.heightName);               
      heightFT = parseFloat(userData.heightName) / 12;
    }else{
      heightCM = parseFloat(userData.heightName) * 30.48;
      heightIN = parseFloat(userData.heightName) * 12;   
      heightFT = parseFloat(userData.heightName);               
    }

    //console.log('image: ' + image);
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('profil')
    .update({
      firstName: userData.firstName,
      lastName: userData.lastName,
      
      weightName: weightKG,
      weightNameLB: weightLB,
      weightNameST: weightST,

      targetWeight: targetKG,
      targetWeightLB: targetLB,
      targetWeightST: targetST,
      
      heightName: heightCM,
      heightNameIN: heightIN,
      heightNameFT: heightFT,
      
      birthday: date,
      gender: gender ? gender : userData.gender,
      userImg: imgUrl === null ? null : imgUrl,
      difference: diffKG,
      differenceLB: diffLB,
      differenceST: diffST,

    })
    .then(() => {
      console.log('User Update');
      ToastAndroid.show(t('editProfileScreen.profile-updated'), ToastAndroid.LONG, ToastAndroid.CENTER);
      navigation.navigate('Profile');
    })

  }

 //console.log(image2)
  useEffect(() => {
    // firebase.firestore().collection('users')
    // .doc(user.uid).collection('profile').doc('profil').get()
    // .then((snapshot) => {
    //   if(snapshot.exists){
    //     setUserData(snapshot.data())
        
    //   }
    //   else{
    //     console.log('User does not exist 12');
    //   }
    // })
    }, []);
  
  const refRBSheet = useRef();
  const [isOpen, setIsOpen] = useState(true);

  
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      refRBSheet.current.close();
    }).catch(err => {
      ToastAndroid.show(t('editProfileScreen.no-photo-selected'), ToastAndroid.LONG, ToastAndroid.CENTER);
     });
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      //console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      refRBSheet.current.close();
    }).catch(err => {
      ToastAndroid.show(t('editProfileScreen.no-photo-selected'), ToastAndroid.LONG, ToastAndroid.CENTER);
     });
  }

  const uploadImage = async () => {

    if(image == null) {
      return null;
    }
    
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    const extension = filename.split('.').pop();
    filename = 'profilePhoto' + '.' + extension;


    setUploading(true);
    setTransferred(0);

    //const task = storage().ref('users/' + user.uid + '/photoProfile/' + filename).putFile(uploadUri);

    const storageRef = storage().ref('users/' + user.uid + '/photoProfile/' + filename);
    const task = storageRef.putFile(uploadUri);

    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      setTransferred(
      Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
    );
    });

    try {
      await task;
      
      const url = await storageRef.getDownloadURL();
      
      
      setUploading(false);
      setImage(null);
      
      return url;

    } catch(e) {
      console.log(e);
      return null;
    }
      
  };


  const _goBack = () => navigation.goBack();

  
  const onSelectSwitch = (index) => {
    setGender(index);
  };

        
  const imageBG = require('../../assets/images/bg-abstract.jpg');
  
    
    return (
    
    <>
    <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('editProfileScreen.edit-profile')} />
    </Appbar.Header>
    {/* <StatusBar translucent={false} backgroundColor="#224870" barStyle="light-content"/> */}
    <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => setIsOpen(false)}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: colors.COLORS.DEEP_BLUE,
          },
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            elevation: 15
          }
        }}
      >
       
        <View style={styles.contentContainer}>
            <View style={{marginBottom: spacing.SCALE_10, alignItems: 'center'}}>
              <Text style={styles.textTitle}>{t('editProfileScreen.upload-photo')}</Text>
              <Text style={styles.textSubtitle}>{t('editProfileScreen.select-your-profile-picture')}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity onPress={takePhotoFromCamera} style={styles.btnModal}>
                <Text style={styles.textBtn}>{t('editProfileScreen.take-photo')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={choosePhotoFromLibrary} style={styles.btnModal}>
                <Text style={styles.textBtn}>{t('editProfileScreen.choose-from-the-library')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => refRBSheet.current.close()} style={styles.btnModal}>
                <Text style={styles.textBtn}>{t('editProfileScreen.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
      </RBSheet>
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
            opacity: 0.5
          }}
        
      >
      <ImageBackground 
      source={require('../../assets/images/wave.png')}
      style={{ 
        flex: 1, 
        width: Dimensions.get('window').width,
        height: 200,
        width: Dimensions.get('window').width,
        }}
      
      >

      <View style={{paddingHorizontal: spacing.SCALE_10, alignItems: 'center' }}>
       
      <TouchableOpacity onPress={() => refRBSheet.current.open()}>
        <View style={{height: spacing.SCALE_80, width: spacing.SCALE_80, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
         
        
          {/* <Image
            source={{uri: image}}
            style={{height: spacing.SCALE_90, width: spacing.SCALE_90}}
          /> */}
          
          
        { image !== null ?
          <ImageBackground
            source={userData ? {uri: image} : {uri: 'https://primacgurus.org.au/wp-content/uploads/2021/01/No-Profile-image.jpg'} }
            style={{height: spacing.SCALE_90, width: spacing.SCALE_90}}
            imageStyle={{borderRadius: 45, borderWidth: 1, backgroundColor: colors.COLORS.LIGHT_BLUE}}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name='camera' color={colors.COLORS.WHITE} size={35}
                style={{
                  opacity: 0.7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.COLORS.WHITE,
                  borderRadius: 10,
                  paddingLeft: spacing.SCALE_2, 
                  paddingTop: spacing.SCALE_2
                }}
              />
            </View>
            
          </ImageBackground> : 
          <ImageBackground
          source={{uri: 'https://primacgurus.org.au/wp-content/uploads/2021/01/No-Profile-image.jpg'}}
          style={{height: spacing.SCALE_90, width: spacing.SCALE_90}}
          imageStyle={{borderRadius: 45, borderWidth: 1, backgroundColor: colors.COLORS.LIGHT_BLUE}}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name='camera' color={colors.COLORS.WHITE} size={35}
              style={{
                opacity: 0.7,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.COLORS.WHITE,
                borderRadius: 10,
                paddingLeft: spacing.SCALE_2, 
                paddingTop: spacing.SCALE_2
              }}
            />
          </View>
          
        </ImageBackground>
        }
        </View>
      </TouchableOpacity>
    </View>

       
        <View style={{justifyContent: 'flex-start', marginTop: spacing.SCALE_35, marginHorizontal: spacing.SCALE_6, flex: 1}}>
        <ScrollView>
          
          <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_6}}>
            <MaterialCommunityIcons name='account-check' size={typography.FONT_SIZE_20} color={colors.COLORS.DEEP_BLUE} />
            <Text style={{color: colors.COLORS.DEEP_BLUE, marginLeft: spacing.SCALE_6, fontSize: typography.FONT_SIZE_15, fontWeight: 'bold'}}>{userData.email}</Text>
          </View>
            
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('editProfileScreen.first-name')}
            value={userData ? userData.firstName : ''}
            onChangeText={(txt) => setUserData({...userData, firstName: txt})}
            style={styles.boxTextInput}
          />
          <View style={{marginBottom: spacing.SCALE_6}}></View>
          <TextInput
            underlineColor={colors.COLORS.LIGHT_GREY}
            activeUnderlineColor={colors.COLORS.DEEP_BLUE}
            label={t('editProfileScreen.last-name')}
            value={userData ? userData.lastName : ''}
            onChangeText={(txt) => setUserData({...userData, lastName: txt})}
            style={styles.boxTextInput}
          />
          <View style={{marginBottom: spacing.SCALE_6}}></View>

          <View style={{flexDirection: 'row'}}>
          
          <View style={{flex: 1, marginRight: spacing.SCALE_3}}>
            <TextInput
              underlineColor={colors.COLORS.LIGHT_GREY}
              activeUnderlineColor={colors.COLORS.DEEP_BLUE}
              label={t('editProfileScreen.height') + ' [cm]'}
              value={userData ? String(userData.heightName) : String('0')}
              onChangeText={(txt) => setUserData({...userData, heightName: txt})}
              keyboardType="numeric"
              style={styles.boxTextInput}
            />
          </View>
          
          <View style={{flex: 1, marginLeft: spacing.SCALE_3}}>
            <TextInput
             underlineColor={colors.COLORS.LIGHT_GREY}
             activeUnderlineColor={colors.COLORS.DEEP_BLUE}
              label={t('editProfileScreen.current-weight') + ' [kg]'}
              value={userData ? String(userData.weightName) : ''}
              onChangeText={(txt) => setUserData({...userData, weightName: txt})}
              keyboardType="numeric"
              style={styles.boxTextInput}
            />
            </View>
          </View>

          <View style={{marginTop: spacing.SCALE_6}}>
          <TextInput
              underlineColor={colors.COLORS.LIGHT_GREY}
              activeUnderlineColor={colors.COLORS.DEEP_BLUE}
              label={t('editProfileScreen.target-weight') + ' [kg]'}
              value={userData ? String(userData.targetWeight) : ''}
              onChangeText={(txt) => setUserData({...userData, targetWeight: txt})}
              keyboardType="numeric"
              style={styles.boxTextInput}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginTop: spacing.SCALE_6}}>
            
              <TouchableOpacity onPress={() => setOpen(true)} style={styles.datePicker}>
                <Text style={{fontSize: 12, marginBottom: 5}}>{t('editProfileScreen.birthday')}</Text>
                <Text style={{fontSize: 16, color: colors.TEXT.BLACK}}>{moment(date).format("DD-MM-YYYY")}</Text>
              </TouchableOpacity>
            </View>

            <View>
              
                  <DatePicker
                   
                    modal
                    mode='date'
                    locale='PL-pl'
                    title='Data urodzenia'
                    confirmText='Ustaw'
                    cancelText='Anuluj'
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                      setOpen(false)
                      setDate(date)
                    }}
                    onCancel={() => {
                      setOpen(false)
                    }}
                  />
            </View>
          </View>

          <View style={{marginTop: spacing.SCALE_6, marginBottom: spacing.SCALE_10}}>
            { genderV ? 
              (
              <MySwitch
              selectionMode={genderV}
              roundCorner={true}
              option1={t('editProfileScreen.women')}
              option2={t('editProfileScreen.men')}
              onSelectSwitch={onSelectSwitch}
              selectionColor={colors.COLORS.DEEP_BLUE}
            /> 
            ) : (
              ''
            )
            }
            {/* {console.log(genderV)} */}
            {/* {console.log()} */}
            
          </View>



           
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
           <View style={{marginTop: 0}}>
               <TouchableOpacity onPress={handleUpdate} style={{backgroundColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_10, width: Dimensions.get('window').width-12, alignItems: 'center', borderRadius: 5}}>
                   <Text style={{color: colors.TEXT.WHITE}}>{t('editProfileScreen.update')}</Text>
               </TouchableOpacity>
           </View>
          {
          
            uploading ? (
              <View>
                 <Text>{transferred} % {t('editProfileScreen.completed')}!</Text>
                 <ActivityIndicator size="large" color={colors.COLORS.DEEP_BLUE} />
              </View>
            ) : (
              ''
            )


          }
        </View>
        </ScrollView>
      </View>
      
    </ImageBackground>
    </ImageBackground>
    </>
  )
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.COLORS.WHITE,
    shadowColor: colors.COLORS.GREY_333,
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: spacing.SCALE_20, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    
  },
  panelHeader: {
    alignItems: 'center',
  },
  textTitle: {
    fontSize: typography.FONT_SIZE_20,
    color: colors.TEXT.DEEP_BLUE,
  },
  textSubtitle: {
    color: colors.TEXT.DEEP_BLUE,
  },
  contentContainer: {
    flex: 1,
  },
  btnModal: {
    borderWidth: 0,
    padding: spacing.SCALE_10,
    width: Dimensions.get('window').width-12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.COLORS.DEEP_BLUE,
    elevation: 3,
    marginBottom: spacing.SCALE_10,
  },
  textBtn: {
    color: colors.TEXT.WHITE
  },
  action: {
    flexDirection: 'row',
    marginTop: spacing.SCALE_10,
    marginBottom: spacing.SCALE_10,
    borderBottomWidth: 1,
    borderBottomColor: colors.COLORS.GREY_999,
    paddingBottom: spacing.SCALE_5,
    justifyContent: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: spacing.SCALE_10,
    color: colors.TEXT.DEEP_BLUE,
    marginBottom: -spacing.SCALE_10
  },
  boxTextInput: {
    backgroundColor: colors.COLORS.WHITE
  },
  datePicker: {
    borderWidth: 1, 
    borderColor: colors.COLORS.GREY_DDD,
    padding: spacing.SCALE_8,
    backgroundColor: colors.COLORS.WHITE
  }
})