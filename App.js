import { StyleSheet} from 'react-native';
// este import es esencial para habilitar la navegación basada en gestos en aplicaciones React Native que utilizan bibliotecas de navegación como react-navigation.
import 'react-native-gesture-handler'; 
// el createStackNavigator es el enrutador
import { createStackNavigator } from '@react-navigation/stack';
// el NavigationContainer es para envolver y encapsular la aplicacion
import { NavigationContainer } from '@react-navigation/native';
import Login from "./screens/Login";
import Home from "./screens/Home";
import SectionGoals from './screens/SectionGoals';
import Ingresos from './screens/Ingresos';
import GastosImportantes from './screens/GastosImportantes';
import GastosHormiga from './screens/GastosHormiga';
import Chart from './screens/Chart';
// import {Notifications} from 'expo';
// import * as Permissions from "expo-permissions"; 
// import { useEffect } from 'react';

// const getToken= async ()=>{
//   // traer el estatus de los permisos para enviar las notificaciones 
//   const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS); 

//   if(status !== "granted"){
//     return; 
//   }else{
//     const token= await Notifications.getExpoPushTokenAsync(); 
//     console.log(token);
//     return token; 
//   }
// }

export default function App() {
  const Stack = createStackNavigator();

function MyStack() {

  // useEffect(()=>{
  //   getToken(); 
  // },[])
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{
        title: "Bienvenido a Leila",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#525FE1"},
        presentation: "modal"
      }} />
      <Stack.Screen name="Ingresos" component={Ingresos} options={{
        title: "",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#076b37"},
        presentation: "modal"
      }}/>
      <Stack.Screen name="Home" component={Home} options={{
        title: "",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#525FE1"},
        presentation: "modal"
      }}/>
      <Stack.Screen name="SectionGoals" component={SectionGoals} options={{
        title: "",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#349af2"},
        presentation: "modal"
      }}/>
      <Stack.Screen name="GastosImportantes" component={GastosImportantes} options={{
        title: "",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#352008"},
        presentation: "modal"
      }}/>
      <Stack.Screen name="GastosHormiga" component={GastosHormiga} options={{
        title: "",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "#140b47"},
        presentation: "modal"
      }}/>
      <Stack.Screen name="Chart" component={Chart} options={{
        title: "",
        headerTintColor: "white",
        headerTitleAlign: "center",
        headerStyle: {backgroundColor: "rgba(52, 47, 102, 1)"},
        presentation: "modal"
      }}/>
    </Stack.Navigator>
  );
 }
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
