import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, StatusBar, ImageBackground, Dimensions, TouchableOpacity, ToastAndroid, Alert, Image } from 'react-native';
import { Avatar, Appbar, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../navigation/AuthProvider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment/moment';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { UNIT } from '../../styles/units';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.WHITE,
    accent: colors.COLORS.YELLOW,
  },
};

const ProfileScreen = ({ navigation }) => {

  
  const {t, i18n} = useTranslation();

  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [isVerified, setIsVerified] = useState(false)

  const getUser = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('profil')
    .get()
    .then(( documentSnapshot ) => {
      if( documentSnapshot.exists ) {
        setUserData(documentSnapshot.data());
        const dateB = new Date(documentSnapshot.data().birthday.seconds * 1000);
        setDate(dateB);
      }
    })
  }
 
  useEffect(() => {
    getUser();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);

 
  useEffect(() => {
    setIsVerified(user.emailVerified);
    
  }, []);

   const [image, setImage] = useState('https://pk.czluchow.info/images/iconProfileBlue.png');

  const sendVerificationEmail = async () => {
    await user.sendEmailVerification()
    .then(() => {
      auth().signOut();
      Alert.alert('', 'E-mail weryfikacyjny wysłany, aktywuj konto i zaloguj się ponownie.');
      
    })
    
  }
  
  const changePassword = () => {
    auth().sendPasswordResetEmail(user.email)
    .then(() => {
      Alert.alert('', 'Wysłano na e-mail reset hasła.')
    })
  }

  const _getWeightUnit = () => {
    if(userData.weightUnit === UNIT.KG){
        return (userData.weightName).toFixed(2);
    }else{
        return userData.weightNameLB;
    }
  }

  const _getWeighTargetUnit = () => {
    if(userData.weightUnit === UNIT.KG){
        return (userData.targetWeight).toFixed(2)
    }else{
        return (userData.targetWeightLB).toFixed(2)
    }
  }

  const _getHeightUnit = () => {
    if(userData.growthUnit === UNIT.CM){
        return userData.heightName
    }else{
        return (userData.heightNameIN);
    }
  }
  
  const _goBack = () => navigation.navigate('HomeScreen');
  const imageBG = require('../../assets/images/bg-abstract.jpg');

  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
    <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title={t('profileScreen.my-profile')} />
      
        <Appbar.Action icon="account-edit" onPress={() => navigation.navigate('EditProfile')}  />
        <Appbar.Action icon="logout" onPress={logout} style={{marginRight: spacing.SCALE_4}}/>
    </Appbar.Header>
        <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    resizeMode="cover"
    blurRadius={1}
    style={{ 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.8
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


     <View style={styles.contentContainer}>
      <ScrollView>
      <View style={styles.box}>
      <View style={{marginBottom: spacing.SCALE_10, paddingHorizontal: spacing.SCALE_6, flexDirection: 'row', alignContent: 'center' }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Avatar.Image size={spacing.SCALE_90} source={{uri: userData.userImg != null ? userData.userImg : image }} />
        </View>
     </View>

     <View style={{flexDirection: 'row', marginBottom: spacing.SCALE_10}}>
       <View style={{flex: 1, alignItems: 'flex-end', marginRight: spacing.SCALE_3}}>
        <TouchableOpacity style={styles.btnChangePassword} onPress={changePassword}>
          <Text style={{color: colors.TEXT.WHITE, fontSize: fontScale(typography.FONT_SIZE_10), textTransform: 'uppercase'}}>{t('profileScreen.change-password')}</Text>
        </TouchableOpacity>
       </View>
       <View style={{flex: 1, alignItems: 'flex-start', marginLeft: spacing.SCALE_3}}>
        { isVerified === false ? 
        <TouchableOpacity style={styles.btnVerificationAccount} onPress={sendVerificationEmail}>
          <Text style={{color: colors.TEXT.WHITE, fontSize: fontScale(typography.FONT_SIZE_10), textTransform: 'uppercase'}}>{t('profileScreen.verify-email')}</Text>
        </TouchableOpacity>
         : 
         <View style={styles.btnVerificationAccountTrue}>
         <Text style={{color: colors.TEXT.WHITE, fontSize: fontScale(typography.FONT_SIZE_10), textTransform: 'uppercase'}}>{t('profileScreen.email-verified')}</Text>
       </View>
        
        }
       </View>
     </View>

        <View style={{borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, backgroundColor: colors.COLORS.WHITE }}>
          <Text style={{fontWeight: 'bold', fontSize: fontScale(typography.FONT_SIZE_16), color: colors.TEXT.DEEP_BLUE}}>{t('profileScreen.account-information')}</Text>
        </View>

        <View style={{marginTop: spacing.SCALE_10}}>
            <View style={{width: 150, }}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{t('profileScreen.first-name-last-name')}</Text>
            </View>
        </View>
        <View style={{marginTop: spacing.SCALE_3, marginLeft: spacing.SCALE_10, flexDirection: 'row'}}>
            <AntDesign name='user' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
            <Text style={styles.textValue}>{!userData.firstName ? '-': userData.firstName } {!userData.lastName ? '' : userData.lastName}</Text>
        </View>

        <View style={{marginTop: spacing.SCALE_6}}>
            <View style={{width: 150, }}>
              <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>E-MAIL</Text>
            </View>
        </View>
        <View style={{marginTop: spacing.SCALE_3, marginLeft: spacing.SCALE_10, flexDirection: 'row'}}>
           <Ionicons name='ios-mail' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
           <Text style={styles.textValue}>{userData.email}</Text>
        </View>

        <View style={{borderBottomWidth: 1, borderColor: colors.COLORS.GREY_CCC, backgroundColor: colors.COLORS.WHITE, marginBottom: spacing.SCALE_6, marginTop: spacing.SCALE_15 }}>
            <Text style={{fontWeight: 'bold', fontSize: fontScale(typography.FONT_SIZE_16), color: colors.TEXT.DEEP_BLUE}}>{t('profileScreen.other-data')}</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          
          <View>

            <View style={{marginTop: spacing.SCALE_6, flexDirection: 'row'}}>
              <View style={{width: Dimensions.get('window').width/2-22, }}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{t('profileScreen.current-weight')} ({userData.weightUnit})</Text>
              </View>     
            </View>

            <View style={{marginTop: spacing.SCALE_3, marginLeft: spacing.SCALE_10, flexDirection: 'row'}}>
                <MaterialCommunityIcons name='weight-kilogram' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
                <Text style={styles.textValue}>{!userData.weightName ? '-' : _getWeightUnit()}</Text>
            </View>

          </View>

          <View>

            <View style={{marginTop: spacing.SCALE_6, flexDirection: 'row'}}>
              <View style={{width: Dimensions.get('window').width/2-22, }}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{t('profileScreen.target-weight')} ({userData.weightUnit})</Text>
              </View>     
            </View>

            <View style={{marginTop: spacing.SCALE_3, marginLeft: spacing.SCALE_10, flexDirection: 'row'}}>
                <MaterialCommunityIcons name='weight-kilogram' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
                <Text style={styles.textValue}>{!userData.targetWeight ? '-' :  _getWeighTargetUnit()}</Text>
            </View>

          </View>

        </View>

        <View style={{flexDirection: 'row'}}>
          
          <View>

            <View style={{marginTop: spacing.SCALE_6, flexDirection: 'row'}}>
              <View style={{width: Dimensions.get('window').width/2-22, }}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{t('profileScreen.height')} ({userData.growthUnit})</Text>
              </View>     
            </View>

            <View style={{marginTop: spacing.SCALE_3, marginLeft: spacing.SCALE_10, flexDirection: 'row'}}>
                <MaterialCommunityIcons name='human-male-height' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
                <Text style={styles.textValue}>{!userData.heightName ? '-' : _getHeightUnit()}</Text>
            </View>

          </View>

          <View>

            <View style={{marginTop: spacing.SCALE_6, flexDirection: 'row'}}>
              <View style={{width: Dimensions.get('window').width/2-22, }}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{t('profileScreen.gender')}</Text>
              </View>     
            </View>

            <View style={{marginTop: spacing.SCALE_3, marginLeft: spacing.SCALE_10, flexDirection: 'row'}}>
              { userData.gender === 1 ? 
               (
                <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons name='gender-female' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
                <Text style={[styles.textValue, {marginLeft: spacing.SCALE_10}]}>{t('profileScreen.women')}</Text>
              </View>
               ) 
              :
              (
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons name='gender-male' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
                <Text style={[styles.textValue, {marginLeft: spacing.SCALE_10}]}>{t('profileScreen.men')}</Text>
              </View>
              )
              }
            </View>

          </View>

        </View>

        <View>

          <View style={{marginTop: scale(spacing.SCALE_6)}}>
              <View style={{ }}>
                <Text style={{fontSize: fontScale(typography.FONT_SIZE_12)}}>{t('profileScreen.birthday')}</Text>
              </View>
          </View>
          <View style={{marginTop: spacing.SCALE_3, marginLeft: spacing.SCALE_10, flexDirection: 'row'}}>
            <MaterialCommunityIcons name='calendar' size={spacing.SCALE_20} color={colors.COLORS.GREEN} />
            <Text style={styles.textValue}>{moment(date).format("DD-MM-YYYY")}</Text>
          </View>
        </View>

      </View>

     
     </ScrollView>
     </View>

      
    </ImageBackground>
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default ProfileScreen;

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
    fontSize: fontScale(typography.FONT_SIZE_20),
    color: colors.TEXT.DEEP_BLUE,
  },
  textSubtitle: {
    color: colors.TEXT.DEEP_BLUE,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: spacing.SCALE_6,
    backgroundColor: colors.COLORS.WHITE,
    marginBottom: spacing.SCALE_6,
    borderRadius: spacing.SCALE_5,
  },
  box: {
    backgroundColor: colors.COLORS.WHITE,
    padding: spacing.SCALE_10,
    borderRadius: 5,
  },
  textValue: {
    fontWeight: 'bold',
    fontSize: fontScale(typography.FONT_SIZE_15), 
    marginLeft: spacing.SCALE_10,
    color: colors.TEXT.DEEP_BLUE
  },
  btnChangePassword: {
    backgroundColor: colors.COLORS.LIGHT_BLUE,
    padding: spacing.SCALE_8,
    borderRadius: spacing.SCALE_5
  },
  btnVerificationAccount: {
    backgroundColor: colors.COLORS.RED,
    padding: spacing.SCALE_8,
    borderRadius: spacing.SCALE_5
  },
  btnVerificationAccountTrue: {
    backgroundColor: colors.COLORS.GREEN,
    padding: spacing.SCALE_8,
    borderRadius: spacing.SCALE_5
  }
})