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
        //navigation.navigate('HomeScreen');
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
    <View style={{marginBottom: spacing.SCALE_6, flex:1, marginLeft: spacing.SCALE_3, marginRight: spacing.SCALE_3 }}>
        <TouchableOpacity onPress={onSelection} style={{backgroundColor: colors.COLORS.LIGHT_BLUE, borderRadius: 5, padding: 3, elevation: 3}}>
            <View style={styles.container}>
                <View style={{flexDirection: 'column'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.prince}>{priceString}</Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                   <Text style={styles.title}>{title.replace("(FitEat Pro. Indeks glikemiczny)", "").replace("Subskrypcja", "")}</Text>
                </View>
               
                {/* <Text style={styles.terms}>{description}</Text> */}
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
      backgroundColor: colors.COLORS.LIGHT_BLUE,
      //borderBottomWidth: 1,
      //borderBottomColor: colors.COLORS.GREY_CCC,
    },
    title: {
      color: colors.TEXT.WHITE,
      fontSize: typography.FONT_SIZE_12,
      //fontWeight: 'bold',
      textTransform: 'uppercase',
      marginTop: spacing.SCALE_6
    },
    prince: {
      color: colors.TEXT.WHITE,
      fontSize: typography.FONT_SIZE_20,
      fontWeight: 'bold',
    },
    terms: {
      color: 'darkgrey',
    },
  });