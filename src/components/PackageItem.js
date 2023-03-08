import React, {useState, useEffect, useContext } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import { ENTITLEMENT_ID } from '../styles/constants';
import { colors, typography, spacing } from '../styles';
import { AuthContext } from '../navigation/AuthProvider';

const PackageItem = ({ purchasePackage, setIsPurchasing }) => {
  const {
    product: { title, description, priceString, identifier },
  } = purchasePackage;

  const {user} = useContext(AuthContext);
  const [userPro, setUserPro] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  // Wybor subskrypcji
  const onSelection = async () => {
    setIsPurchasing(true);

    try {
      const purchaseMade = await Purchases.purchasePackage(purchasePackage);

      if (typeof purchaseMade.customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
        console.log("User is PRO");
        setUserPro(true);
      }
    } catch (e) {
      if (!e.userCancelled) {
        console.log(e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const [activated, setActivated] = useState([]);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [loading, setLoading] = useState(true);
       
       const identyfikator = async () => {
        
         try {
           const customerInfo = await Purchases.getCustomerInfo();
           setActivated(customerInfo.activeSubscriptions)
   
         } catch (e) {
          // Error fetching customer info
         }
        
       }
     useEffect(() => {
      identyfikator();
    
      const unsubscribe = navigation.addListener("focus", () => setLoading(!loading));
      return unsubscribe;
      
     }, [navigation, loading, subscriptionActive]);

      const getUserDetails = async () => {
      setUserId(user.uid);
  
      const customerInfo = await Purchases.getCustomerInfo();
      setSubscriptionActive(typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined');
    };
  
    useEffect(() => {
      getUserDetails();
    }, []);
  
    useEffect(() => {
      // Subscribe to purchaser updates
      Purchases.addCustomerInfoUpdateListener(getUserDetails);
      return () => {
        Purchases.removeCustomerInfoUpdateListener(getUserDetails);
      };
    });
   

  return (
   
    <View style={{marginBottom: spacing.SCALE_6, flex:1, marginLeft: spacing.SCALE_3, marginRight: spacing.SCALE_3 }}>
        <TouchableOpacity onPress={onSelection} style={{backgroundColor: String(activated) === identifier && subscriptionActive ? colors.COLORS.LIGHT_GREY2 : colors.COLORS.DEEP_BLUE, borderRadius: spacing.SCALE_5, padding: spacing.SCALE_3, elevation: 4}}>
            <View style={[styles.container, {backgroundColor: String(activated) === identifier && subscriptionActive ? colors.COLORS.LIGHT_GREY2 : colors.COLORS.DEEP_BLUE}]}>
                <View style={{flexDirection: 'column'}}>
                  
                  
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.prince, {color: String(activated) === identifier && subscriptionActive ? colors.TEXT.GREY_AAA : colors.TEXT.WHITE}]}>{priceString}</Text>
                </View>

               <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[styles.terms, {color: String(activated) === identifier && subscriptionActive ? colors.TEXT.GREY_AAA : colors.TEXT.YELLOW}]}>{description}</Text>
                  </View>
                
                </View>
                
            </View>
        </TouchableOpacity>
    </View>
  );
};

export default PackageItem;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flex: 1,
      padding: spacing.SCALE_3,
      backgroundColor: colors.COLORS.LIGHT_BLUE,
    },
    title: {
      color: colors.TEXT.WHITE,
      fontSize: typography.FONT_SIZE_12,
      textTransform: 'uppercase',
      marginTop: spacing.SCALE_6
    },
    prince: {
      color: colors.TEXT.WHITE,
      fontSize: typography.FONT_SIZE_20
    },
    terms: {
      color: colors.TEXT.YELLOW,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginTop: spacing.SCALE_3,
      fontSize: typography.FONT_SIZE_12,
    },
  });