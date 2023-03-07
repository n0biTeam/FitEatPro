import { StyleSheet, View, ImageBackground, StatusBar, Dimensions, Text, TouchableOpacity } from 'react-native'
import React, {useState, useEffect, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { LineChart } from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { colors, spacing, typography } from '../../styles';
import { useTranslation } from 'react-i18next';
import { UNIT } from '../../styles/units';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const WeightCharts = ({ navigation }) => {

  const {t, i18n} = useTranslation();
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [seven, setSeven] = useState(7);

    const changeNumber = () => {
        setSeven(7);
    }

    const changeNumber2 = () => {
      setSeven(30);
    }
      const [userData, setUserData] = useState('');
      const [dataCharts, setDataCharts] = useState([0]);
      const [dataCharts2, setDataCharts2] = useState([0]);
      const [dataChartsLB, setDataChartsLB] = useState([0]);
      const [dataChartsLB2, setDataChartsLB2] = useState([0]);

      // const [dataChartsST, setDataChartsST] = useState([0]);
      // const [dataChartsST2, setDataChartsST2] = useState([0]);
      const [dataDate, setDataDate] = useState([0]);
      const [dataDate30, setDataDate30] = useState([0]);

      const getUser = async () => {
        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('profile')
        .doc('profil')
        .get()
        .then(( doc ) => {
          if( doc.exists ) {
            //console.log('User Data: ', documentSnapshot.data());
            setUserData(doc.data());
          }
        })
      }

      const getCharts = () => {
        firestore().collection('users').doc(user.uid).collection('weightLog')
          .orderBy('createdAt', 'desc')
          .limit(seven)
          .onSnapshot(
             querySnapshot => {
              const dataCharts = [];
              const dataCharts2 = [];
              const dataDate = [];
              const dataDate2 = [];
              const dataChartsLB = [];
              const dataChartsLB2 = [];

              // const dataChartsST = [];
              // const dataChartsST2 = [];

                querySnapshot.forEach(doc => {
                 if( doc.exists ) {
                //console.log('User data: ', doc.data());
                  dataCharts.push(doc.data().currentWeight);
                  dataCharts2.push(doc.data().targetWeight); 

                  dataChartsLB.push(doc.data().currentWeightLB); 
                  dataChartsLB2.push(doc.data().targetWeightLB); 
    
                  // dataChartsST.push(doc.data().currentWeightST); 
                  // dataChartsST2.push(doc.data().targetWeightST); 
                  
                  const year = format((doc.data().createdAt).toDate(), 'yyyy');
                  const month = format((doc.data().createdAt).toDate(), 'MM');
                  const month2 = format((doc.data().createdAt).toDate(), 'MM', {locale: pl});
                  const day = format((doc.data().createdAt).toDate(), 'dd');
                  //const fullDate = day + '/' + month + '/'+ year;
                  const fullDate = day + '/' + month;
                  const monthDate = month2 + '/' + year;
                  //const fullDate = day;
                  //const monthDate = month2;
                  dataDate.push(fullDate);
                  dataDate2.push(monthDate);

                  

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

                  // waga ST
                  // const arrayDataST = dataChartsST;
                  // arrayDataST.reverse();
                  // setDataChartsST(arrayDataST);

                  // cel KG
                  const arrayData2 = dataCharts2;
                  arrayData2.reverse();
                  setDataCharts2(arrayData2);

                  // cel LB
                  const arrayDataLB2 = dataChartsLB2;
                  arrayDataLB2.reverse();
                  setDataChartsLB2(arrayDataLB2);

                  //cel ST
                  // const arrayDataST2 = dataChartsST2;
                  // arrayDataST2.reverse();
                  // setDataChartsST2(arrayDataST2);

                  const arrayDate = dataDate;
                  arrayDate.reverse();
                  setDataDate(arrayDate);

                  const arrayDate2 = dataDate2;
                  arrayDate2.reverse();
                 
                  const result = arrayDate2.filter((item, index, arrayDate2) => arrayDate2.indexOf(item) === index);
                  setDataDate30(result);

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

      //console.log(_chartWeight())

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

      useEffect(() => {
      
        getUser();
        getCharts();
        const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
        return unsubscribe;
      }, [navigation, loading, seven]);


        let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 });

      const charts = (dataCharts, dataCharts2, dataDate, dataDate30) => {
        //console.log(dataCharts);
        if (dataCharts.length === 0) {
          return (
            <View style={{elevation: 5}}>
        <LineChart

    data={{
      //labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [0],
          strokeWidth: 1,
          color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
        },
       
      ]
    }}
    width={isTablet ? Dimensions.get("window").width-24 : Dimensions.get("window").width-12} // from react-native
    height={isTablet ? 420 : 220}
    yAxisLabel=""
    yAxisSuffix={' ' + userData.weightUnit}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: colors.COLORS.BLACK,
          backgroundGradientFrom: colors.COLORS.WHITE,
          backgroundGradientTo: colors.COLORS.WHITE,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 5
      },
      propsForDots: {
        r: "0",
        strokeWidth: "0",
        stroke: colors.COLORS.YELLOW
      }
    }}
    bezier
    style={{
      borderRadius: 5
    }}

    
      />
      </View>
          );}
          else{
            if(seven === 7){
              return (
                <LineChart
                data={{
                  labels: dataDate,
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
                  width={isTablet ? Dimensions.get("window").width-24 : Dimensions.get("window").width-12} // from react-native
                  height={isTablet ? 400 : 200}
                  yAxisLabel=""
                  yAxisSuffix={' ' + userData.weightUnit}
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: colors.COLORS.BLACK,
                    backgroundGradientFrom: colors.COLORS.WHITE,
                    backgroundGradientTo: colors.COLORS.WHITE,
                    decimalPlaces: 1, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 5
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: colors.COLORS.DEEP_BLUE
                    }
                  }}
                  bezier
                  style={{
                    borderRadius: 5
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
              )
    
            }else{
              return (
                <LineChart
                data={{
                  labels: dataDate30,
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
                  width={ isTablet ? Dimensions.get("window").width-50 : Dimensions.get("window").width-12} // from react-native
                  height={isTablet ? 400 : 200}
                  yAxisLabel=""
                  yAxisSuffix={' ' + userData.weightUnit}
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: colors.COLORS.BLACK,
                    backgroundGradientFrom: colors.COLORS.WHITE,
                    backgroundGradientTo: colors.COLORS.WHITE,
                    decimalPlaces: 1, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 5
                    },
                    propsForDots: {
                      r: "2",
                      strokeWidth: "1",
                      stroke: colors.COLORS.DEEP_BLUE
                    }
                  }}
                  bezier
                  style={{
                    borderRadius: 5
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
              )
    
            }
          }

      }

  
  const _goBack = () => navigation.navigate('WeightLogScreen');
  
  const imageBG = require('../../assets/images/waga1.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('weightChartScreen.weight-measurement-chart')} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
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
        height: Dimensions.get('window').height,
        //width: Dimensions.get('window').width,
         height: 126,
      }}
      imageStyle={{
        //opacity: 0.8
      }}
      >
        <View style={styles.rootContainer}>
          {/* { dataCharts.length > 0 && */}
          <View style={{elevation: 5}}>
      
            {charts(dataCharts, dataCharts2, dataDate, dataDate30)}
             
          </View>
          {/* } */}

      {/* { dataCharts.length >= 2 && */}
              
              <View style={{flexDirection: 'row'}}>
                <View style={{ flex:1, marginRight: spacing.SCALE_3}}>
                    <TouchableOpacity onPress={changeNumber} style={styles.btn}>
                      <Text style={styles.textBtn}>{t('glucoseChartScreen.7-measurements')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex:1,  marginLeft: spacing.SCALE_3}}>
                  <TouchableOpacity onPress={changeNumber2} style={styles.btn}>
                      <Text style={styles.textBtn}>{t('glucoseChartScreen.30-measurements')}</Text>
                    </TouchableOpacity>
                </View>
              </View>
              
           {/* } */}
        </View>

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
   
  )
}

export default WeightCharts;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginHorizontal: spacing.SCALE_6
  },
  btn: {
    backgroundColor: colors.COLORS.DEEP_BLUE,
    marginTop: spacing.SCALE_6,
    padding: spacing.SCALE_8,
    alignItems: 'center',
    borderRadius: spacing.SCALE_5
  },
  textBtn: {
    color: colors.COLORS.WHITE,
    fontSize: typography.FONT_SIZE_14
  }
})