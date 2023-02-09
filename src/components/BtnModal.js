import * as React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../styles';

export default function BtnModal(props) {
    return (
    <TouchableOpacity onPress={props.onPress} style={styles.btn}>
        <Text style={styles.modalBtnText}>{props.title}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        padding: spacing.SCALE_10, 
        backgroundColor: colors.COLORS.GREY_DDD,
        borderRadius: spacing.SCALE_5
    },
    modalBtnText: {
        fontSize: typography.FONT_SIZE_10,
        textTransform: 'uppercase',
        color: colors.TEXT.DEEP_BLUE,
        fontWeight: 'bold'
      }
});