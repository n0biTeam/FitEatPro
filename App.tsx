import React, { useEffect, useContext } from 'react';
import Providers from './src/navigation';
import { LogBox } from 'react-native';
import Purchases from 'react-native-purchases';
import { API_KEY } from './src/styles/constants';

LogBox.ignoreAllLogs();

const App = () => {


  // useEffect(() => {
  //   Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  //   Purchases.configure({apiKey: API_KEY, appUserID: null, observerMode: false, useAmazon: false});
  // },[]);

  return <Providers />;
}

export default App;