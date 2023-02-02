import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Button } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useTranslation } from 'react-i18next';
import { TEXT } from '../../styles/colors';

const OnboardingScreen = ({ navigation }) => {

    
    const {t, i18n} = useTranslation();
    
    const color = isLight => (isLight ? TEXT.BLACK : TEXT.WHITE);

    const Skip = ({isLight, ...props}) => (
        <View style={{marginLeft: 15}}>
            <TouchableOpacity {...props}>
                <Text style={{color: color(isLight), fontSize: 16}}>{t('onboarding-skip')}</Text>
            </TouchableOpacity>
        </View>
    );

    const Next = ({isLight, ...props}) => (
        <View style={{marginRight: 15}}>
            <TouchableOpacity {...props}>
                    <Text style={{color: color(isLight), fontSize: 16}}>{t('onboarding-next')}</Text>
            </TouchableOpacity>
        </View>
    );

    const Done = ({...props}) => (
        <View style={{marginRight: 15, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 12, borderRadius: 40}}>
            <TouchableOpacity {...props}>
                <Text style={{fontWeight: 'bold'}}>{t('onboarding-done')}</Text>
            </TouchableOpacity>
        </View>
    );
    
  return (
    <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        //DoneButtonComponent={Done}
        onSkip={() => navigation.navigate('Login')}
        onDone={() => navigation.navigate('Login')}
        transitionAnimationDuration={400}
        
        pages={[
            {
                backgroundColor: '#EFD35F',
                image: <Image source={require('../../assets/images/img3.png')} style={styles.image2} />,
                title: t('onboarding-title-1'),
                subtitle: t('onboarding-text-1'),
            },
            {
                backgroundColor: '#222E2E',
                image: <Image source={require('../../assets/images/img2.png')} style={styles.image2}/>,
                title: t('onboarding-title-2'),
                subtitle: t('onboarding-text-2'),
            },
            {
                backgroundColor: '#F5BCC5',
                image: <Image source={require('../../assets/images/img1.png')} style={styles.image3}/>,
                title: t('onboarding-title-3'),
                subtitle: t('onboarding-text-3'),
            },
        ]}
    />
    
  );
}

const styles = StyleSheet.create({
    image2: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height-280,
        resizeMode: 'stretch',
    },
    image3: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height-280,
        resizeMode: 'stretch',
        
        
    },
  });

export default OnboardingScreen