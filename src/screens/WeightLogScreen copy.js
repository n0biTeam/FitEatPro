import { StyleSheet, Text, View, TouchableOpacity, Animated, ImageBackground, StatusBar, Dimensions, ToastAndroid, Image } from 'react-native'
import React, {useState, useEffect, useContext, useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedFAB, DefaultTheme, Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { COLORS, TEXT, BMI, BAI } from '../styles/colors';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import RBSheet from "react-native-raw-bottom-sheet";
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { LineChart } from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { ScrollView } from 'react-native-gesture-handler';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#ffc107',
    },
  };

const WeightLogScreen = ({ route,
    navigation,
    animatedValue,
    visible,
    extended,
    label,
    animateFrom,
    style,
    iconMode }) => {
  
  const _goBack = () => navigation.navigate('HomeScreen');

  const [isExtended, setIsExtended] = React.useState(true);

    const isIOS = Platform.OS === 'ios';
  
    const onScroll = ({ nativeEvent }) => {
      const currentScrollPosition =
        Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
      setIsExtended(currentScrollPosition <= 0);
    };

    const fabStyle = { [animateFrom]: 16 };

    const {user} = useContext(AuthContext);
    const [userData, setUserData] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [currentWeight, setCurrentWeight] = useState(0);
    const [age, setAge] = useState(0);
    const [weight, setWeight] = useState(0);
    const [loading, setLoading] = useState(true);

    const [dataWeight, setDataWeight] = useState([]);
    const [targetWeight, setTargetWeight] = useState(0);
   // const [sum, setSum] = useState(0);

    const refRBSheet = useRef();
    const [isOpen, setIsOpen] = useState(true);
    const heightModal = (Dimensions.get('window').height/2);

    const [wagBmi, setWagBmi] = useState(0);
    const [wagDate, setWagDate] = useState(new Date());
    const [wagWeight, setWagWeight] = useState(0);
    //const [wagFat, setWagFat] = useState(0);
    const [wagLBM, setWagLBM] = useState(0);
    const [hipGirth, setHipGirth] = useState(0);
    const [wagBai, setWagBai] = useState(0);
    const [weightDifference2, setWeightDifference2] = useState(0);
    //const [differenceDifference, setDifferenceDifference] = useState(0);

    const [roznica, setRoznica] = useState(0);   
    

    //const [sumBai, setSumBai] = useState(0);
    
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
            //console.log(doc.data().weightName);
            //console.log(doc.data().heightName);
            setUserData(doc.data());
            const dateB = new Date(doc.data().birthday.seconds * 1000);
            setAge(new Date().getFullYear() - dateB.getFullYear());
            setWeight(doc.data().weightName);
            //setSum(doc.data().weightName - doc.data().targetWeight);
            setTargetWeight(doc.data().targetWeight);
            setRoznica(doc.data().weightName - doc.data().targetWeight);

          }
        })
      }

      const getWeight = () => {
        firestore().collection('users').doc(user.uid).collection('weightLog')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .onSnapshot(
             querySnapshot => {
              const dataWeight1 = [];
                querySnapshot.forEach(doc => {
                //console.log('User data: ', doc.data());
                 if( doc.exists ) {
                  dataWeight1.push({...doc.data(), id: doc.id}); 
                   setWagBmi(doc.data().bmi);
                   setWagWeight(doc.data().currentWeight)
                   setWagDate(doc.data().createdAt);
                   //setWagFat(doc.data().fatContent);
                   setWagLBM(doc.data().lbm);
                   setWagBai(doc.data().bai);
                   setWeightDifference2(doc.data().weightDifference);
                   //console.log(weightDifference2)
                   
                 }
                   
                   
                });
                
                    //console.log(dataTime2.toDate().toLocaleDateString('pl-PL')); 
                  // setWagDate(dataTime2);
                   setDataWeight(dataWeight1);
                  
                   //setFilteredDataSource(dataWeight);
                   //setMasterDataSource(dataWeight);
                   //console.log(diaryData);
                },
                  error => {
                   console.log(error)
                }
            
          )
      }

      const [seven, setSeven] = useState(7);

      const changeNumber =() => {
        setSeven(7);
      }

      const changeNumber2 =() => {
        setSeven(30);
      }

      //console.log(seven);
      //console.log(dataWeight);

      const [dataCharts, setDataCharts] = useState([0]);
      const [dataCharts2, setDataCharts2] = useState([0]);
      const [dataDate, setDataDate] = useState([0]);
      const [dataDate30, setDataDate30] = useState([0]);

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
                querySnapshot.forEach(doc => {
                 if( doc.exists ) {
                //console.log('User data: ', doc.data());
                  dataCharts.push(doc.data().currentWeight);
                  dataCharts2.push(doc.data().targetWeight); 
                  
                  const year = format((doc.data().createdAt).toDate(), 'yyyy');
                  const month = format((doc.data().createdAt).toDate(), 'MM');
                  const month2 = format((doc.data().createdAt).toDate(), 'MM', {locale: pl});
                  const day = format((doc.data().createdAt).toDate(), 'dd');
                  //const fullDate = day + '/' + month + '/'+ year;
                  const fullDate = day + '/' + month;
                  const monthDate = month2+ '/' + year;
                  //const fullDate = day;
                  //const monthDate = month2;
                  dataDate.push(fullDate);
                  dataDate2.push(monthDate);

                 }
                });
                  const arrayData = dataCharts;
                  arrayData.reverse();
                  setDataCharts(arrayData);

                  const arrayData2 = dataCharts2;
                  arrayData2.reverse();
                  setDataCharts2(arrayData2);

                  const arrayDate = dataDate;
                  arrayDate.reverse();
                  setDataDate(arrayDate);

                  const arrayDate2 = dataDate2;
                  arrayDate2.reverse();
                  //setDataDate2(arrayDate2);
                  
                   
                   //console.log(arrayDate);
                  const result = arrayDate2.filter((item, index, arrayDate2) => arrayDate2.indexOf(item) === index);
                  setDataDate30(result);

                  // console.log(dataDate);
                  // console.log(dataDate2);
                  // console.log(dataCharts);
                  // console.log(dataCharts2);
                  // console.log('-------------------');
                },
                  error => {
                   console.log(error)
                }
            
          )
      };

      
      
      useEffect(() => {
        getUser();
        getWeight();
        getCharts();
        navigation.addListener("focus", () => setLoading(!loading));
      }, [navigation, loading, wagWeight, targetWeight, seven]);

      
      //console.log(dataWeight);
      // {format(wagDate.toDate(), 'dd/MM/yyyy, HH:mm')}
     
      const handleAdd = async () => {

        //Data i czas 2022-12-12T20:16:03.151Z
        const dates = moment(date).format("YYYY-MM-DD");
        const times = moment(time).format("HH:mm");
       // const dateTime = dates + 'T' + times + ':00';
        const dateTime = new Date(dates + 'T' + times + ':00Z');

        //console.log(dateTime);

        // BMI
        const bmi = parseFloat(currentWeight) / ((parseFloat(userData.heightName)*parseFloat(userData.heightName))/10000);
        
        //Zawartość tłuszczu  (1.39 x BMI) + (0.16 x wiek) – (10.34 x płeć) – 9
          let fatContent = 0;
        if(userData.gender === 1){
          fatContent = (1.39 * bmi) + (0.16 * age) - (10.34 * 0) - 9;
        } else {
          fatContent = (1.39 * bmi) + (0.16 * age) - (10.34 * 1) - 9;
        }

        //LMB
        //LBM (kobiety) = 1,07 x całkowita masa ciała (kg) - 148 [całkowita masa ciała/ wzrost (cm)]2
        //LBM (mężczyźni) = 1,1 x całkowita masa ciała (kg) -128 [całkowita masa ciała/ wzrost (cm)]2 
        let lbm = 0;
        let kwadrat = 0;

        if(userData.gender === 1){
          kwadrat = (currentWeight /userData.heightName) * (currentWeight /userData.heightName);
          lbm = 1.07 * parseFloat(currentWeight) - 148 * ( parseFloat(currentWeight) / (parseFloat(userData.heightName) *parseFloat(userData.heightName) ));
        }else{
          kwadrat = (currentWeight /userData.heightName) * (currentWeight /userData.heightName);
          lbm = 1.1 * parseFloat(currentWeight) - 128 * kwadrat;
        }

        //Różnica waga aktualna - waga docelowa 
        const weightDifference = currentWeight - userData.targetWeight;
       // console.log(weightDifference)
        //BAI 
        const bai = hipGirth / Math.pow((userData.heightName/100), 1.5)-18;
        //console.log(bai);

        //roznica poprzedniej roznicy
        const diff = weightDifference - weightDifference2;
        //console.log(diff)
        
        //console.log(lbm);
        //console.log( (currentWeight /userData.heightName) * (currentWeight /userData.heightName) );
        //console.log(result);

        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('weightLog')
        .add({
          createdAt: dateTime,
          bmi: bmi,
          currentWeight: parseFloat(currentWeight),
          fatContent: fatContent,
          lbm: lbm,
          targetWeight: parseFloat(userData.targetWeight),
          weightDifference: parseFloat(weightDifference),
          bai: hipGirth !== 0 ? bai : 0,
          differenceDifference: dataWeight.length === 0 ? 0 : diff
        })
        .then(() => {
          firestore()
          .collection('users')
          .doc(user.uid)
          .collection('profile')
          .doc('profil')
          .update({
            weightName: parseFloat(currentWeight),
          })
        }).then(() => {
          console.log('Added');
          //Alert.alert('Dodano produkt');
         // navigation.navigate('GlycemicIndex')
         ToastAndroid.show('Dodano nowy pomiar', ToastAndroid.LONG, ToastAndroid.BOTTOM);
         refRBSheet.current.close();
         //navigation.navigate('WeightLogScreen');
    
        })
      }
      
      const colorBMI = (wagBmi) => {
        let color;
        if(wagBmi < 16.00){
          color = BMI.BMI_1;
        } else if ((wagBmi >= 16.00) && (wagBmi <= 16.99)){
          color = BMI.BMI_2;
        } else if ((wagBmi >= 17.00) && (wagBmi <= 18.49)){
            color = BMI.BMI_3;
        } else if ((wagBmi >= 18.50) && (wagBmi <= 24.99)){
            color = BMI.BMI_4;
        } else if ((wagBmi >= 25.00) && (wagBmi <= 29.99)){
            color = BMI.BMI_5;
        } else if ((wagBmi >= 30.00) && (wagBmi <= 34.99)){
            color = BMI.BMI_6;
        } else if ((wagBmi >= 35.00) && (wagBmi <= 39.99)){
            color = BMI.BMI_7;
        }else {
          color = BMI.BMI_8;
        }
        return color;
      }

      const textBMI = (wagBmi) => {
        if(wagBmi < 16.00){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                <Text style={styles.textTitle}>Wygłodzenie</Text>
              </View>
             );
        } else if ((wagBmi >= 16.00) && (wagBmi <= 16.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                <Text style={styles.textTitle}>Wychudzenie</Text>
              </View>
             );
        } else if ((wagBmi >= 17.00) && (wagBmi <= 18.49)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                <Text style={styles.textTitle}>Niedowaga</Text>
              </View>
             );
        } else if ((wagBmi >= 18.50) && (wagBmi <= 24.99)){
           return( 
            <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                <Text style={styles.textA}>W normie</Text>
            </View>
           );
        } else if ((sumBMI >= 25.00) && (sumBMI <= 29.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                <Text style={styles.textTitle}>Nadwaga</Text>
            </View>
             );
        } else if ((sumBMI >= 30.00) && (sumBMI <= 34.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                  <Text style={styles.textTitle}>I st. otyłości</Text>
              </View>
             );
        } else if ((sumBMI >= 35.00) && (sumBMI <= 39.99)){
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                  <Text style={styles.textTitle}>II st. otyłości</Text>
              </View>
             );
        }else {
            return( 
              <View style={{backgroundColor: colorBMI(wagBmi), paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10}}>
                  <Text style={styles.textTitle}>III st. otyłości</Text>
              </View>
             );
        }
      }
      
      const textBAI = (wagBai) => { 
          
        if(userData.gender === 2){

          if(age < 20){
            return(
              <Text>Niski wiek</Text>
            )
          }
          if((age >= 20) && (age <= 39)){
            if(wagBai < 8){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_1}]}>
                  <Text>Niedowaga</Text>
                </View>
              )
            }
            if((wagBai >= 8) && (wagBai <= 21)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_2}]}>
                  <Text>W normie</Text>
                </View>
              )
            }
            if((wagBai >= 21) && (wagBai <= 26)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_3}]}>
                  <Text>Nadwaga</Text>
                </View>
                )
            }else{
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_4}]}>
                  <Text>Otyłość</Text>
                </View>
                )
            }
          }

          if((age >= 40) && (age <= 59)){
              if(wagBai < 11){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_1}]}>
                    <Text>Niedowaga</Text>
                  </View>
                )
              }
              if((wagBai >= 11) && (wagBai <= 23)){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_2}]}>
                    <Text>W normie</Text>
                  </View>
                )
              }
              if((wagBai >= 23) && (wagBai <= 29)){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_3}]}>
                    <Text>Nadwaga</Text>
                  </View>
                  )
              }else{
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_4}]}>
                    <Text>Otyłość</Text>
                  </View>
                  )
              }
          }

          if((age >= 60) && (age <= 79)){
              if(wagBai < 13){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_1}]}>
                    <Text>Niedowaga</Text>
                  </View>
                )
              }
              if((wagBai >= 13) && (wagBai <= 25)){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_2}]}>
                    <Text>W normie</Text>
                  </View>
                )
              }
              if((wagBai >= 25) && (wagBai <= 31)){
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_3}]}>
                    <Text>Nadwaga</Text>
                  </View>
                  )
              }else{
                return (
                  <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_4}]}>
                    <Text>Otyłość</Text>
                  </View>
                  )
              }

          } else {
            return(
              <Text>Za duży wiek</Text>
            )
          }
      //Kobieta    
      } else {
        
        if(age < 20){
          return(
            <Text>Niski wiek</Text>
          )
        }
        if((age >= 20) && (age <= 39)){
          if(wagBai < 21){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_1}]}>
                <Text>Niedowaga</Text>
              </View>
            )
          }
          if((wagBai >= 21) && (wagBai <= 33)){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_2}]}>
                <Text>W normie</Text>
              </View>
            )
          }
          if((wagBai >= 33) && (wagBai <= 39)){
            return (
              <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_3}]}>
                <Text>Nadwaga</Text>
              </View>
              )
          }else{
            return (
              <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_4}]}>
                <Text>Otyłość</Text>
              </View>
              )
          }
        }

        if((age >= 40) && (age <= 59)){
            if(wagBai < 23){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_1}]}>
                  <Text>Niedowaga</Text>
                </View>
              )
            }
            if((wagBai >= 23) && (wagBai <= 35)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_2}]}>
                  <Text>W normie</Text>
                </View>
              )
            }
            if((wagBai >= 35) && (wagBai <= 41)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_3}]}>
                  <Text>Nadwaga</Text>
                </View>
                )
            }else{
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_4}]}>
                  <Text>Otyłość</Text>
                </View>
                )
            }
        }

        if((age >= 60) && (age <= 79)){
            if(wagBai < 25){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_1}]}>
                  <Text>Niedowaga</Text>
                </View>
              )
            }
            if((wagBai >= 25) && (wagBai <= 38)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_2}]}>
                  <Text>W normie</Text>
                </View>
              )
            }
            if((wagBai >= 38) && (wagBai <= 43)){
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_3}]}>
                  <Text>Nadwaga</Text>
                </View>
                )
            }else{
              return (
                <View style={[styles.boxRoot ,{backgroundColor: BAI.BAI_4}]}>
                  <Text>Otyłość</Text>
                </View>
                )
            }

        } else {
          return(
            <Text>Za duży wiek</Text>
          )
        }
      }
      }

    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpanded2, setIsExpanded2] = useState(false);
    const [isExpanded3, setIsExpanded3] = useState(false);
  

      const ExpandableView = ({ expanded = false }) => {
        const [height] = useState(new Animated.Value(0));
      
        useEffect(() => {
          Animated.timing(height, {
            toValue: expanded ? 60 : 0,
            duration: 150,
            useNativeDriver: false
          }).start();
        }, [expanded, height]);
      
        // console.log('rerendered');
      
        return (
          <Animated.View
            style={{ height , backgroundColor: COLORS.WHITE, paddingHorizontal: 6 }}
          >
            <Text style={{fontSize: 12, color: TEXT.DEEP_BLUE}}>
              Beztłuszczowa masa ciała LBM (ang. lean body mass) oznacza masę ciała (tkanek aktywnych i kośćca) z wyłączeniem tkanki tłuszczowej. Określa się w ten sposób poziom odżywienia organizmu. 
            </Text>
          </Animated.View>
        );
      };
      
      const ExpandableView2 = ({ expanded = false }) => {
        const [height] = useState(new Animated.Value(0));
      
        useEffect(() => {
          Animated.timing(height, {
            toValue: expanded ? 40 : 0,
            duration: 150,
            useNativeDriver: false
          }).start();
        }, [expanded, height]);
      
        // console.log('rerendered');
      
        return (
          <Animated.View
            style={{ height , backgroundColor: COLORS.WHITE, paddingHorizontal: 6 }}
          >
            <Text style={{fontSize: 12, color: TEXT.DEEP_BLUE}}>
              BAI (ang. Body Adiposity Index) - czyli inaczej Wskaźnika Otłuszczenia Ciała, służy ocenie prawidłowej masy ciała.
            </Text>
          </Animated.View>
        );
      };

      const ExpandableView3 = ({ expanded = false }) => {
        const [height] = useState(new Animated.Value(0));
      
        useEffect(() => {
          Animated.timing(height, {
            toValue: expanded ? 76 : 0,
            duration: 150,
            useNativeDriver: false
          }).start();
        }, [expanded, height]);
      
        // console.log('rerendered');
      
        return (
          <Animated.View
            style={{ height , backgroundColor: COLORS.WHITE, paddingHorizontal: 6 }}
          >
            <Text style={{fontSize: 12, color: TEXT.DEEP_BLUE}}>
            Wskaźnik BMI (z ang. Body Mass Index - wskaźnik masy ciała) to wskaźnik, którego wartość pozwala ocenić, czy masa naszego ciała utrzymuje się w normie, czy też nie. Jest pomocny dla dorosłych kobiet i mężczyzn, którzy chcą monitorować swoją wagę.
            </Text>
          </Animated.View>
        );
      };

      //console.log(dataDate30);
      let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 });
      
      const charts = (dataCharts, dataCharts2, dataDate, dataDate30) => {
        //console.log(dataCharts);
        if (dataCharts?.length === 0) {
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
    width={Dimensions.get("window").width-12} // from react-native
    height={220}
    yAxisLabel=""
    yAxisSuffix=" kg"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#000",
          backgroundGradientFrom: COLORS.WHITE,
          backgroundGradientTo: COLORS.WHITE,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 10
      },
      propsForDots: {
        r: "0",
        strokeWidth: "0",
        stroke: COLORS.YELLOW
      }
    }}
    bezier
    style={{
      marginVertical: 8,
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
                    { data: dataCharts2,
                      strokeWidth: 3,
                      color: (opacity = 1) => `rgba(0,255,0,${opacity})`,
                    },
                  ],
                  legend: ["Aktualna masa ciała", "Wyznaczony cel"]
                }}
                  width={Dimensions.get("window").width-11} // from react-native
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" kg"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: "#000",
                    backgroundGradientFrom: COLORS.WHITE,
                    backgroundGradientTo: COLORS.WHITE,
                    decimalPlaces: 1, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 5
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: COLORS.DEEP_BLUE
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 6,
                    //borderRadius: 5
                  }}
    
                  decorator={() => {
                    return tooltipPos.visible ? <View>
                        <Svg>
                            <Rect x={tooltipPos.x - 14} 
                                y={tooltipPos.y + 13} 
                                width="37" 
                                height="24"
                                fill={COLORS.DEEP_BLUE} />
                                <TextSVG
                                    x={tooltipPos.x + 5}
                                    y={tooltipPos.y + 30}
                                    fill="white"
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="middle">
                                    {tooltipPos.value}
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
                    { data: dataCharts2,
                      strokeWidth: 3,
                      color: (opacity = 1) => `rgba(0,255,0,${opacity})`,
                    },
                  ],
                  legend: ["Aktualna masa ciała", "Wyznaczony cel"]
                }}
                  width={Dimensions.get("window").width-12} // from react-native
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=" kg"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: "#000",
                    backgroundGradientFrom: COLORS.WHITE,
                    backgroundGradientTo: COLORS.WHITE,
                    decimalPlaces: 1, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 5
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: COLORS.DEEP_BLUE
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 6,
                    borderRadius: 5
                  }}
    
                  decorator={() => {
                    return tooltipPos.visible ? <View>
                        <Svg>
                            <Rect x={tooltipPos.x - 14} 
                                y={tooltipPos.y + 13} 
                                width="37" 
                                height="24"
                                fill={COLORS.DEEP_BLUE} />
                                <TextSVG
                                    x={tooltipPos.x + 5}
                                    y={tooltipPos.y + 30}
                                    fill="white"
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="middle">
                                    {tooltipPos.value}
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


  
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#224870', marginTop: 30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Dziennik wagi" />
       {/* <Appbar.Action icon="history" onPress={() => navigation.navigate('HistoryWeightScreen')} /> */}
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
       // closeOnPressBack={true}
        onClose={() => setIsOpen(false)}
        //animationType='slide'
        height={heightModal}
        openDuration={800}
        closeDuration={200}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: COLORS.DEEP_BLUE,
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            elevation: 15, 
            backgroundColor:COLORS.GREY_DDD
          }
        }}
      >
       <View style={styles.modalRoot}>
        {/* <Text>{userData.weightName}</Text> */}
        <View style={{backgroundColor: COLORS.DEEP_BLUE, marginBottom: 6, borderWidth: 1, borderColor: COLORS.DEEP_BLUE, padding: 8, borderRadius: 5}}>
            <Text style={{color: TEXT.WHITE, fontWeight: 'bold'}}>Podaj dane</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: 3}}>
            
              <TouchableOpacity onPress={() => setOpen1(true)} style={{borderWidth: 1, borderColor: COLORS.GREY_DDD, padding: 8, backgroundColor: COLORS.WHITE}}>
                <Text style={{fontSize: 12, marginBottom: 5}}>Data</Text>
                <Text style={{fontSize: 16, color: '#000'}}>{moment(date).format('DD-MM-YYYY')}</Text>
              </TouchableOpacity>
                         
                  <DatePicker
                    modal
                    mode='date'
                    locale='PL-pl'
                    title='Data dodania'
                    confirmText='Ustaw'
                    cancelText='Anuluj'
                    open={open1}
                    date={date}
                    onConfirm={(date) => {
                      setOpen1(false)
                      setDate(date)
                    }}
                    onCancel={() => {
                      setOpen1(false)
                    }}
                  />
            </View>

            <View style={{flex: 1, marginLeft: 3}}>
            <TouchableOpacity onPress={() => setOpen2(true)} style={{borderWidth: 1, borderColor: COLORS.GREY_DDD, padding: 8, backgroundColor: COLORS.WHITE}}>
                <Text style={{fontSize: 12, marginBottom: 5}}>Godzina</Text>
                <Text style={{fontSize: 16, color: TEXT.BLACK}}>{moment(time).format("HH:mm")}</Text>
              </TouchableOpacity>
                         
                  <DatePicker
                    modal
                    mode='time'
                    locale='PL-pl'
                    title='Godzina dodania'
                    confirmText='Ustaw'
                    cancelText='Anuluj'
                    open={open2}
                    date={time}
                    onConfirm={(time) => {
                      setOpen2(false)
                      setTime(time)
                    }}
                    onCancel={() => {
                      setOpen2(false)
                    }}
                  />
            </View>
          </View>

          <View>
          <View style={{ elevation: 5, marginTop: 6}}>
                    <TextInput
                        underlineColor={COLORS.WHITE}
                        activeUnderlineColor={COLORS.DEEP_BLUE}
                        label="Aktualna waga (kg)"
                        value={currentWeight}
                        style={{backgroundColor: COLORS.WHITE}}
                        onChangeText={setCurrentWeight}
                        keyboardType="numeric"
                    />
                </View>
          </View>
          <View>
          <View style={{ elevation: 5, marginTop: 6}}>
                    <TextInput
                        underlineColor={COLORS.WHITE}
                        activeUnderlineColor={COLORS.DEEP_BLUE}
                        label="Obwód bioder (cm)"
                        value={hipGirth}
                        style={{backgroundColor: COLORS.WHITE}}
                        onChangeText={setHipGirth}
                        keyboardType="numeric"
                    />
                </View>
          </View>

          <View style={{flex: 1,alignItems: 'center', marginTop: 10}}>
        <TouchableOpacity onPress={handleAdd} style={styles.btnModal}>
          <Text style={styles.textBtn}>ZAPISZ</Text>
        </TouchableOpacity>

      </View>

       </View>
       </RBSheet>

    <ImageBackground 
    source={require('../assets/images/bg5.jpg')}
    blurRadius={5}
    style={{ 
      //height: getHeight(), 
      flex: 1, 
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
       }}
       imageStyle={{
        opacity: 0.8
      }}
    
  >    
    <ImageBackground
      source={require('../assets/images/wave.png')}
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
      {/* {console.log('Obecna: ' + weight)}
      {console.log('' + wagWeight)} */}
      <View style={styles.rootContainer}>
      <ScrollView style={{marginBottom: 6}}>
      <View style={{flexDirection: 'row'}}>
        { !dataWeight  ?
        (
        <View style={[styles.boxCard,{marginRight: 6}]}>
          <Text style={{fontSize: 10}}>OBECNA WAGA</Text>
          <View style={{marginTop: 6, alignItems: 'center'}}>
            <Text style={styles.textCard}>{ wagWeight }</Text>
            <Text style={{fontSize: 10}}>(kg)</Text>
          </View>
        </View>
        ) : 
        (
          <View style={[styles.boxCard,{marginRight: 6}]}>
          <Text style={{fontSize: 10}}>OBECNA WAGA</Text>
          <View style={{marginTop: 6, alignItems: 'center'}}>
            <Text style={styles.textCard}>{ wagWeight ? wagWeight : weight }</Text>
            <Text style={{fontSize: 10}}>(kg)</Text>
          </View>
        </View>
        )

        }
        <View style={[styles.boxCard,{marginRight: 6}]}>
          <Text style={{fontSize: 10}}>WAGA DOCELOWA</Text>
          <View style={{marginTop: 6, alignItems: 'center'}}>
            <Text style={styles.textCard}>{targetWeight}</Text>
            <Text style={{fontSize: 10}}>(kg)</Text>
          </View>
        </View>

        <View style={styles.boxCard}>
          <Text style={{fontSize: 9}}>RÓŻNICA</Text>
          <View style={{marginTop: 6, alignItems: 'center'}}>
            {/* <Text>{sumXXX(targetWeight)}</Text> */}
            {
              weight > targetWeight ? (
                
                <View style={{alignItems: 'center'}}>
                  <Text style={[styles.textCard,{color: TEXT.RED}]}>+{(roznica).toFixed(2)}</Text>
                  <Text style={{fontSize: 10}}>(kg)</Text>
                </View>
                
              ) :
              (
                <View style={{alignItems: 'center'}}>
                  <Text style={{fontSize: 10, color: COLORS.GREEN, fontWeight: 'bold'}}>WYZNACZ</Text>
                  <Text style={{fontSize: 10, color: COLORS.GREEN, fontWeight: 'bold'}}>NOWY</Text>
                  <Text style={{fontSize: 10, color: COLORS.GREEN, fontWeight: 'bold'}}>CEL</Text>
                </View>
              )
            }
          </View>
        </View>

        

      </View>

      
      <View style={{marginBottom: -2, elevation: 5}}>
      
        {charts(dataCharts, dataCharts2, dataDate, dataDate30)}
             
      </View>

      { dataCharts.length >= 2 &&
       <>
      <View style={{flexDirection: 'row', marginTop: 0}}>
        <View style={{ flex:1, marginRight: 3}}>
            <Button mode='contained' onPress={changeNumber} color={COLORS.DEEP_BLUE} style={{borderRadius: 5}}>
              7 pomiarów
            </Button>
        </View>
        <View style={{ flex:1,  marginLeft: 3}}>
          <Button mode='contained' onPress={changeNumber2} color={COLORS.DEEP_BLUE} style={{borderRadius: 5}}>
            30 pomiarów
          </Button>
        </View>
      </View>
      </>
    }
        
        { dataWeight.length > 0 &&
        
        <View style={{marginTop: 6, backgroundColor: COLORS.WHITE, padding: 10, borderRadius: 5, elevation: 5}}>
          
            {/* <Text style={{fontSize: 11}}>Data: {wagDate.toDate().toLocaleDateString('pl-PL')},  {wagDate.toDate().toLocaleTimeString('pl-PL')}</Text> */}

            <View style={{flexDirection: 'row', marginBottom: 6}}>
             
              <View>
                <MaterialCommunityIcons name='clock-time-five' size={14} color={COLORS.DEEP_BLUE} />
              </View>
              <View>
                <Text style={{marginLeft: 3, fontSize: 11, color: TEXT.DEEP_BLUE}}>{format(wagDate.toDate(), 'dd/MM/yyyy, HH:mm')}</Text>
              </View>

            </View>

          
            <View style={{flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.LIGHT_GREY, borderTopWidth: 1, borderTopColor: COLORS.LIGHT_GREY}}>
              
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{justifyContent: 'center'}}>
                  <MaterialCommunityIcons name='scale-bathroom' size={24} color={COLORS.GREY_AAA} />
                  {/* <Image source={require('../assets/images/icons/scales.png')} style={{width: 24, height: 24}} /> */}
                </View>
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={{color: TEXT.DEEP_BLUE, fontSize: 14}}>Waga</Text>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 16, color: TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ wagWeight }<Text style={{fontSize: 12, fontWeight: '400'}}> kg</Text></Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  {/* <View style={{backgroundColor: colorBMI(wagBmi), padding: 4, width: 100, borderRadius: 10, alignItems: 'center'}}>
                    <Text>dsd</Text>
              </View> */}
                  {textBMI(wagBmi)}
              </View>

            </View>

            <TouchableOpacity style={{flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.LIGHT_GREY}}
              onPress={() => {setIsExpanded3(!isExpanded3);}}
            >
              
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{justifyContent: 'center'}}>
                  <MaterialCommunityIcons name='alpha-b-box-outline' size={24} color={COLORS.GREY_AAA} />
                  {/* <Image source={require('../assets/images/icons/bmi.png')} style={{width: 24, height: 24}} /> */}
                </View>
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={{color: TEXT.DEEP_BLUE, fontSize: 14}}>BMI</Text>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 16, color: TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ wagBmi.toFixed(1) }</Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  {/* <View style={{backgroundColor: colorBMI(wagBmi), padding: 4, width: 100, borderRadius: 10, alignItems: 'center'}}>
                    <Text>dsd</Text>
              </View> */}
                 {textBMI(wagBmi)}
              </View>
              
            </TouchableOpacity>
            <ExpandableView3 expanded={isExpanded3} />
            
          { wagBai !== 0 &&
            <>
            <TouchableOpacity style={{flexDirection: 'row', padding: 10}} 
            onPress={() => {setIsExpanded2(!isExpanded2);}}
            >
              
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{justifyContent: 'center'}}>
                <SimpleLineIcons name='drop' size={20} color={COLORS.GREY_AAA} />
                  {/* <Image source={require('../assets/images/icons/fats.png')} style={{width: 24, height: 24}} /> */}
                </View>
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={{color: TEXT.DEEP_BLUE, fontSize: 16}}>BAI</Text>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 16, color: TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ (wagBai).toFixed(2) }<Text style={{fontSize: 12, fontWeight: '400'}}> %</Text></Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  {/* <View style={{backgroundColor: colorBMI(wagBmi), padding: 4, width: 100, borderRadius: 10, alignItems: 'center'}}>
                    <Text>dd</Text>
              </View> */}
                  {textBAI(wagBai)}
              </View>

            </TouchableOpacity>
            <ExpandableView2 expanded={isExpanded2} />
            </>
           }

            <TouchableOpacity style={{flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: COLORS.LIGHT_GREY}}
              onPress={() => {setIsExpanded(!isExpanded);}}
            >
              
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{justifyContent: 'center'}}>
                  <MaterialCommunityIcons name='human-child' size={24} color={COLORS.GREY_AAA} />
                  {/* <Image source={require('../assets/images/icons/fat-cell.png')} style={{width: 24, height: 24}} /> */}
                </View>
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={{color: TEXT.DEEP_BLUE, fontSize: 16}}>LBM</Text>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 16, color: TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{ wagLBM.toFixed(2) }<Text style={{fontSize: 12, fontWeight: '400'}}> kg</Text></Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  {/* <View style={{backgroundColor: colorBMI(wagBmi), padding: 4, width: 100, borderRadius: 10, alignItems: 'center'}}>
                    <Text>dd</Text>
              </View> */}
                  
              </View>

            </TouchableOpacity>
            <ExpandableView expanded={isExpanded} />

           </View>
           
        }

       </ScrollView>
      </View>
     
    </ImageBackground>


     <AnimatedFAB
        icon={'plus'}
        label={'Dodaj'}
        extended={isExtended}
        onPress={() => {
            refRBSheet.current.open();
        }}
        visible={visible}
        theme={'tertiary'}
        animateFrom={'right'}
        iconMode={'static'}
        //color={COLORS.ORANGE}

        style={[styles.fabStyle, style, fabStyle]}
      />
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>
    
  )
}

export default WeightLogScreen;

const styles = StyleSheet.create({
    rootContainer: {
      marginHorizontal: 6,

    },
    modalRoot: {
        flex: 1,
        marginHorizontal: 6,
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
        //backgroundColor: '#224870',
        //marginBottom: 35,
      },
      btnModal: {
        borderWidth: 0,
        padding: 10,
        width: Dimensions.get('window').width-12,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#224870',
        elevation: 3,
        marginBottom: 10,
      },
      
      textBtn: {
        color: '#fff'
      },
      boxCard: {
        backgroundColor: COLORS.WHITE,
        padding: 10,
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 5
      },
      textCard: {
        fontSize: 24,
        color: TEXT.DEEP_BLUE,
        fontWeight: 'bold'
      }, 
      textA: {
        fontSize: 14,
      },
      boxRoot: {
        paddingHorizontal: 10, 
        paddingVertical: 3, 
        borderRadius: 10
      },
      emptyData: {
        backgroundColor: COLORS.WHITE,
        padding: 10,
        marginTop: 6,
        padding: 10,
        borderRadius: 5
      },
      emptyText: {
        fontSize: 12,
        color: TEXT.DEEP_BLUE,
      }

})