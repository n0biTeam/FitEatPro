import { StyleSheet, Text, View, TextInput, ImageBackground, StatusBar, Dimensions, ScrollView, Pressable, ToastAndroid, Image, ActivityIndicator } from 'react-native';
import React, {useState, useRef, useContext} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { AuthContext } from '../../navigation/AuthProvider';
import RBSheet from "react-native-raw-bottom-sheet";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import { t } from 'i18next';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';


const FindingAddScreen = ({ navigation }) => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {user} = useContext(AuthContext); 

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const refRBSheet = useRef();
     
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 768,
      compressImageMaxHeight: 1024,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      refRBSheet.current.close();
    }).catch(err => {
      ToastAndroid.show(t('findingAddScreen.toast.no-photo-selected'), ToastAndroid.LONG, ToastAndroid.CENTER);
     });
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 768,
      compressImageMaxHeight: 1024,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      refRBSheet.current.close();
    }).catch(err => {
      ToastAndroid.show(t('findingAddScreen.toast.no-photo-selected'), ToastAndroid.LONG, ToastAndroid.CENTER);
     });
  }

  const uploadImage = async () => {

    if(image == null) {
      return null;
    }
    
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;


    setUploading(true);
    setTransferred(0);
    
    const storageRef = storage().ref('users/' + user.uid + '/findings/' + filename);
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
  
  const _goBack = () => navigation.navigate('HomeScreen');
  
  const _addFinding = async () => {
    let imgUrl = await uploadImage();
    console.log('image: ' + imgUrl);
    
    if( imgUrl === null ) {
      imgUrl = null;
    }

    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('findings')
      .add({
      createdAt: firestore.Timestamp.fromDate(new Date()),
      title: title,
      description: description,
      imageUrl: !imgUrl ? null : imgUrl
    })
    .then(() => {
      console.log('User Update');
      ToastAndroid.show(t('findingAddScreen.toast.added'), ToastAndroid.LONG, ToastAndroid.CENTER);
      navigation.navigate('FindingScreen');
    })
  }

  
  const images = [
    {
      id: 1,
      url: !image ? null : image,
    
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
    const openGallery = () => setIsOpen(true);
    const closeGallery = () => setIsOpen(false);

    //onst [visible, setIsVisible] = useState(false);
  //console.log(title)

  const emptyBtn = (image != null) && (title != null);
  const imageBG = require('../../assets/images/wynik1.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('findingAddScreen.title')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={1}
    resizeMode="cover"
    style={{ 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.4
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
            <View style={styles.noteContainer}>
          
                <View>
                    <TextInput 
                        placeholder={t('findingAddScreen.title-1')}
                        onChangeText={setTitle}
                        value={title}
                        style={styles.titleInput }
                    />
                </View>
                <ScrollView>
                    <TextInput 
                        placeholder={t('findingAddScreen.description')}
                        onChangeText={setDescription}
                        value={description}
                        multiline
                        numberOfLines={7}
                        style={styles.description}
                    />
                </ScrollView>

                           
          
            </View>

            <View style={{ alignItems: 'center', flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Pressable onPress={() => refRBSheet.current.open()}>
                    <View style={{backgroundColor: colors.COLORS.DEEP_BLUE, padding: spacing.SCALE_10, alignItems: 'center', borderRadius: spacing.SCALE_5, marginRight: spacing.SCALE_3}}>
          
                        <View style={{flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center'}}>
                                <MaterialIcons name='add-photo-alternate' size={spacing.SCALE_25} color={colors.COLORS.WHITE}/>
                            </View>
                            <View style={{marginLeft: spacing.SCALE_6, justifyContent: 'center'}}>
                                <Text style={{color: colors.TEXT.WHITE}}>{t('findingAddScreen.select-a-photo')}</Text>
                            </View>
                        </View>
          
                    </View>
                </Pressable>
                </View>

                <View style={{flex: 1}}>

                  <Pressable onPress={_addFinding} disabled={!emptyBtn}>
                    <View style={{backgroundColor: !image || !title ? colors.COLORS.GREY_AAA : colors.COLORS.GREEN, padding: spacing.SCALE_10, alignItems: 'center', borderRadius: spacing.SCALE_5, marginLeft: spacing.SCALE_3}}>
            
                      <View style={{flexDirection: 'row'}}>
                          <View style={{justifyContent: 'center'}}>
                              <MaterialIcons name='save' size={spacing.SCALE_25} color={colors.COLORS.WHITE}/>
                          </View>
                          <View style={{marginLeft: spacing.SCALE_6, justifyContent: 'center'}}>
                              <Text style={{color: colors.TEXT.WHITE}}>{t('findingAddScreen.save')}</Text>
                          </View>
                      </View>

                    </View>
                  </Pressable>
                 
                </View>
            </View>
            
            <ScrollView>
            
            {
            uploading ? (
              <View style={{flex: 1, backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderRadius: spacing.SCALE_5, alignItems: 'center'}}>
                  <Text style={{color: colors.TEXT.DEEP_BLUE}}>{transferred} % {t('findingAddScreen.completed')}</Text>
                  <ActivityIndicator size="large" color={colors.COLORS.DEEP_BLUE} />
            </View>
            ) : (
              ''
            )
           }
            { image &&
            <View style={{flex: 1, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderRadius: spacing.SCALE_5, marginTop: 6}}>
           <Pressable onPress={openGallery}>
            
            <Image
                            source={{uri: !image ? null : image}}
                            style={{ width: 150, height: Dimensions.get('window').height/3 }}
                           
                        />
             
             
             </Pressable>
            <View>
               
                <ImageGallery close={closeGallery} isOpen={isOpen} images={images} hideThumbs={true}/>
            </View>

             </View>
            }
            </ScrollView>
        </View>
        

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
       
        <View style={{flex: 1}}>
            <View style={{marginBottom: spacing.SCALE_10, alignItems: 'center'}}>
              <Text style={styles.textTitle}>{t('findingAddScreen.upload-photo')}</Text>
              <Text style={styles.textSubtitle}>{t('findingAddScreen.select-picture')}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Pressable onPress={takePhotoFromCamera} style={styles.btnModal}>
                <Text style={styles.textBtn}>{t('findingAddScreen.take-photo')}e</Text>
              </Pressable>

              <Pressable onPress={choosePhotoFromLibrary} style={styles.btnModal}>
                <Text style={styles.textBtn}>{t('findingAddScreen.choose-from-the-library')}</Text>
              </Pressable>

              <Pressable onPress={() => refRBSheet.current.close()} style={styles.btnModal}>
                <Text style={styles.textBtn}>{t('findingAddScreen.close')}</Text>
              </Pressable>
            </View>
          </View>
      </RBSheet>

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default FindingAddScreen;

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: spacing.SCALE_6,
      },
    noteContainer: {
        backgroundColor: colors.COLORS.WHITE,
        borderRadius: 5,
        marginBottom: spacing.SCALE_6,
        paddingHorizontal: spacing.SCALE_5,
      },
      titleInput: {
        borderBottomWidth: 1,
        borderBottomColor: colors.COLORS.DEEP_BLUE,
        paddingBottom: spacing.SCALE_5,
        fontSize: typography.FONT_SIZE_16
      },
      description: {
        textAlignVertical: 'top'
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
      textTitle: {
        fontSize: typography.FONT_SIZE_20,
        color: colors.TEXT.DEEP_BLUE,
      },
      textSubtitle: {
        color: colors.TEXT.DEEP_BLUE,
      },
})