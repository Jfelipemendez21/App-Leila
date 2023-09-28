// import { AppRegistry, Platform } from "react-native";
// import { registerRootComponent } from "expo";
// import App from "./App";
// import config from "./app.config.js";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately

import { initializeApp } from "firebase/app";
// el objeto Constants se utiliza para acceder a información y configuraciones específicas del dispositivo en el que se está ejecutando la aplicación.
import Constants from "expo-constants";
import {getFirestore} from "firebase/firestore";

// const appName = config.expo.name; 

// if (Platform.OS == "android") {
//   registerRootComponent(App);
// } else {
//   AppRegistry.registerComponent(appName, () => App);
// }

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId
};

const app = initializeApp(firebaseConfig);

// Se utiliza para inicializar y exportar una instancia de la base de datos Firestore de Firebase en una aplicación.
export const database= getFirestore(); 

export default app;  