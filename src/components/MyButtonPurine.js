import React from "react";
import {View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "../styles";


const widthDimensions = (Dimensions.get('window').width - 20) /4;

export const MyButton = ({icons, onPress, fontSize, borderColor, backgroundColor}) => (
    <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={[styles.buttonContainer, {backgroundColor: backgroundColor, borderColor: borderColor}]}>
            <MaterialCommunityIcons name={icons} color={colors.COLORS.WHITE} size={22} />
            
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
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: colors.TEXT.WHITE,
        paddingLeft: 6
    }
  });