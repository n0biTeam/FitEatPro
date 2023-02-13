import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, spacing, typography } from '../../styles';
import { version } from '../../styles/constants';


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
           
              <Text>Aplikacja powstała z myślą o osobach stosujących diety oparte o niski indeks glikemiczny. Przyda się w walce z otyłością oraz w zapobieganiu cukrzycy.</Text>
              <View style={{marginTop: spacing.SCALE_10}}>
                <Text style={{color: colors.TEXT.GREEN}}>Podstawowe fukncje aplikacji:</Text>
                
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Tworzenie posiłków w oparciu o listę produktów.</Text>
                    <Text>Po utworzeniu posiłku dostajemy informację o indeksie posiłku, ładunku posiłku, wymienniku węglowodanowym, wymienniku białkowo-tłuszczowym, ilości kalorii, wadze posiłku oraz ilości wartości takich jak: węglowodany, błonnik, białko, tłuszcze, cukier i cholesterol</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Wyszukiwarka produktów</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Dostajemy listę produktów, którą możemy uzupełniać, modyfikować lub kasować</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Lista produktów wyświetla informację o indeksie glikemicznym, po kliknięciu w dany produkt dostajemy informację o wartościach odżywczych danego produktu mi. witaminy, makroelemeny i mikroelemeny</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Sortowanie listy produktów wg wybranej wartości</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Prowadzenie dziennika wagi</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Prowadzenie dziennika pomiarów ciśnienia krwi</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Prowadzenie dziennika pomiarów glukozy</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Lista produktów - puryny.</Text>
                  </View>
                </View>

                <View style={{marginTop: spacing.SCALE_10}}>
                  <Text style={{color: colors.TEXT.GREEN}}>Pozostałe fukncje aplikacji:</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Kalkulatory BMI, BMR, WHR i WtHR</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Insulinooporność: kalkulator HOMA-IR i QUICKI</Text>
                  </View>
                </View>
  
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Dokumentowanie wyników badań za pomocą zdjęć</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: spacing.SCALE_6}}>
                    <Text>{'\u2B24'}</Text>
                  </View>
      
                  <View style={{flex: 1}}>
                    <Text>Notatnik</Text>
                  </View>
                </View>

              </View>
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
        marginHorizontal: spacing.SCALE_6,
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
    }
})