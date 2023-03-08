import { StyleSheet, View, ImageBackground, StatusBar, Dimensions, TouchableOpacity, Text } from 'react-native'
import React, {useState, useEffect, useContext, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, Button } from 'react-native-paper';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { LineChart } from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

const GlucoseChartScreen = ({ route, navigation }) => {

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

      const [dataCharts, setDataCharts] = useState([0]);
      const [dataDate, setDataDate] = useState([0]);
      const [dataDate30, setDataDate30] = useState([0]);

      const getCharts = () => {
        firestore().collection('users').doc(user.uid).collection('glucoseDiary')
          .orderBy('createdAt', 'desc')
          .limit(seven)
          .onSnapshot(
             querySnapshot => {
              const dataCharts = [];
              const dataDate = [];
              const dataDate2 = [];
                querySnapshot.forEach(doc => {
                 if( doc.exists ) {
                  dataCharts.push(doc.data().glucoseMg);
 
                  const year = format((doc.data().createdAt).toDate(), 'yyyy');
                  const month = format((doc.data().createdAt).toDate(), 'MM');
                  const month2 = format((doc.data().createdAt).toDate(), 'MM', {locale: pl});
                  const day = format((doc.data().createdAt).toDate(), 'dd');
                  
                  const fullDate = day + '/' + month;
                  const monthDate = month2 + '/' + year;
                
                  dataDate.push(fullDate);
                  dataDate2.push(monthDate);

                 }
                });
                  const arrayData = dataCharts;
                  arrayData.reverse();
                  setDataCharts(arrayData);

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

      useEffect(() => {
      
       
        getCharts();
        const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
        return unsubscribe;
      }, [navigation, loading, seven]);


        let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 });

      const charts = (dataCharts, dataDate, dataDate30) => {
        if (dataCharts?.length === 0) {
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
    width={Dimensions.get("window").width-12} // from react-native
    height={240}
    yAxisLabel=""
    yAxisSuffix=" mmHg"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: colors.COLORS.BLACK,
      backgroundGradientFrom: colors.COLORS.WHITE,
      backgroundGradientTo: colors.COLORS.WHITE,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: spacing.SCALE_10
      },
      propsForDots: {
        r: "0",
        strokeWidth: "0",
        stroke: colors.COLORS.YELLOW
      }
    }}
    bezier
    style={{
      //marginVertical: spacing.SCALE_8,
      borderRadius: 10
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
                    { data: dataCharts, 
                      strokeWidth: 3,
                      color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
                    }, // optional },
                  ],
                  legend: [t('glucoseChartScreen.title-chart')]
                }}
                  width={Dimensions.get("window").width-12} // from react-native
                  height={240}
                  yAxisLabel=""
                  yAxisSuffix=""
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
                      strokeWidth: "1",
                      stroke: colors.COLORS.BLACK
                    }
                  }}
                  bezier
                  style={{
                    //marginVertical: spacing.SCALE_6,
                    borderRadius: 5
                  }}
    
                  decorator={() => {
                    return tooltipPos.visible ? <View>
                        <Svg>
                            <Rect x={tooltipPos.x - 14} 
                                y={tooltipPos.y + 13} 
                                width="80" 
                                height="24"
                                fill={colors.COLORS.DEEP_BLUE} />
                                <TextSVG
                                    x={tooltipPos.x + 25}
                                    y={tooltipPos.y + 30}
                                    fill="white"
                                    fontSize={typography.FONT_SIZE_14}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {tooltipPos.value + ' mg/dL'}
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
                    { data: dataCharts, 
                      strokeWidth: 3,
                      color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
                    }, // optional },
                  ],
                  legend: [t('glucoseChartScreen.title-chart')]
                }}
                  width={Dimensions.get("window").width-12} // from react-native
                  height={240}
                  yAxisLabel=""
                  yAxisSuffix=""
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
                    //marginVertical: spacing.SCALE_6,
                    borderRadius: 5
                  }}
    
                  decorator={() => {
                    return tooltipPos.visible ? <View>
                        <Svg>
                        <Rect x={tooltipPos.x - 14} 
                                y={tooltipPos.y + 13} 
                                width="80" 
                                height="24"
                                fill={colors.COLORS.DEEP_BLUE} />
                                <TextSVG
                                    x={tooltipPos.x + 25}
                                    y={tooltipPos.y + 30}
                                    fill="white"
                                    fontSize={typography.FONT_SIZE_14}
                                    fontWeight="bold"
                                    textAnchor="middle">
                                    {tooltipPos.value + ' mg/dL'}
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

  
  const _goBack = () => navigation.navigate('GlucoseDiaryScreen');

  const imageBG = require('../../assets/images/glukometr4.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('glucoseChartScreen.title')} />
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
        opacity: 0.2
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
          { dataCharts.length > 0 &&
          <View style={{marginBottom: -2, elevation: 5}}>
      
            {charts(dataCharts, dataDate, dataDate30)}
             
          </View>
          }

      { dataCharts.length >= 2 &&
              
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
              
          }
        </View>

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
   
  )
}

export default GlucoseChartScreen;

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