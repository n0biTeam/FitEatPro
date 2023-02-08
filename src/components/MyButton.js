import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import { COLORS } from "../constants/colors";

const widthDimensions = (Dimensions.get('window').width - 20) /6;

export const MyButton = ({icons, onPress, fontSize, borderColor, backgroundColor}) => (
    <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={[styles.buttonContainer, {backgroundColor: backgroundColor, borderColor: borderColor}]}>
            <MaterialCommunityIcons name={icons} color='#FFF' size={22} />
            
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: '#224870',
        height: 40,
        width: widthDimensions,
        borderRadius: 5,
        //backgroundColor: '#224870',
        //backgroundColor: backgroundColor2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: '#fff',
        paddingLeft: 6
    }
  });