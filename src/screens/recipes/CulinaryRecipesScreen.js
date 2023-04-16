import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';
import CardRecipes from '../../components/CardRecipes';
import BigList from "react-native-big-list";
import dataReciepes from './dataReciepes';


const CulinaryRecipesScreen = ({ navigation }) => {
    
    const _goBack = () => navigation.goBack();

    const [data, setData] = useState(dataReciepes);

    console.log(data);
    
    const renderItem = ({ item, index }) => (
        <CardRecipes 
            title={item.title} 
            category={item.category} 
            linkImage={item.imagePhoto} 
            indexGlycemic={item.indexGlycemic} 
            glycemicLoad={item.glycemicLoad}
            time={item.time}
            onPress={() => navigation.navigate('RecipeScreen', {dataOne: item}) }
        />
      );
  return (
    <SafeAreaProvider style={{flex: 1}}>
    <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title='Przepisy o niskim indeksie'/>
    </Appbar.Header>
    <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content"/>
    <View style={styles.rootContainer}>

    <BigList
    data={data}
    renderItem={renderItem}
    itemHeight={275}
    //keyExtractor={(item) => item}
  />
    </View>
    </SafeAreaProvider>
  )
}

export default CulinaryRecipesScreen

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        marginHorizontal: spacing.SCALE_6,
        marginVertical: spacing.SCALE_6
    }
})