import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, spacing, typography } from '../../styles';
import { version } from '../../styles/constants';
import { ScrollView } from 'react-native-gesture-handler';


const AboutTheAppScreen = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('SettingScreen');
  const imageBG = require('../../assets/images/bg5.jpg');
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#224870', marginTop: 30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="O aplikacji" />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={imageBG}
    blurRadius={5}
    resizeMode="cover"
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
            <View style={styles.boxContainer}>
              <Text style={styles.title}>FitEat Pro v. {version.namber}</Text>
              <ScrollView>
              <Text style={styles.text}>Aplikacja powstała z myślą o osobach stosujących diety oparte o niski indeks glikemiczny. Przyda się w walce z otyłością oraz w zapobieganiu cukrzycy.</Text>
              <View style={{marginTop: spacing.SCALE_10}}>
                <Text style={{color: colors.TEXT.GREEN, fontWeight: 'bold'}}>Podstawowe fukncje:</Text>
                
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Tworzenie posiłków w oparciu o listę produktów.</Text>
                    <Text style={styles.text}>Po utworzeniu posiłku dostajemy informację o indeksie posiłku, ładunku posiłku, wymienniku węglowodanowym, wymienniku białkowo-tłuszczowym, ilości kalorii, wadze posiłku oraz ilości wartości takich jak: węglowodany, błonnik, białko, tłuszcze, cukier i cholesterol</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Wyszukiwarka produktów</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Dostajemy listę produktów, którą możemy uzupełniać, modyfikować lub kasować</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Lista produktów wyświetla informację o indeksie glikemicznym, po kliknięciu w dany produkt dostajemy informację o wartościach odżywczych danego produktu mi. witaminy, makroelemeny i mikroelemeny</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Sortowanie listy produktów wg wybranego składnika</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Prowadzenie dziennika wagi</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Prowadzenie dziennika pomiarów ciśnienia krwi</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Prowadzenie dziennika pomiarów glukozy</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Lista produktów - puryny.</Text>
                  </View>
                </View>

                <View style={{marginTop: spacing.SCALE_10}}>
                  <Text style={{color: colors.TEXT.GREEN, fontWeight: 'bold'}}>Pozostałe fukncje:</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Kalkulatory BMI, BMR, WHR i WtHR</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Insulinooporność: kalkulator HOMA-IR i QUICKI</Text>
                  </View>
                </View>
  
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Dokumentowanie wyników badań za pomocą zdjęć</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text style={styles.dot}>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>Notatnik</Text>
                  </View>
                </View>

              </View>

              <View style={{marginTop: spacing.SCALE_10}}>
                  <Text style={{color: colors.TEXT.GREEN, fontWeight: 'bold'}}>Pozostałe informacje:</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.text}>Aplikacja wymaga połączenia z internetem, gdyż wszystkie dane przetrzymywane są na zewnętrznym serwerze (firebase google).</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.text}>W razie wymiany telefonu wystarczy pobrać aplikację i ponownie się zalogować.</Text>
                </View>

              <View style={{marginTop: spacing.SCALE_15}}>
                <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>Źródło:</Text>
                <View>
                  <Text style={{fontSize: typography.FONT_SIZE_12, color: colors.TEXT.DEEP_BLUE}}>The Univerity of Sydney, USDA U.A. Departamment Of Agriculture, Wikipedia, Low Crab Check i inne.</Text>
                </View>
              </View>

            
              </ScrollView>
            </View>
        </View>
    
    </ImageBackground>
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default AboutTheAppScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        //marginHorizontal: spacing.SCALE_6,
    },
    boxContainer: {
        flex: 1,
        backgroundColor: colors.COLORS.WHITE,
        padding: spacing.SCALE_10,
        marginBottom: spacing.SCALE_6,
        borderRadius: spacing.SCALE_5,
    },
    title:{
      fontSize: typography.FONT_SIZE_16,
      fontWeight: 'bold',
      color: colors.TEXT.DEEP_BLUE
    },
    text: {
      fontSize: typography.FONT_SIZE_13,
      color: colors.TEXT.DEEP_BLUE
    },
    dot: {
      fontSize: typography.FONT_SIZE_13,
      color: colors.TEXT.DEEP_BLUE
    }
})