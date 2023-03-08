import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../styles';

export default function ItemBigList({value, unit, backgroundColor, width}) {
    return (
    <View style={[
        styles.containerView,
         { backgroundColor: backgroundColor ? backgroundColor : colors.WHtR.WHtR_1,
           width: width ? width : 70
         }]}
        >
        <Text style={styles.textItem}>{value} {unit}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    containerView: {
        paddingVertical: 3,
        width: 70,
        borderRadius: spacing.SCALE_5,
        alignItems: 'flex-end',
        paddingRight: spacing.SCALE_6
    },
    textItem: {
        color: colors.COLORS.GREY_333,
        fontWeight: 'bold'
    }
})