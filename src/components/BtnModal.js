import * as React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../styles';

export default function BtnModal({title, onPress, backgroundColor}) {
    return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, {backgroundColor: backgroundColor ? backgroundColor : colors.WHtR.WHtR_1}]}>
        <Text style={styles.modalBtnText}>{title}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        padding: spacing.SCALE_10, 
        borderRadius: spacing.SCALE_5,
    },
    modalBtnText: {
        fontSize: typography.FONT_SIZE_11,
        textTransform: 'uppercase',
        color: colors.TEXT.BLACK,
      }
});