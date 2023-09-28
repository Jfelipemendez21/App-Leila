// rncs es un atajo para un Component react-native con estilos 
import { Text, StyleSheet, View, Image, TextInput, Alert } from 'react-native'
import React, {useState} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'; 
import app from "../credenciales";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getReactNativePersistence} from "firebase/auth"; 

// esta configuracion del auth es para mantener la sesion iniciada a pesar de salir de la aplicacion 
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
// export const auth= getAuth(app)
export default function Login(props){

    const [login, setLogin] = useState(true); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 

    const logueoAndRegistro= async ()=>{
            if(login){
                try{
                    await signInWithEmailAndPassword(auth, email, password)
                    // setEmail("");
                    // setPassword("");
                    Alert.alert("¡Iniciando sesion!", "Espere un momento...")
                    props.navigation.navigate("Home", {userEmail: email})
                }catch (error) {
                    Alert.alert("¡Error al iniciar sesion!", "El correo o la contraseña estan errados."); 
                }
            }
            else{
                try{
                    await createUserWithEmailAndPassword(auth, email, password);    
                    Alert.alert("Solicitud con exito!", "El usuario ha sido creado de forma correcta");
                    setEmail("");
                    setPassword("");
                    // para que se ponga todo en la interfaz de login 
                    setLogin(true);
                    props.navigation.navigate("Login");
                }catch (error) {
                    Alert.alert("¡Ha ocurrido un error!", "Intentelo nuevamente"); 
                }
            } 
        }
    return (
      <View style={styles.padre}>
        <Text style={styles.titulo}>{login ? "Login" : "Registro"}</Text>    
        <View>
        <Image source={require("../assets/iconUser.png")} style={styles.imgProfile}/>
        </View>

        <View style={styles.tarjeta}>
            <View style={styles.cajaTexto}>
                <TextInput value={email} placeholder="Ejemplo@gmail.com" onChangeText={(textActual)=>{
                    setEmail(textActual); 
                }}/>
            </View>
            
            <View style={styles.cajaTexto}>
                <TextInput value={password} placeholder="Password" secureTextEntry={true} onChangeText={(textActual)=>{
                    setPassword(textActual); 
                }}/>
            </View>
            
            <View style={styles.padreButton}>
                <TouchableOpacity style={styles.cajaButton} onPress={logueoAndRegistro} email={email}>
                    <Text style={styles.textButtonn}>{login ? "Sing In" : "Sing Up"}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.enlace}>
                <TouchableOpacity onPress={()=>{
                    setLogin( login ? false : true )
                    setEmail("");
                    setPassword("");
                    
                }}>
                    <Text style={styles.texto}>{login ? "Registrate" : "Iniciar sesion"}</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    )
  }

const styles = StyleSheet.create({
    padre: {
        flex:1, 
        justifyContent: "center",
        alignItems: "center", 
        backgroundColor: "white"
    },
    imgProfile:{
        width: 100,
        height: 100,
        borderRadius: 50, 
        borderColor: "white",
    },
    tarjeta: {
        margin: 20, 
        backgroundColor:"white", 
        borderRadius: 20, 
        width: "90%", 
        padding: 20, 
        shadowColor: "#000", 
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity:0.25, 
        shadowRadius: 4,
        elevation:5 
    }, 
    cajaTexto:{
        padding:10,
        backgroundColor: "#cccccc40",
        borderRadius: 30, 
        marginVertical: 10,
    },
    padreButton:{
        alignItems: "center",
    },
    cajaButton:{
        backgroundColor: "#525fE1",
        borderRadius: 30,
        paddingVertical: 20, 
        width: 150, 
        marginTop: 20
    },
    textButtonn:{
        textAlign: "center",
        color: "white"
    },
    enlace:{
        alignItems: "center",
        padding: 10, 
        marginTop: 10,
    },
    texto:{
        textDecorationLine: 'underline',
    },
    titulo:{
        fontSize: 32,
        padding: 10,
        marginBottom: 20,
        fontWeight: "bold",
        color: "grey",
    }

})