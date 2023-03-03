import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StatusBar, ImageBackground, Dimensions, TouchableOpacity, StyleSheet, BackHandler, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { Avatar, Banner, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CircularProgress from 'react-native-circular-progress-indicator';
import { LineChart } from "react-native-chart-kit";
import { format } from 'date-fns';
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../../styles';
import { useNetInfo} from '@react-native-community/netinfo';
import { UNIT } from '../../styles/units';
import Purchases from 'react-native-purchases';
import { ENTITLEMENT_ID } from '../../styles/constants';
import {
  fontScale,
  scale,
  deviceInch,
  hasNotch,
  isAndroid,
  isIOS,
  isSmallDevice,
  isTablet,
  width,
  height,
} from 'react-native-utils-scale';

const heightScreen = Dimensions.get('window').height;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const HomeScreen = ({ navigation }) => {

  const {t, i18n} = useTranslation();
  const netInfo = useNetInfo();
  
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState('');
  const [image, setImage] = useState('https://primacgurus.org.au/wp-content/uploads/2021/01/No-Profile-image.jpg');
  const [loading, setLoading] = useState(true);
  //const refRBSheet = useRef();
  //const [isOpen, setIsOpen] = useState(true);
  //const heightModal = (Dimensions.get('window').height/3);
  //const [newTarget, setNewTarget] = useState(0);
 
  const [dataCharts, setDataCharts] = useState([0]);
  const [dataCharts2, setDataCharts2] = useState([0]);
  const [dataDate7, setDataDate7] = useState([]);
  
  const [dataChartsLB, setDataChartsLB] = useState([0]);
  const [dataChartsLB2, setDataChartsLB2] = useState([0]);
   
  const [weight, setWeight] = useState(0);
  const [targetWeight, setTargetWeight] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false); //button
    const toggleLoading = () => {
      setIsLoading(!isLoading);
    };


    const [userPro, setUserPro] = useState(false);

    const [userId, setUserId] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const [activated, setActivated] = useState([]);
      useEffect(() => {
       
       const identyfikator = async () => {
        
         try {
           const customerInfo = await Purchases.getCustomerInfo();
           setActivated(customerInfo.activeSubscriptions)
   
         } catch (e) {
          // Error fetching customer info
         }
        
       }
       identyfikator();
     },[]);

  // get the latest details about the user (is anonymous, user id, has active subscription)
  const getUserDetails = async () => {
    //setIsAnonymous(await Purchases.isAnonymous());
    setUserId(await Purchases.getAppUserID());

    const customerInfo = await Purchases.getCustomerInfo();
    setActivated(customerInfo.activeSubscriptions);
    setSubscriptionActive(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined');
    if(activated.indexOf('fp_0599_rek') <= 0 ){
      setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
    }else{
      setUserPro(false);
    }
  };

  
  useEffect(() => {
    // Get user details when component first mounts
    getUserDetails();
  }, []);

  useEffect(() => {
    // Subscribe to purchaser updates
    Purchases.addCustomerInfoUpdateListener(getUserDetails);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(getUserDetails);
    };
  });
    

    
      // const glycemicIndexRoute = async () => {
        
      //   try {
      //     // access latest customerInfo
      //     const customerInfo = await Purchases.getCustomerInfo();
    
      //     if(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
           
      //       console.log('User is Pro')
      //       navigation.navigate('GlycemicIndex');
      //       //setUserPro(true);
      //       setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
            
      //     } else {
      //       navigation.navigate('GlycemicIndexNoPay');
      //       console.log('User is not Pro')
      //       //setUserPro(false);
      //       setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
            
      //     }
      //   } catch (e) {
      //     Alert.alert('Error fetching customer info', e.message);
      //   }
      // };
      

      const glycemicIndexRoute = async () => {
        try {
        const customerInfo = await Purchases.getCustomerInfo();
        
        //sprawdzamy czy sa aktywacje 
        if(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {

          //sprawdzamy czy to reklama
          if(activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1 ){
            navigation.navigate('GlycemicIndexNoPay');
            setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
          }else{
            navigation.navigate('GlycemicIndex');
            setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
          }

        }
        //brak aktywacji - blokada menu
        else{
          navigation.navigate('GlycemicIndexNoPay');
          setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
        }
      } catch (e) {
             Alert.alert('Error fetching customer info', e.message);
           }
      }

  
      
      // console.log(userPro)
      // console.log(activated)
      // console.log(activated.indexOf('fp_0599_rek'))
      // console.log(activated.length)
    
      // const purineRoute = async () => {
        
      //   try {
      //     // access latest customerInfo
      //     const customerInfo = await Purchases.getCustomerInfo();
    
      //     if(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
           
      //       console.log('User is Pro')
      //       navigation.navigate('PurineAddScreen');
      //       //setUserPro(true);
      //       setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
           
      //     } else {
      //       navigation.navigate('PurineListScreenNoPay');
      //       console.log('User is not Pro')
      //       //setUserPro(false);
      //       setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
            
      //     }
      //   } catch (e) {
      //     Alert.alert('Error fetching customer info', e.message);
      //   }
      // };

      const purineRoute = async () => {
        try {
        const customerInfo = await Purchases.getCustomerInfo();
        
        //sprawdzamy czy sa aktywacje 
        if(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {

          //sprawdzamy czy to reklama
          if(activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1 ){
            navigation.navigate('PurineListScreenNoPay');
            setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
          }else{
            navigation.navigate('PurineListScreen');
            setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
          }

        }
        //brak aktywacji - blokada menu
        else{
          navigation.navigate('PurineListScreenNoPay');
          setUserPro(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined");
        }
      } catch (e) {
             Alert.alert('Error fetching customer info', e.message);
         }
      }
    
      

    //console.log(userPro)

    useEffect(() => {
      const backAction = () => {
        Alert.alert(t('exitApp.title'), t('exitApp.subTitle'), [
          {
            text: t('exitApp.cancel'),
            onPress: () => null,
            style: 'cancel',
          },
          {text: t('exitApp.yes'), onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };
  
      // BackHandler.addEventListener("hardwareBackPress", backAction);

      // return () =>
      //   BackHandler.removeEventListener("hardwareBackPress", backAction);
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
  
      return () => backHandler.remove();
    }, []);


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
        setWeight(doc.data().weightName);
        setTargetWeight(doc.data().targetWeight);
      }
    })
  }

  const getCharts = () => {
    firestore().collection('users').doc(user.uid).collection('weightLog')
      .orderBy('createdAt', 'desc')
      .limit(7)
      .onSnapshot(
         querySnapshot => {
          const dataCharts = [];
          const dataCharts2 = [];

          const dataChartsLB = [];
          const dataChartsLB2 = [];

          const dataDate7 = [];
            querySnapshot.forEach(doc => {
            if( doc.exists ) {
          
              dataCharts.push(doc.data().currentWeight); 
              dataCharts2.push(doc.data().targetWeight); 

              dataChartsLB.push(doc.data().currentWeightLB); 
              dataChartsLB2.push(doc.data().targetWeightLB); 

              //const year = format((doc.data().createdAt).toDate(), 'yyyy');
              const month = format((doc.data().createdAt).toDate(), 'MM');
              const day = format((doc.data().createdAt).toDate(), 'dd');
              //const fullDate = day + '/' + month + '/'+ year;
              const fullDate = day + '/' + month;
              dataDate7.push(fullDate);

            }
             
               
            });

                     
           
            // waga KG
            const arrayData = dataCharts;
            arrayData.reverse();
            setDataCharts(arrayData);
             
            // waga LB
            const arrayDataLB = dataChartsLB;
            arrayDataLB.reverse();
            setDataChartsLB(arrayDataLB);

            // cel KG
            const arrayData2 = dataCharts2;
            arrayData2.reverse();
            setDataCharts2(arrayData2);

            // cel LB
            const arrayDataLB2 = dataChartsLB2;
            arrayDataLB2.reverse();
            setDataChartsLB2(arrayDataLB2);

            const arrayDate = dataDate7;
            arrayDate.reverse();
            setDataDate7(arrayDate);
              
            },
              error => {
               console.log(error)
            }
        
      )
  };

 
const _chartWeight = () => {
  try{
  if(userData.weightUnit === UNIT.KG){
      const chart = dataCharts;
      return chart;
  }else{
      const chart = dataChartsLB
      return chart;
  }
}catch(e){
  console.log(e);
}
}

const _chartWeight2 = () => {
  try{
  if(userData.weightUnit === UNIT.KG){
      const chart = dataCharts2;
      return chart;
  }else{
      const chart = dataChartsLB2
      return chart;
  }
}catch(e){
  console.log(e);
}
}

const _differenceWeight = () => {
  try{
    if(userData.weightUnit === UNIT.KG){
       return userData.difference;
    }else{
        return userData.differenceLB;
    }
  }catch(e){
    console.log(e);
  }
}
 
  useEffect(() => {
    
    getUser();
    getCharts();
    navigation.addListener("focus", () => setLoading(!loading));
    
  }, [navigation, loading, weight, userPro]);

  const _getWeightUnit = () => {
    try{
        if(userData.weightUnit === UNIT.KG){
            return Number(userData.weightName);
        }else{
            return Number(userData.weightNameLB)
        }
      }catch(e){
      console.log(e);
    }
  }


  const _getTargetUnit = () => {
    if(userData.weightUnit === UNIT.KG){
        return Number(userData.targetWeight)
    }else{
        return Number(userData.targetWeightLB);
    }
  }


  let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 });

   
  const charts = (dataCharts,dataDate7) => {
   
    if (dataCharts.length === 0) {
      return (
        <View style={{elevation: 5}}>
        <LineChart

    data={{
      datasets: [
        {
          data: [0],
          strokeWidth: 1,
          color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
        },
       
      ]
    }}
    width = {isTablet ? Dimensions.get("window").width-24 : Dimensions.get("window").width-12} // from react-native
    
    height={fontScale(210)}
    yAxisLabel=""
    yAxisSuffix={' ' + userData.weightUnit}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: colors.COLORS.BLACK,
          backgroundGradientFrom: colors.COLORS.DEEP_BLUE,
          backgroundGradientTo: colors.COLORS.LIGHT_BLUE,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: spacing.SCALE_10,
      },
      propsForDots: {
        r: "0",
        strokeWidth: "0",
        stroke: colors.COLORS.YELLOW
      }
    }}
    bezier
    style={{
      marginBottom: spacing.SCALE_6,
      borderRadius: spacing.SCALE_10,
      elevation: 4
    }}

    
      />
      </View>
    );
        
  }
      else if(dataCharts?.length === 1) {
          return (
            <View style={{elevation: 5}}>
              <LineChart

                data={{
                  labels: dataDate7,
                  datasets: [
                    {
                      data: _chartWeight2(),
                      strokeWidth: 3,
                      color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
                    },
                    {
                      data: _chartWeight(),
                      strokeWidth: 3,
                      color: (opacity = 1) => `rgba(0,255,0,${opacity})`,
                    }
                  ],
                  legend: [t('homescreen-current-weight'), t('homescreen-designated-target')]
                }}
                        width={isTablet ? Dimensions.get("window").width-24 : Dimensions.get("window").width-12} // from react-native
                        height={scale(190)}
                        yAxisLabel=""
                        yAxisSuffix={' ' + userData.weightUnit}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: colors.COLORS.BLACK,
                            backgroundGradientFrom: colors.COLORS.DEEP_BLUE,
                            backgroundGradientTo: colors.COLORS.LIGHT_BLUE,
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                              borderRadius: 16
                            },
                            propsForDots: {
                              r: "2",
                              strokeWidth: "2",
                              stroke: colors.COLORS.YELLOW
                            },
                            propsForLabels:{
                              fontSize: fontScale(typography.FONT_SIZE_11)
                            }
                          }}
                        bezier
                        style={{
                            marginBottom: spacing.SCALE_6,
                            borderRadius: spacing.SCALE_10,
                            elevation: 4
                          }}
                   />

            </View>
      )
    }else{
      return (
        <View style={{elevation: 5}}>
        <LineChart
        data={{
          labels: dataDate7,
          //labels: ["06/02", "06/02", "06/02", "06/02", "06/02", "06/02", "07/02"],
          datasets: [
            { data: _chartWeight(),
             strokeWidth: 3,
            color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
            }, // optional },
            { data: _chartWeight2(),
              strokeWidth: 3,
              color: (opacity = 1) => `rgba(0,255,0,${opacity})`,
            },
          ],
         legend: [t('homescreen-current-weight'), t('homescreen-designated-target')]
        }}
        width={isTablet ? Dimensions.get("window").width-24 : Dimensions.get("window").width-12}
        height={scale(190)}
        yAxisLabel=""
        yAxisSuffix={' ' + userData.weightUnit}
        yAxisInterval={1} // optional, defaults to 1
        //fromZero={true}
        //verticalLabelRotation={-30}
        withInnerLines={true}
        //withVerticalLabels={false}
        chartConfig={{
          backgroundColor: colors.COLORS.BLACK,
          backgroundGradientFrom: colors.COLORS.DEEP_BLUE,
          backgroundGradientTo: colors.COLORS.LIGHT_BLUE,
          decimalPlaces: 1, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "3",
            strokeWidth: "3",
            stroke: colors.COLORS.YELLOW
          },
          propsForLabels:{
            fontSize: fontScale(typography.FONT_SIZE_11)
          }
        }}
        bezier
        style={{
          marginBottom: spacing.SCALE_6,
          borderRadius: spacing.SCALE_10
        }}

        decorator={() => {
          return tooltipPos.visible ? <View>
              <Svg>
                  <Rect x={tooltipPos.x - 20} 
                      y={tooltipPos.y + 13} 
                      width="50" 
                      height="24"
                      fill={colors.COLORS.DEEP_BLUE} />
                      <TextSVG
                          x={tooltipPos.x + 5}
                          y={tooltipPos.y + 30}
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle">
                          {(tooltipPos.value).toFixed(2)}
                      </TextSVG>
              </Svg>
          </View> : null
      }}

      onDataPointClick={(data) => {

        let isSamePoint = (tooltipPos.x === data.x 
                            && tooltipPos.y === data.y)

        isSamePoint ? setTooltipPos((previousState) => {
            return { 
                      ...previousState,
                      value: data.value,
                      visible: !previousState.visible
                   }
        })
            : 
        setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });

    }}
          
        />
        </View>
      );
      
    }

  }

  //netInfo.configure({});

  const netConnect = () => {
    
    if(netInfo.type === 'wifi'){
        if(netInfo.isConnected === true){
        return (
          <MaterialCommunityIcons name='wifi' size={18} color={colors.COLORS.GREEN} />
        )
      }else{
        return(
        <MaterialCommunityIcons name='wifi-alert' size={18} color={colors.COLORS.RED} />
        )
      }
    }else{
      if(netInfo.isConnected === true){
        return (
          <MaterialCommunityIcons name='signal-cellular-3' size={18} color={colors.COLORS.GREEN} />
        )
      }else{
        return(
        <MaterialCommunityIcons name='signal-cellular-outline' size={18} color={colors.COLORS.RED} />
        )
      }
    }

  }



  const netInfoType = () => {
    if(netInfo.type === 'wifi'){
      return (
        <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_8, textTransform: 'uppercase', paddingRight: 1, marginTop: -3}}>wifi</Text>
      )
    }else{
      try{
        //console.log(netInfo.details);
        if(netInfo.type === 'cellular'){
          return (
            <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_8, textTransform: 'uppercase', paddingRight: 4, marginTop: -3}}>{netInfo.details.cellularGeneration}</Text>
          )
        }else{
          return (
            <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_8, textTransform: 'uppercase', paddingRight: 4, marginTop: -3}}></Text>
            )
        }
      }catch(e){
        console.log('Błąd odczytu')
      }
    }
  }

  const [visible, setVisible] = React.useState(true);
  const baseConnect = () => {
    if(netInfo.isConnected === false){
      return(
        
          <Banner
          visible={visible}
          actions={[
            {
              label: t('homescreen.banner.close'),
              onPress: () => setVisible(false),
            },
          ]}
          style={{ paddingTop: visible === true ? 30 : 0 }}
        > 
          <Text style={{color: colors.TEXT.DEEP_BLUE}}>{t('homescreen.banner.net-connect')}</Text>
        </Banner>
      
       )
    }
    }

  //const heightScreen = Dimensions.get("screen").height;
  
  const [pay, setPay] = useState(false);
    
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
    <StatusBar translucent={true} backgroundColor={colors.COLORS.DEEP_BLUE} barStyle="light-content"/>
    {baseConnect()}
    <ImageBackground 
    source={require('../../assets/images/wave2.png')}
    style={{ 
      //flex: 1, 
      //backgroundColor: 'red',
      width: Dimensions.get('window').width,
      height: !isTablet ? scale(145) : scale(280),
      //width: Dimensions.get('window').width,
       }}
    
  >

    <View style={{marginTop: StatusBar.currentHeight, paddingHorizontal: spacing.SCALE_10, flexDirection: 'row', alignContent: 'space-around', zIndex: 0 }}>
      <View style={{paddingTop: spacing.SCALE_3, justifyContent: 'center', flex: 1}}>
          <TouchableOpacity onPress={()=> {navigation.navigate('Profile')}}>
            <Avatar.Image size={spacing.SCALE_50} source={{uri: userData.userImg != null ? userData.userImg : image }} />
          </TouchableOpacity>
      </View>

      <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
          <Text style={{color: colors.TEXT.WHITE, fontSize: fontScale(typography.FONT_SIZE_10), marginBottom: spacing.SCALE_3}}>{t('homescreen-weight')}</Text>
          <CircularProgress
            value={!weight ? 0 : _getWeightUnit()}
            radius={fontScale(spacing.SCALE_22)}
            //inActiveStrokeOpacity={0.3}
            maxValue={!weight ? 0 : _getWeightUnit()}
            rotation={scale(360)}
            activeStrokeWidth={scale(5)}
            inActiveStrokeWidth={scale(5)}
            inActiveStrokeColor={colors.BMI.BMI_1}
            progressValueStyle={{ color: colors.COLORS.WHITE, fontSize: fontScale(typography.FONT_SIZE_12) }}
            activeStrokeColor={ colors.BMI.BMI_1}
            duration={0}
            dashedStrokeConfig={{
              count: scale(18),
              width: scale(3),
            }}
            progressFormatter={(value, total) => {
              'worklet';   
              return value.toFixed(1);
            }}
          />
      </View>

      <View style={{flex: 1, alignItems: 'center', alignContent: 'flex-end'}}>
        <Text></Text>
        {
          weight > targetWeight ?
          (
        <CircularProgress
            value={_getWeightUnit()-_getTargetUnit()}
            radius={spacing.SCALE_30}
            //inActiveStrokeOpacity={0.3}
            maxValue={_differenceWeight()}
            rotation={360}
            valuePrefix={'+'}
            activeStrokeWidth={5}
            inActiveStrokeWidth={5}
            //inActiveStrokeColor={ colors.BMI.BMI_2}
            inActiveStrokeColor={ colors.COLORS.DEEP_BLUE}
            progressValueStyle={{ color: colors.COLORS.WHITE, fontSize: fontScale(typography.FONT_SIZE_12) }}
            //activeStrokeColor={colors.COLORS.DEEP_BLUE}
            activeStrokeColor={colors.BMI.BMI_2}
            duration={2000}
            dashedStrokeConfig={{
              count: 25,
              width: 3,
            }}
            progressFormatter={(value, total) => {
              'worklet';   
              return value.toFixed(2);
            }}
          /> ) : (
          <View style={{flex: 1, justifyContent: 'center', }}>
            <TouchableOpacity 
              style={{alignItems: 'center', borderWidth: 1, borderColor: colors.BMI.BMI_2, backgroundColor: colors.BMI.BMI_2, borderRadius: scale(30), height: scale(60), width: scale(60), justifyContent: 'center'}}
              onPress={() => {
                navigation.navigate('EditProfile');
            }}
            >
              <View style={{alignItems: 'center', alignContent: 'center', alignSelf: 'center', justifyContent: 'center'}}>
              <Text style={{color: colors.TEXT.WHITE, fontSize: fontScale(typography.FONT_SIZE_8)}}>{t('homescreen-new-target')}</Text>
              </View>
              <MaterialIcons name='edit' size={spacing.SCALE_14} color={colors.COLORS.WHITE}/>
            </TouchableOpacity>
            </View>
          )
        }
      </View>

      <View style={{flex: 1, alignItems: 'center', marginTop: spacing.SCALE_10}}>
          <Text style={{color: colors.TEXT.WHITE, fontSize: fontScale(typography.FONT_SIZE_10), marginBottom: spacing.SCALE_3}}>{t('homescreen-target')}</Text>
          <CircularProgress
            value={!targetWeight ? 0 : _getTargetUnit()}
            radius={scale(spacing.SCALE_22)}
            //inActiveStrokeOpacity={0.3}
            maxValue={!targetWeight ? 0 : _getTargetUnit()}
            rotation={scale(360)}
            activeStrokeWidth={scale(5)}
            inActiveStrokeWidth={scale(5)}
            inActiveStrokeColor={colors.BMI.BMI_3}
            progressValueStyle={{ color: colors.COLORS.WHITE, fontSize: fontScale(typography.FONT_SIZE_12) }}
            activeStrokeColor={ colors.BMI.BMI_3}
            duration={0}
            dashedStrokeConfig={{
              count: scale(18),
              width: scale(3),
            }}
            progressFormatter={(value, total) => {
              'worklet';   
              return value.toFixed(1);
            }}
          />
      </View>

      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
        
            <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={logout} style={{paddingLeft: spacing.SCALE_8, paddingRight: spacing.SCALE_106, marginTop: spacing.SCALE_105}}>
              <MaterialCommunityIcons name='logout' size={spacing.SCALE_25} color={colors.COLORS.WHITE} />
            </TouchableOpacity>
            </View>
      </View>
    </View>

    <View style={{flex: 1, marginRight: scale(spacing.SCALE_10), justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: scale(-spacing.SCALE_30)}}>
      {netConnect()}
      {netInfoType()}
    </View>
    </ImageBackground>
    
    { !isSmallDevice &&
      <View style={{marginHorizontal: spacing.SCALE_6, marginBottom: spacing.SCALE_3}}>
    
        <View>
          
            <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: fontScale(typography.FONT_SIZE_11), textTransform: 'uppercase'}}>{t('homescreen-body-weight-chart')}</Text>
          
          
        </View>

        {
        charts(dataCharts, dataDate7)
        }  
      </View>
    }

    <View style={{flex: 1, justifyContent: 'space-around', marginBottom: spacing.SCALE_10}}>
      <View style={[styles.menuContainer, {marginTop: !isSmallDevice ? 0 : scale(spacing.SCALE_20)}]}>
        
          <TouchableOpacity style={styles.menuBtn} onPress={glycemicIndexRoute} >
            <View style={styles.boxContainer}>
              <MaterialCommunityIcons name='food-outline' size={spacing.SCALE_35} color={colors.COLORS.DEEP_BLUE} />
               <Text style={styles.menuBtnText}>{t('homescreen-menu-glycemic-index')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuBtn} onPress={() => {navigation.navigate('WeightTabs')}} disabled={!userPro || (activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1)}>
            <View style={styles.boxContainer}>
              <MaterialCommunityIcons name='scale-bathroom' size={spacing.SCALE_35} color={userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE ) } />
             <Text style={[styles.menuBtnText, {color: userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE )}]}>{t('homescreen-menu-weight')}</Text>
            </View>

           
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuBtn} onPress={() => {navigation.navigate('TopTabs')}}>
            <View style={styles.boxContainer}>
              <MaterialCommunityIcons name='human' size={spacing.SCALE_35} color={colors.COLORS.DEEP_BLUE} />
              <Text style={styles.menuBtnText}>{t('homescreen-menu-bmi')}</Text>
            </View>
            
          </TouchableOpacity>

      </View>

      <View style={[styles.menuContainer, {marginTop: spacing.SCALE_10}]}>
       
       <TouchableOpacity style={styles.menuBtn} onPress={() => {navigation.navigate('BloodPressureTabs')}} disabled={!userPro || (activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1)}>
         <View style={styles.boxContainer}>
           <MaterialCommunityIcons name='heart-pulse' size={spacing.SCALE_35} color={userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE ) } />
           <Text style={[styles.menuBtnText, {color: userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE )}]}>{t('homescreen-menu-blood-pressure')}</Text>
         </View>
         
       </TouchableOpacity>

       <TouchableOpacity style={styles.menuBtn} onPress={() => {navigation.navigate('GlucoseTabs')}} disabled={!userPro || (activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1)}>
         <View style={styles.boxContainer}>
           <MaterialCommunityIcons name='water-check' size={spacing.SCALE_35} color={userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE ) } />
           <Text style={[styles.menuBtnText, {color: userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE )}]}>{t('homescreen-menu-glucose')}</Text>
         </View>
         
       </TouchableOpacity>

       <TouchableOpacity style={styles.menuBtn} onPress={() => {navigation.navigate('TopTabs2')}}>
         <View style={styles.boxContainer}>
           <MaterialCommunityIcons name='clipboard-edit-outline' size={spacing.SCALE_35} color={colors.COLORS.DEEP_BLUE } />
           <Text style={styles.menuBtnText}>{t('homescreen-memu-insulin-resistance')}</Text>
         </View>
        
       </TouchableOpacity>
       
     </View>

     <View style={[styles.menuContainer, {marginTop: spacing.SCALE_10}]}>

       <TouchableOpacity style={styles.menuBtn} onPress={purineRoute} >
          <View style={styles.boxContainer}>
          <MaterialCommunityIcons name='molecule' size={spacing.SCALE_35} color={colors.COLORS.DEEP_BLUE } />
          <Text style={styles.menuBtnText}>{t('homescreen-menu-purine')}</Text>
          </View>
          
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuBtn} onPress={() => {navigation.navigate('FindingScreen')}} disabled={!userPro || (activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1)}>
          <View style={styles.boxContainer}>
            <MaterialCommunityIcons name='archive' size={spacing.SCALE_35} color={userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE ) } />
            <Text style={[styles.menuBtnText, {color: userPro === false ? colors.COLORS.GREY_CCC : ((activated.indexOf('fp_0599_rek') >= 0 && activated.length <= 1) ? colors.COLORS.GREY_CCC : colors.COLORS.DEEP_BLUE )}]}>{t('homescreen-menu-findings')}</Text>
          </View>
          
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuBtn} onPress={() => {navigation.navigate('NotesScreen')}}>
          <View style={styles.boxContainer}>
            <MaterialIcons name='notes' size={spacing.SCALE_35} color={colors.COLORS.DEEP_BLUE } />
            <Text style={styles.menuBtnText}>{t('homescreen-menu-notes')}</Text>
          </View>
          
        </TouchableOpacity>
      </View>

    </View>
      
   
   
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({ 
  menuContainer: {
    flexDirection: 'row',
    //width: '95%',
    alignSelf: 'center',
    //marginBottom: spacing.SCALE_3,
    flex: 1,
    
  },
  boxContainer:{
    borderWidth: 1,
    borderColor: colors.COLORS.GREY_AAA,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    //width: 100,
    //height: Dimensions.get("window").height > 600 ? Dimensions.get('window').width/6 : 80,
    //height: Dimensions.get("window").height > 600 ? (heightScreen-530)/3 : 80,
    height: '100%',
    backgroundColor: colors.COLORS.WHITE,
    borderRadius: spacing.SCALE_10,
    width: Dimensions.get('window').width/3 - 12     
  },
  boxText: {
    padding: spacing.SCALE_10,
    color: colors.TEXT.WHITE,
  },
  menuBtn: {
    //flex: 1,
    //width: '30%',
    marginHorizontal: spacing.SCALE_6,
    alignSelf: 'center',

  },
  menuBtnText: {
    alignSelf: 'center',
    marginTop: spacing.SCALE_5,
    color: colors.TEXT.DEEP_BLUE,
    fontSize: fontScale(typography.FONT_SIZE_10),
    textTransform: 'uppercase'
  },
  text: {
    fontSize: 8,
    fontWeight: 'bold',
  },
});