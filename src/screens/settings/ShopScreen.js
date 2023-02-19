import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions, FlatList, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, spacing, typography } from '../../styles';
import Purchases from 'react-native-purchases';
import PackageItem from '../../components/PackageItem'

const ShopScreen = ({ navigation }) => {
  
  const _goBack = () => navigation.navigate('SettingScreen');
  const imageBG = require('../../assets/images/bg5.jpg');
  const [packages, setPackages] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const getPackages = async () =>{
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {  
          // console.log(offerings.current);
           setPackages(offerings.current.availablePackages);
           //console.log(packages)
        }
      } catch (e) {
        console.error(e)
      }
    };
    getPackages();
  },[]);

  const header = () => <Text style={styles.text}>FitEat Pro Premium</Text>;

  const footer = () => {
    
    return (
      <Text style={styles.text}>
       
      </Text>
    );
  };
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: spacing.SCALE_30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Kup / Subskrypcje" />
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
           
      {/* The paywall flat list displaying each package */}
            <FlatList
              data={packages}
              renderItem={({ item }) => <PackageItem purchasePackage={item} setIsPurchasing={setIsPurchasing} />}
              keyExtractor={(item) => item.identifier}
              ListHeaderComponent={header}
              ListHeaderComponentStyle={styles.headerFooterContainer}
              ListFooterComponent={footer}
              ListFooterComponentStyle={styles.headerFooterContainer}
            />

            {isPurchasing && <View style={styles.overlay} />}
         
            </View>
        </View>
    
    </ImageBackground>
    </ImageBackground>
    </SafeAreaProvider>
  )
}

export default ShopScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        //marginHorizontal: spacing.SCALE_6,
    },
    boxContainer: {
        flex: 1,
        backgroundColor: colors.COLORS.LIGHT_GREY,
        padding: spacing.SCALE_6,
        //marginBottom: spacing.SCALE_6,
        borderTopLeftRadius: spacing.SCALE_5,
        borderTopRightRadius: spacing.SCALE_5,
    },
    page: {
      padding: 6,
      flex: 1
    },
    text: {
      color: colors.TEXT.DEEP_BLUE,
      fontWeight: 'bold',
      fontSize: typography.FONT_SIZE_16,
    },
    headerFooterContainer: {
      marginVertical: 10,
    },
    overlay: {
      flex: 1,
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: 0.5,
      backgroundColor: 'black',
    },
    title: {
      color: colors.TEXT.DEEP_BLUE,
      fontSize: 16,
      fontWeight: 'bold',
    },
})