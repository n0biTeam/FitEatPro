import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions, ScrollView, Pressable, ToastAndroid, Image, Alert } from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';


const FindingViewScreen = ({ route, navigation }) => {

  const findingId = route.params.itemId;
  
  const {t, i18n} = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {user} = useContext(AuthContext); 
  const [image, setImage] = useState(null);
  const [imageOld, setImageOld] = useState(null);
  const [findingDate, setFindingDate] = useState(new Date());
  const [dataFinding, setDataFinding] = useState([]);
  const [loading, setLoading] = useState(true);
      
  const _goBack = () => navigation.navigate('FindingScreen');
  
  const images = [
    {
      id: 1,
      url: !image ? imageOld : image,
    
    },
  ];

  const getViewFinding = () => {
    firestore()
   .collection('users')
   .doc(user.uid)
   .collection('findings')
   .doc(findingId)
   .get()
   .then(doc => {
    const dataFinding = [];
     if (doc.exists) {
       setTitle(doc.data().title);
       setDescription(doc.data().description);
       setImageOld(doc.data().imageUrl);
       setFindingDate(doc.data().createdAt);
       dataFinding.push({...doc.data(), id: doc.id}); 
       setDataFinding(dataFinding);
     }
   });
 };

 useEffect(() => {
  getViewFinding();
  navigation.addListener("focus", () => setLoading(!loading));
}, [navigation, loading]);

  console.log(image)
  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => setIsOpen(true);
  const closeGallery = () => setIsOpen(false);
  
  const emptyBtn = (image != null) && (title != null);

  const _alertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '',
      //body
      t('findingViewScreen.alert.finding-delete'),
      [
        { text: t('findingViewScreen.alert.yes'), onPress: () => _handleDeleteFinding() },
        {
          text: t('findingViewScreen.alert.no'),
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  const _handleDeleteFinding = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('findings')
    .doc(findingId)
    .delete()
    .then(async () => {
        let imageRef = storage().refFromURL(imageOld);
        await imageRef.delete();
        })
    .then(() => {
       ToastAndroid.show(t('findingViewScreen.toast.finding-delete'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
       navigation.navigate('FindingScreen');
    })
  }
  const imageBG = require('../../assets/images/wynik1.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('findingViewScreen.title-1')} />
       <Appbar.Action icon="clipboard-edit-outline" onPress={() => 
                  navigation.navigate('FindingEditScreen', {itemId: findingId})
                } />
       <Appbar.Action icon="trash-can" onPress={_alertHandler} />
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
        { dataFinding.length > 0 &&
            <View style={styles.noteContainer}>
            
                <View style={[styles.date, {flexDirection: 'row'}]}>
                
                    <View>
                    <MaterialCommunityIcons name='clock-time-five' size={spacing.SCALE_14} color={colors.COLORS.DEEP_BLUE} />
                    </View>
                
                    <View>
                    <Text style={{marginLeft: spacing.SCALE_3, fontSize: typography.FONT_SIZE_11, color: colors.TEXT.DEEP_BLUE}}>{format(findingDate.toDate(), 'dd/MM/yyyy, HH:mm')}</Text>
                    </View>

                </View>
          
                <View>
                    <Text style={styles.title}>{title}</Text>
                </View>
                
                <View>
                    <Text>{t('findingViewScreen.description')}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

            </View>
            }
           
            
            <ScrollView>
                
            { imageOld &&
            
            <View style={{flex: 1, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderRadius: spacing.SCALE_5, marginTop: 0}}>
                    <Text>{t('findingViewScreen.photo')}</Text>
                <Pressable onPress={openGallery}>
                    <Image
                        source={{uri: !image ? imageOld : image}}
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

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default FindingViewScreen;

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
      date: {
        marginTop: spacing.SCALE_6
      },
      title: {
        paddingBottom: spacing.SCALE_5,
        paddingTop: spacing.SCALE_5,
        fontSize: typography.FONT_SIZE_18,
        color: colors.TEXT.DEEP_BLUE,
        fontWeight: 'bold'
      },
      description: {
        fontSize: typography.FONT_SIZE_14,
        marginBottom: spacing.SCALE_6,
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