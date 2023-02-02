import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React, {useState, useContext, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, Button, TextInput } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing } from '../../styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

const BmrScreen = ({ navigation }) => {

  const {t, i18n} = useTranslation();

  const {user} = useContext(AuthContext); 
  //const [male, setMale] = useState(false);
  const [female, setFemale] = useState(false);
  const [userData, setUserData] = useState('');
  const [age, setAge] = useState(0);
  const [sumBMR, setSumBMR] = useState(0);
  const [sumCPM, setSumCPM] = useState(0);


    const getUser = async () => {
        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('profile')
        .doc('profil')
        .get()
        .then(( doc ) => {
          if( doc.exists ) {
            setUserData(doc.data());
            const dateB = new Date(doc.data().birthday.seconds * 1000);
            setAge(new Date().getFullYear() - dateB.getFullYear());
          }
        })
      }
    
      useEffect(() => {
        getUser();
        
      }, []);

      //console.log('statusBarHeight: ', StatusBar.currentHeight)
  const _goBack = () => navigation.navigate('HomeScreen');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: t('bmrScreen.label-1'), value: 1.2},
    {label: t('bmrScreen.label-2'), value: 1.3},
    {label: t('bmrScreen.label-3'), value: 1.4},
    {label: t('bmrScreen.label-4'), value: 1.5},
    {label: t('bmrScreen.label-5'), value: 1.6},
    {label: t('bmrScreen.label-6'), value: 1.7},
    {label: t('bmrScreen.label-7'), value: 1.8},
    {label: t('bmrScreen.label-8'), value: 1.9},
    {label: t('bmrScreen.label-9'), value: 2.0},
    {label: t('bmrScreen.label-10'), value: 2.2},
  ]);

  const emptyBtn = (value != null && value != '')
            && (userData.gender != null && userData.gender != '');

    const bmrCalc = () => {
    //console.log(userData.weightName);
      if(userData.gender === 1){
        //console.log('Kobieta');
        const ppm = 665 + (9.6 * userData.weightName) + (1.7 * userData.heightName) - (4.7 * age);
        setSumBMR(ppm);
      }else{
        //console.log('Mężczyzna');
        const ppm = 66 + (13.7 * userData.weightName) + (5 * userData.heightName) - (6.8 * age);
        setSumBMR(ppm);
      }
  }

  const cpmCalc = () => {
      if(female === true){
        //console.log('Kobieta');
        const ppm = (665 + (9.6 * userData.weightName) + (1.7 * userData.heightName) - (4.7 * age))*value;
        setSumCPM(ppm);
      }else{
        //console.log('Mężczyzna');
        const ppm = (66 + (13.7 * userData.weightName) + (5 * userData.heightName) - (6.8 * age))*value;
        setSumCPM(ppm);
      }
  }

  const image = require('../../assets/images/owoce6.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.BLACK, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('bmrScreen.bmr-calculator')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor={colors.COLORS.BLACK} barStyle="light-content"/>
    <ImageBackground 
    source={image}
    blurRadius={1}
    resizeMode="cover"
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        //opacity: 0.8
      }}
    
  >
    <View style={styles.rootContainer}>
    <View style={{}}>
        <Text style={{color: colors.TEXT.YELLOW, fontWeight: 'bold', fontSize: typography.FONT_SIZE_16}}>{t('bmrScreen.calorie-calculator')}</Text>
      </View>
      
      <Text style={{marginBottom: spacing.SCALE_6, color: colors.TEXT.WHITE}}>{t('bmrScreen.enter-values')}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: spacing.SCALE_3, elevation: 5}}>
            <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('bmrScreen.height') + ' (cm)'}
                value={userData ? userData.heightName.toString() : ''}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={(txt) => setUserData({...userData, heightName: txt})}
                keyboardType="numeric"
            />
        </View>

        <View style={{flex: 1, marginLeft: 3, elevation: 5}}>
            <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('bmrScreen.body-weight') + ' (kg)'}
                value={userData ? userData.weightName.toString() : ''}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={(txt) => setUserData({...userData, weightName: txt})}
                keyboardType="numeric"
            />
        </View>
      </View>
      
      <View style={{flexDirection: 'row', marginTop: 6}}>
        <View style={{flex: 1, marginRight: 3, elevation: 5}}>
            <TextInput
                underlineColor={colors.COLORS.LIGHT_GREY}
                activeUnderlineColor={colors.COLORS.DEEP_BLUE}
                label={t('bmrScreen.age')}
                style={{backgroundColor: colors.COLORS.WHITE}}
                onChangeText={setAge}
                value={age.toString()}
                keyboardType="numeric"

            />
        </View>

        <View style={{flex: 1, marginLeft: spacing.SCALE_3, elevation: 5, backgroundColor: colors.COLORS.WHITE, borderTopStartRadius: 5, borderTopEndRadius: 5}}>
            
            <View style={{padding: spacing.SCALE_10}}>
              <Text style={{fontSize: 12}}>{t('bmrScreen.gender')}</Text>
            </View>
            <View style={{marginLeft: spacing.SCALE_10, marginTop: -spacing.SCALE_5}}>
            { userData.gender === 1 ? 
              (
                <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons name='gender-female' size={spacing.SCALE_22} color={colors.COLORS.GREEN} />
                <Text style={{marginLeft: spacing.SCALE_10, marginTop: spacing.SCALE_3}}>{t('bmrScreen.women')}</Text>
              </View>
               ) 
              :
              (
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons name='gender-male' size={spacing.SCALE_22} color={colors.COLORS.GREEN} />
                <Text style={{marginLeft: spacing.SCALE_10, marginTop: spacing.SCALE_3}}>{t('bmrScreen.men')}</Text>
              </View>
              )
              }
            </View>
         
        </View>

      </View>
      
      <View style={{marginTop: spacing.SCALE_10}}>
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={{
             
            }}
            textStyle={{
              fontSize: typography.FONT_SIZE_15, 
              color: colors.COLORS.DEEP_BLUE
            }}
            translation={{
              PLACEHOLDER: "Wybierz"
            }}
          />
      </View>

      <View style={{marginTop: 10}}>
        <Button mode="contained" color={colors.COLORS.YELLOW} onPress={() => {bmrCalc(); cpmCalc();}} disabled={!emptyBtn}>
            {t('bmrScreen.calculate')}
        </Button>
      </View>
      <ScrollView>
      <View style={{flexDirection: 'row', marginTop: spacing.SCALE_10, alignItems: 'center',}}>
        
        <View style={{flex: 1, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderRadius: 5, marginRight: spacing.SCALE_3, elevation: 4}}>
        <Text style={{marginBottom: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, fontWeight: 'bold'}}>BMR</Text>
        
        <CircularProgress
            value={bmrCalc === NaN ? 0.00 : sumBMR}
            radius={60}
            maxValue={3000}
            inActiveStrokeOpacity={0.8}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            progressValueStyle={{ color: colors.COLORS.DEEP_BLUE, fontSize: typography.FONT_SIZE_20, marginBottom: -spacing.SCALE_8 }}
            activeStrokeColor={colors.BMI.BMI_3}
            inActiveStrokeColor={colors.COLORS.GREY_999}
            duration={4000}
            title={'kcal/dzień'}
            titleColor={colors.COLORS.DEEP_BLUE}
            titleStyle={{fontWeight: '300', fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}
            dashedStrokeConfig={{
                count: 40,
                width: 7,
            }}
            progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(1);
            }}
        />
         <Text style={{marginTop: spacing.SCALE_6}}>{t('bmrScreen.minimum-caloric-needs')}</Text>
        </View>

        <View style={{flex: 1, alignItems: 'center', backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_10, borderRadius: 5, marginLeft: spacing.SCALE_3, elevation: 4}}>
        <Text style={{marginBottom: spacing.SCALE_6, color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_16, fontWeight: 'bold'}}>CPM</Text>
        <CircularProgress
            value={cpmCalc === NaN ? 0.00 : sumCPM}
            radius={60}
            maxValue={4000}
            inActiveStrokeOpacity={0.8}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            progressValueStyle={{ color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_20, marginBottom: -spacing.SCALE_8 }}
            activeStrokeColor={colors.BMI.BMI_4}
            inActiveStrokeColor={colors.COLORS.GREY_999}
            duration={3000}
            title={'kcal/dzień'}
            titleColor={colors.COLORS.DEEP_BLUE}
            titleStyle={{fontWeight: '300', fontSize: typography.FONT_SIZE_12}}
            dashedStrokeConfig={{
                count: 40,
                width: 7,
            }}
            progressFormatter={(value, total) => {
                'worklet';   
                return value.toFixed(1);
            }}
        />
        <Text style={{marginTop: spacing.SCALE_6}}>{t('bmrScreen.actual-caloric-needs')}</Text>
        </View>
              
    </View>
    </ScrollView>
    </View>
    
    </ImageBackground>
    </SafeAreaProvider>
    
  )
}

export default BmrScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginHorizontal: spacing.SCALE_6,
    marginVertical: spacing.SCALE_6,
    flex: 1,
},
input: {
    borderBottomWidth: spacing.SCALE_2,
    borderBottomColor: colors.COLORS.DEEP_BLUE,
    backgroundColor: colors.COLORS.WHITE,
    paddingLeft: spacing.SCALE_10,
    elevation: 4
  },
  textBtn: {
    color: colors.TEXT.WHITE
  },
  textTitle: {
    fontSize: typography.FONT_SIZE_18,
    color: colors.TEXT.DEEP_BLUE,
    fontWeight: 'bold'

  },
  textSubtitle: {
    fontSize: typography.FONT_SIZE_12,
  }
});