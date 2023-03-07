import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography } from "../styles";
import { fontScale, scale, isTablet } from 'react-native-utils-scale';

//import { COLORS } from "../constants/colors";

const widthDimensions = (Dimensions.get('window').width - 20) /5;

export const MyButtonNoPay = ({icons, onPress, fontSize, borderColor, backgroundColor}) => (
    <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={[styles.buttonContainer, {backgroundColor: backgroundColor, borderColor: borderColor}]}>
            <MaterialCommunityIcons name={icons} color={colors.COLORS.WHITE} size={ isTablet ? spacing.SCALE_15 : spacing.SCALE_22} />
            
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: colors.COLORS.DEEP_BLUE,
        height: 40,
        width: widthDimensions,
        borderRadius: spacing.SCALE_5,
        //backgroundColor: '#224870',
        //backgroundColor: backgroundColor2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: typography.FONT_SIZE_16,
        color: colors.TEXT.WHITE,
        paddingLeft: spacing.SCALE_6
    }
  });