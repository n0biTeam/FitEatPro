import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar, Dimensions } from 'react-native'
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';


const EditItemGlycemicIndex = ({ route, navigation }) => {
  
  const _goBack = () => navigation.navigate('GlycemicIndex');
  const productId = route.params.itemId;
  
  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#224870', marginTop: 30}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="EDYCJA PRODUKTU" />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={require('../assets/images/bg5.jpg')}
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
    {/* <View>
      <Text>GlycemicIndex</Text>
      <Text>{productId}</Text>
    </View> */}
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

    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
    // <View style={{flex: 1, justifyContent: 'center'}}>
    //   <Text>ItemGlycemicIndex</Text>
    //   <Text>{productId}</Text>
    //   <TouchableOpacity style={{borderWidth: 1, padding: 10,}} 
    //       onPress={()=> navigation.pop()}>
    //     <Text>Wróć</Text>
    //   </TouchableOpacity>
    // </View>
  )
}

export default EditItemGlycemicIndex;

const styles = StyleSheet.create({})