import React, {useState, useContext } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Dimensions, TextInput, ToastAndroid } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider, Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { colors, typography, spacing } from '../../styles';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const NotesAddScreen = ({  
  navigation,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode }) => {
  
  const [isExtended, setIsExtended] = useState(true);

  const isIOS = Platform.OS === 'ios';
    
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
    setIsExtended(currentScrollPosition <= 0);
  };
  
  const fabStyle = { [animateFrom]: 16 };
  
  const _goBack = () => navigation.navigate('NotesScreen');

  const {user} = useContext(AuthContext); 

  const [title, setTitle] = useState(null);
  const [contents, setContents] = useState(null);

  const addNote = async () => {
    console.log(title)
    console.log(contents)
    await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('notes')
          .add({
            createdAt: firestore.Timestamp.fromDate(new Date()),
            title: title,
            contents: contents

          }).then(() => {
            console.log('Added');
            ToastAndroid.show('Dodano notatkę', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            navigation.navigate('NotesScreen');
     
          }).catch((error) => {
            console.log('Error: 1' + error);
         })
  }

   
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title="Notatka" />
       { title &&
        <Appbar.Action icon="content-save" onPress={addNote} color={colors.BMI.BMI_4}/>
        }
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
    source={require('../../assets/images/note1.jpg')}
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
            <View style={styles.noteContainer}>
          
                <View>
                    <TextInput 
                        placeholder='Tytuł'
                        onChangeText={setTitle}
                        value={title}
                        style={styles.titleInput }
                    />
                </View>
                <ScrollView>
                    <TextInput 
                        placeholder='Treść'
                        onChangeText={setContents}
                        value={contents}
                        multiline
                        numberOfLines={35}
                        style={styles.contents}
                    />
                </ScrollView>
          
            </View>

      
        </View>

        
    </ImageBackground>
    
    </ImageBackground>
    </SafeAreaProvider>
    </PaperProvider>
  )
}

export default NotesAddScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginHorizontal: spacing.SCALE_6,
    flex: 1,
  },
  noteContainer: {
    flex: 1,
    backgroundColor: colors.COLORS.WHITE,
    borderRadius: 5,
    marginBottom: spacing.SCALE_6,
    paddingHorizontal: spacing.SCALE_5,
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.COLORS.DEEP_BLUE,
    paddingBottom: spacing.SCALE_5,
    fontSize: typography.FONT_SIZE_16
  },
  contents: {
    textAlignVertical: 'top'
  }
})