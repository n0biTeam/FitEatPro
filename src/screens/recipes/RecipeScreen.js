import { StyleSheet, Text, View, Dimensions, StatusBar, Image } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../styles';
import { Appbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const RecipeScreen = ({ route, navigation }) => {

    const item = route.params.dataOne;
    const _goBack = () => navigation.goBack();

    const widthX = Dimensions.get('window').width;

    console.log(item)
  return (
    <SafeAreaProvider style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: colors.COLORS.DEEP_BLUE, marginTop: StatusBar.currentHeight}}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title='Przepis'/>
    </Appbar.Header>
        <StatusBar translucent={true} backgroundColor={colors.COLORS.DEEP_BLUE} barStyle="light-content"/>
        <View style={styles.rootContainer}>
            <View style={{backgroundColor: colors.COLORS.WHITE, padding: spacing.SCALE_5, elevation: 3, flex: 1}}>
            <View>
                <Text style={styles.title}>{ item.title }</Text>
                <Text style={styles.category}>Kategoria: <Text style={{textTransform: 'uppercase', color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_9}}>{item.category}</Text></Text>
            </View>
            
            <View style={{marginBottom: 6}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{padding: spacing.SCALE_5, borderWidth: 1, borderRadius: spacing.SCALE_5, borderColor: colors.COLORS.GREY_CCC}}>
                        <Image source={item.imagePhoto} style={{width: widthX-90-10, height: 200, borderRadius: spacing.SCALE_5}} />
                    </View>
                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'column', marginTop: spacing.SCALE_6, marginBottom: spacing.SCALE_6}}>
                        
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View>
                                <MaterialCommunityIcons name='clock-time-four-outline' size={20} color={colors.COLORS.GREY_AAA} />
                            </View>
                            <View>
                                <Text style={{fontSize: typography.FONT_SIZE_11, color: colors.TEXT.DEEP_BLUE}}>{item.time} min</Text>
                            </View>
                        </View>

                        <View style={{flex: 1}}>
                            <Text style={{fontSize: typography.FONT_SIZE_14, color: colors.TEXT.DEEP_BLUE, fontWeight: 'bold'}}>{item.kcal}</Text>
                            <Text style={{fontSize: typography.FONT_SIZE_11, color: colors.TEXT.DEEP_BLUE, marginTop: -2}}> kcal</Text>
                        </View>

                        <View style={{flex: 1, alignItems: 'center', marginBottom: spacing.SCALE_6}}>
                            <Text style={{fontSize: typography.FONT_SIZE_13, color: colors.TEXT.DEEP_BLUE}}>IG</Text>
                            <View style={{borderWidth: 1, borderColor: colors.COLORS.DEEP_BLUE, backgroundColor: colors.COLORS.DEEP_BLUE, borderRadius: spacing.SCALE_25, paddingHorizontal: spacing.SCALE_6, paddingVertical: spacing.SCALE_5, elevation: 3}}>
                                <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>{item.indexGlycemic}</Text>
                            </View>
                        </View>

                        <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{fontSize: typography.FONT_SIZE_13, color: colors.TEXT.DEEP_BLUE}}>ŁG</Text>
                            <View style={{borderWidth: 1, borderColor: colors.COLORS.LIGHT_BLUE, backgroundColor: colors.COLORS.LIGHT_BLUE, borderRadius: spacing.SCALE_25, paddingHorizontal: spacing.SCALE_6, paddingVertical: spacing.SCALE_5, elevation: 2}}>
                                <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_13, fontWeight: 'bold'}}>{item.glycemicLoad}</Text>
                            </View>
                        </View>



                        
                    </View>
                </View>


                
            </View>

            <View style={{flexDirection: 'row'}}>
                <View style={{paddingHorizontal: spacing.SCALE_6, borderWidth: 1, borderColor: colors.VALUES.VALUE1, alignItems: 'center', alignSelf: 'center', borderRadius: 30, backgroundColor: colors.VALUES.VALUE1, marginRight: spacing.SCALE_5}}>
                    <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_8}}>BIAŁKO | {item.proteins} g</Text>
                </View>
                <View style={{paddingHorizontal: spacing.SCALE_6, borderWidth: 1, borderColor: colors.VALUES.VALUE2, alignItems: 'center', alignSelf: 'center', borderRadius: 30, backgroundColor: colors.VALUES.VALUE2, marginRight: spacing.SCALE_5}}>
                    <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_8}}>TŁUSZCZE | {item.fats} g</Text>
                </View>
                <View style={{paddingHorizontal: spacing.SCALE_6, borderWidth: 1, borderColor: colors.VALUES.VALUE3, alignItems: 'center', alignSelf: 'center', borderRadius: 30, backgroundColor: colors.VALUES.VALUE3, marginRight: spacing.SCALE_5}}>
                    <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_8}}>WĘGLOWODANY | {item.carbs} g</Text>
                </View>
                <View style={{paddingHorizontal: spacing.SCALE_6, borderWidth: 1, borderColor: colors.VALUES.VALUE3, alignItems: 'center', alignSelf: 'center', borderRadius: 30, backgroundColor: colors.VALUES.VALUE3}}>
                    <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_8}}>BŁONNIK | {item.fiber} g</Text>
                </View>
            </View>

            <View style={{marginTop: spacing.SCALE_6}}>
                <Text style={{color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_11, textTransform: 'uppercase', fontWeight: 'bold'}}>Składniki na 1 porcję:</Text>
            </View>
            <View style={{flexDirection: 'row'}}>

                <View>
                    <Entypo name='dot-single' size={20} />
                </View>
                <View>
                    <Text>{item.ingredients.val1} g - {item.ingredients.ing1}</Text>
                </View>
            </View>

            <View style={{flexDirection: 'row'}}>
                <View>
                    <Entypo name='dot-single' size={20} />
                </View>
                <View>
                    <Text>{item.ingredients.val2} g - {item.ingredients.ing2}</Text>
                </View>
            </View>

            <View style={{flexDirection: 'row'}}>
                <View>
                    <Entypo name='dot-single' size={20} />
                </View>
                <View>
                    <Text>{item.ingredients.val3} g - {item.ingredients.ing3}</Text>
                </View>
            </View>
            

            </View>

            
        </View>
    </SafeAreaProvider>
  )
}

export default RecipeScreen

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: spacing.SCALE_6,
        marginTop: spacing.SCALE_6,
        backgroundColor: colors.COLORS.LIGHT_GREY,
        flex: 1, 
        marginBottom: spacing.SCALE_6
    },
    title: {
        color: colors.COLORS.DEEP_BLUE,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: typography.FONT_SIZE_14,
    },
    category: {
        fontSize: typography.FONT_SIZE_11,
        color: colors.COLORS.GREY_777,
    }
})