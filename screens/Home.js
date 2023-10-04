import { Text, StyleSheet, View, TouchableOpacity, Alert, ImageBackground} from 'react-native'
import React, {useEffect, useState, useLayoutEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth } from './Login';
import { signOut } from 'firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { collection, onSnapshot, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { database } from '../credenciales';


export default function Home(props){
  // El objeto route que ves en ese código es proporcionado automáticamente por React Navigation y contiene información sobre la pantalla actual, incluidos los parámetros de navegación pasados.
  const {route} = props; 
  const {userEmail} = route.params;  
  const [toggle, setToggle] = useState(false);
  const [actualizarRenderTotal, setActualizarRenderTotal] = useState(0);
  const [montos, setMontos] = useState([]);
  const [montoAcumulado, setMontoAcumulado]= useState(0)
  const [gastos, setGastos] = useState([]);
  const [gastosAcumulados, setGastosAcumulados]= useState(0)
  const [gastosHormiga, setGastosHormiga] = useState([]);
  const [gastosHormigaAcumulados, setGastosHormigaAcumulados]= useState(0)
  const [montosMeta, setMontosMeta] = useState([]);
  const [montoAcumuladoMeta, setMontoAcumuladoMeta]= useState(0)
  const [total, setTotal] = useState({
    montoAcumulado: montoAcumulado,
    montoAcumuladoMeta: montoAcumuladoMeta,
    montoTotal: 0
  });
  const navigation= useNavigation(); 

  const toggleOpcion = () => {
    if(!toggle){
        setToggle(true);
    }else{
        setToggle(false); 
    }
  };

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerRightContainerStyle: {
        backgroundColor: '#525FE1',
        marginRight: 10
      },
      headerRight: ()=> 
      <TouchableOpacity
        style={{
          marginRight: 5, // Ajusta el margen si es necesario
          backgroundColor: '#525FE1',
        }}
        onPress={async () => {
          await signOut(auth);
          Alert.alert('¡Adios!', 'Vuelva pronto');
          props.navigation.navigate('Login');
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: "bold", fontSize: 18 }}>Log out ←</Text>
      </TouchableOpacity>
      })
  },[])

  useEffect(()=>{
    Alert.alert("¡Bienvenid@ al home 🏡!", `${userEmail}!`)
  },[])

  useEffect(() => {
    const fetchIngresos = async () => {
      const collectionRef = collection(database, "ingresos");
      const q = query(collectionRef, where('currentUser', '==', userEmail));
      
      try {
        const querySnapshot = await getDocs(q);
        const montosQuery = querySnapshot.docs.map(doc => doc.data().monto);
        setMontos(montosQuery);
        // console.log("Monto acumulado: " +montos)
      } catch (error) {
        console.error("Error al obtener los montos de ingresos:", error);
      }
    };
  
    const fetchMetas = async () => {
      const collectionRef2 = collection(database, "metas");
      const q2 = query(collectionRef2, where('currentUser', '==', userEmail));
      
      try {
        const querySnapshot2 = await getDocs(q2);
        const montosQuery2 = querySnapshot2.docs.map(doc => ({
          monto: doc.data().monto,
          estado: doc.data().estado
        }));
        
        // Si montosQuery2 es un arreglo, verifica el estado de cada elemento
        const montosConEstadoTrue = montosQuery2.filter(item => item.estado === true);
        setMontosMeta(montosConEstadoTrue);

        // console.log("Montos meta: " + montosMeta)
      } catch (error) {
        console.error("Error al obtener los montos de metas:", error);
      }
    };

    const fetchGastos = async () => {
      const collectionRef2 = collection(database, "gastosImportantes");
      const q2 = query(collectionRef2, where('currentUser', '==', userEmail));
      
      try {
        const querySnapshot = await getDocs(q2);
        const montosQuery = querySnapshot.docs.map(doc => doc.data().monto);
        setGastos(montosQuery);
        // console.log("Gastos importantes: " +gastos)
      } catch (error) {
        console.error("Error al obtener los montos de gastos importantes:", error);
      }
    };

    const fetchGastosHormiga = async () => {
      const collectionRef2 = collection(database, "gastosHormiga");
      const q2 = query(collectionRef2, where('currentUser', '==', userEmail));
      
      try {
        const querySnapshot = await getDocs(q2);
        const montosQuery = querySnapshot.docs.map(doc => doc.data().monto);
        setGastosHormiga(montosQuery);
        // console.log("Gastos hormiga: " +gastosHormiga)
      } catch (error) {
        console.error("Error al obtener los montos de gastos hormiga:", error);
      }
    };
    fetchIngresos();
    fetchMetas();
    fetchGastosHormiga(); 
    fetchGastos(); 

  }, [actualizarRenderTotal]);


  useEffect(() => {
    const montoAcumuladoCalculado = montos.reduce((a, b) => a + b, 0);
    setMontoAcumulado(montoAcumuladoCalculado);

    const montoAcumuladoMetaCalculado = montosMeta.reduce((a, b) => a + b.monto, 0);
    setMontoAcumuladoMeta(montoAcumuladoMetaCalculado);

    const montoAcumuladoGastoCalculado = gastos.reduce((a, b) => a + b, 0);
    setGastosAcumulados(montoAcumuladoGastoCalculado);

    const montoAcumuladoGastoHormigaCalculado = gastosHormiga.reduce((a, b) => a + b, 0);
    setGastosHormigaAcumulados(montoAcumuladoGastoHormigaCalculado);

    // console.log(" Gastos hormiga: "+ gastosHormigaAcumulados+ " Gastos import: " +gastosAcumulados+ " Ingresos: " +montoAcumulado+ " Monto metas: " +montosMeta )

  }, [montos, montosMeta, gastos, gastosHormiga]);


  useEffect(()=>{
    const ActualizarTotal= async()=>{
      setTotal({
        montoAcumulado:{...montoAcumulado + montoAcumulado},
        montoAcumuladoMeta: {...montoAcumuladoMeta + montoAcumuladoMeta},
        gastosAcumulados:{ ...gastosAcumulados + gastosAcumulados},
        gastosHormigaAcumulados:{ ...gastosHormigaAcumulados + gastosHormigaAcumulados},
        montoTotal: montoAcumulado - (montoAcumuladoMeta + gastosAcumulados + gastosHormigaAcumulados)
      })
    }
    ActualizarTotal(); 
  },[montoAcumulado, montoAcumuladoMeta, gastosAcumulados, gastosHormigaAcumulados])
  
  const actualizarRender=()=>{
    setActualizarRenderTotal(actualizarRenderTotal + 1)
  }

    return (
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/semaforo.jpg')} // Reemplaza esto con la ruta de tu imagen
            style={styles.imageBackground}
          >
          <Text style={styles.montoActual}> ✅ Monto actual disponible 💰 <Text style={styles.montoText}> ${total.montoTotal}.00 </Text> </Text>
          <TouchableOpacity style={styles.actualizar} onPress={actualizarRender}><Text style={styles.actualizarText}>Actualizar 🔄</Text></TouchableOpacity>
          <View style={styles.containerMenu}>
          <TouchableOpacity style={styles.menuButton} onPress={()=>{
            navigation.navigate("SectionGoals", {userEmail: userEmail, montoAcumulado: total.montoTotal})
          }}>
            <Text style={styles.menu} >Metas 🪁</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.menuButton} onPress={()=>{
            navigation.navigate("Ingresos", {userEmail: userEmail, montoAcumulado: total.montoTotal})
          }}>
            <Text style={styles.menu}>Ingresos 💰</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.menuButton} onPress={()=>{
              navigation.navigate("Chart", {montoAcumulado: montoAcumulado, gastosAcumulados: gastosAcumulados, gastosHormigaAcumulados: gastosHormigaAcumulados})
            }}>
            <Text style={styles.menu}>Dashboard 📊</Text>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.menuButton} onPress={()=>{
            toggleOpcion(); 
          }}>
            <Text style={styles.menu}>Gastos 💸</Text>
          </TouchableOpacity>
          {toggle && 
          <View style={styles.containerGastos}>
            <TouchableOpacity style={styles.menuButtonGastos} onPress={()=>{
              navigation.navigate("GastosImportantes", {userEmail: userEmail, montoAcumulado: total.montoTotal})
            }}><Text style={styles.menu}>Importantes</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuButtonGastos} onPress={()=>{
              navigation.navigate("GastosHormiga", {userEmail: userEmail, montoAcumulado: total.montoTotal})
            }}><Text style={styles.menu}>Hormiga</Text></TouchableOpacity>
          </View>
          }
          </View>
          </ImageBackground>
        </View>
    )
    }

const styles = StyleSheet.create({
  container:{
    height: "100%", // Alinea el contenido horizontalmente (center, flex-start, flex-end, etc.)
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la forma en que la imagen se ajusta al fondo (cover, contain, stretch, etc.)
    // justifyContent: 'center', // Alinea el contenido verticalmente (center, flex-start, flex-end, etc.)
    alignItems: 'center',
    paddingTop: 30
  },
  containerMenu:{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 30,
    justifyContent: "space-around"
  },
  montoActual:{
    fontStyle: "italic",
    fontSize: 20,
    textAlign: "center",
    margin: 15,
    fontWeight: "bold",
    color: "white"
  },
  montoText:{
    fontSize: 30,
    color: "#aaf124",
  },
  actualizarText:{
    fontSize: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#00c4d3",
    color: "#00c4d3",
    // height: 70,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 20
  },
  actualizar:{
    justifyContent: "center",
    textAlign: "center",
    width: "60%",
    padding: 15,
  },
  menu:{
    fontSize: 19,
    color: "#ffffff",
    fontStyle: "italic",
    textAlign: "center"
  },
  menuButton:{
    justifyContent: "center",
    margin: 10,
    backgroundColor:"rgba(82, 95, 225, 0.8)",
    width: "40%",
    height: 58,
    borderRadius: 5,
  },
  menuButtonGastos:{
    justifyContent: "center",
    margin: 1,
    backgroundColor:"rgba(82, 95, 225, 0.8)",
    width: "100%",
    height: 58,
    // borderRadius: 5,
  },
  containerGastos:{
    width: "35%",
    position: "absolute",
    right: 27,
    top: 146,
    backgroundColor: "rgba(255, 255, 255, 1)",
    alignItems: "center"
  },
  cerrarSesion:{
    backgroundColor: "#000000"
  }

})