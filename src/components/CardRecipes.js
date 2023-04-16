import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors, typography, spacing } from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CardRecipes({title, category, linkImage, indexGlycemic, glycemicLoad, onPress, time}) {
    
    const widthX = Dimensions.get('window').width;

  return (
    <TouchableOpacity onPress={onPress}>
    <View style={{padding: 6, backgroundColor: colors.COLORS.WHITE, elevation: 2, borderRadius: 5}}>
      <View style={{marginBottom: spacing.SCALE_6}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>Kategoria: <Text style={{textTransform: 'uppercase', color: colors.TEXT.DEEP_BLUE, fontSize: typography.FONT_SIZE_9}}>{category}</Text></Text>
      </View>
      <View style={{marginBottom: 6}}>
        <Image source={linkImage} style={{width: widthX-12-10, height: 200, borderRadius: spacing.SCALE_5}} />
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{paddingHorizontal: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.DEEP_BLUE, alignItems: 'center', alignSelf: 'center', borderRadius: 30, backgroundColor: colors.COLORS.DEEP_BLUE, marginRight: 5}}>
                <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_10}}>IG: {indexGlycemic}</Text>
            </View>
            <View style={{paddingHorizontal: spacing.SCALE_6, borderWidth: 1, borderColor: colors.COLORS.LIGHT_BLUE, alignItems: 'center', alignSelf: 'center', borderRadius: 30, backgroundColor: colors.COLORS.LIGHT_BLUE}}>
                <Text style={{color: colors.TEXT.WHITE, fontSize: typography.FONT_SIZE_10}}>ŁG: {glycemicLoad}</Text>
            </View>
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <View>
                <MaterialCommunityIcons name='clock-time-four-outline' size={16} color={colors.COLORS.GREY_AAA} />
             </View>
            <Text style={{fontSize: typography.FONT_SIZE_12}}> {time} min</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create({
    title: {
        color: colors.COLORS.DEEP_BLUE,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: typography.FONT_SIZE_11,
    },
    category: {
        fontSize: typography.FONT_SIZE_9,
        color: colors.COLORS.GREY_777,
    }
})