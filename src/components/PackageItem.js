import React, {useState} from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import { ENTITLEMENT_ID } from '../styles/constants';
import { colors, typography, spacing } from '../styles';


const PackageItem = ({ purchasePackage, setIsPurchasing }) => {
  const {
    product: { title, description, priceString },
  } = purchasePackage;

  const [userPro, setUserPro] = useState(false);

  const navigation = useNavigation();

  const onSelection = async () => {
    setIsPurchasing(true);

    try {
      //const { purchaserInfo } = await Purchases.purchasePackage(purchasePackage);
      const purchaseMade = await Purchases.purchasePackage(purchasePackage);

      //if (typeof purchaserInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined') {
      if (typeof purchaseMade.customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
        console.log("User is PRO");
        setUserPro(true);
        navigation.navigate('HomeScreen');
      }
    } catch (e) {
      if (!e.userCancelled) {
        console.log(e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };
  

  return (
    // <Pressable onPress={onSelection} style={styles.container}>
    //   <View style={styles.left}>
    //     <Text style={styles.title}>{title}</Text>
    //     <Text style={styles.terms}>{description}</Text>
    //   </View>
    //   <Text style={styles.title}>{priceString}</Text>
    // </Pressable>
    <View style={{marginBottom: spacing.SCALE_6 }}>
        <TouchableOpacity onPress={onSelection} style={{backgroundColor: colors.COLORS.WHITE, borderRadius: 5, padding: 3, elevation: 3}}>
            <View style={styles.container}>
                <View style={{flexDirection: 'column'}}>
                <Text style={styles.title}>{title.replace("(FitEat Pro. Indeks glikemiczny)", "")}</Text>
                {/* <Text style={styles.terms}>{description}</Text> */}
                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
                    <Text style={styles.prince}>{priceString}</Text>
                </View>

            </View>
        </TouchableOpacity>
    </View>
  );
};

export default PackageItem;

const styles = StyleSheet.create({
    container: {
      //flexDirection: 'row',
      justifyContent: 'space-between',
      //alignItems: 'center',
      flex: 1,
      padding: spacing.SCALE_6,
      backgroundColor: colors.COLORS.WHITE,
      //borderBottomWidth: 1,
      //borderBottomColor: colors.COLORS.GREY_CCC,
    },
    title: {
      color: colors.TEXT.DEEP_BLUE,
      fontSize: typography.FONT_SIZE_15,
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    prince: {
      color: colors.TEXT.GREY_777,
      fontSize: typography.FONT_SIZE_16,
      //fontWeight: 'bold',
    },
    terms: {
      color: 'darkgrey',
    },
  });