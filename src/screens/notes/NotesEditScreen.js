import React, {useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ImageBackground, StatusBar, Dimensions, TextInput, ToastAndroid, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider, Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { colors, typography, spacing } from '../../styles';
import { useTranslation } from 'react-i18next';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.COLORS.LIGHT_BLUE,
    accent: colors.COLORS.YELLOW,
  },
};

const NotesEditScreen = ({  
  route,
  navigation,
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode }) => {
  
  const [isExtended, setIsExtended] = useState(true);

  const {t, i18n} = useTranslation();

  const isIOS = Platform.OS === 'ios';
    
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  
    setIsExtended(currentScrollPosition <= 0);
  };
  
  const fabStyle = { [animateFrom]: 16 };
  
  const _goBack = () => navigation.navigate('NotesScreen');

  const noteId = route.params.itemId;
  const {user} = useContext(AuthContext); 

  const [title, setTitle] = useState(null);
  const [contents, setContents] = useState(null);
  const [loading, setLoading] = useState(true);

  const getViewNote = () => {
    firestore()
   .collection('users')
   .doc(user.uid)
   .collection('notes')
   .doc(noteId)
   .get()
   .then(doc => {
     //console.log('User exists: ', doc.exists);

     if (doc.exists) {
       //console.log('Data: ', doc.data());
       //setDataItem(doc.data());
       setTitle(doc.data().title);
       setContents(doc.data().contents)

     }
   });
 };

  const updateNote = async () => {
    console.log(title)
    console.log(contents)
    await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('notes')
          .doc(noteId)
          .update({
            createdAt: firestore.Timestamp.fromDate(new Date()),
            title: title,
            contents: contents

          }).then(() => {
            console.log('Added');
            ToastAndroid.show(t('notesEditScreen.toast.note-updated'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
            navigation.navigate('NotesScreen');
     
          }).catch((error) => {
            console.log('Error: 1' + error);
         })
  }

  useEffect(() => {
    getViewNote();
    navigation.addListener("focus", () => setLoading(!loading));
 }, [navigation, loading]);

 const _alertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      '',
      //body
      t('notesEditScreen.alert.delete-note'),
      [
        { text: t('notesEditScreen.alert.yes'), onPress: () => _handeDeleteNote() },
        {
          text: t('notesEditScreen.alert.cancel'),
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  const _handeDeleteNote = async () => {
    await firestore()
    .collection('users')
    .doc(user.uid)
    .collection('notes')
    .doc(noteId)
    .delete()
    .then(() => {
       ToastAndroid.show(t('notesEditScreen.toast.note-deleted'), ToastAndroid.LONG, ToastAndroid.BOTTOM);
       navigation.navigate('NotesScreen');
    })
}

      
  return (
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
    <Appbar.BackAction onPress={_goBack} />
       <Appbar.Content title={t('notesEditScreen.title')} />
       <Appbar.Action icon="trash-can" onPress={_alertHandler} color={colors.BMI.BMI_7} />
       <Appbar.Action icon="content-save" onPress={updateNote} color={colors.BMI.BMI_4} />
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <ImageBackground 
      source={require('../../assets/images/note1.jpg')}
      blurRadius={5}
      resizeMode="stretch"
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

export default NotesEditScreen;

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