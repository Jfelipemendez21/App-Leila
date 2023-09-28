import { Alert, ImageBackground, StyleSheet, Text, View} from 'react-native'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { addDoc ,collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { database } from '../credenciales';
import IngresosList from './IngresosList';

export default function Ingresos(props) {
    const {route} = props; 
    const {userEmail} = route.params; 
    const sharedBottomSheetRef= useRef(null)
    const [ingresos, setIngresos] = useState([])
    const [ingreso, setIngreso] = useState({
      createAt: new Date(),
      currentUser: userEmail,  
      nombre: "", 
      monto: 0, 
    }); 
    
    useEffect(()=>{
      
      const collectionRef = collection( database, "ingresos"); 
      const q= query(collectionRef, where('currentUser', '==', userEmail)) 
      // onSnapshot es un método proporcionado por Firebase Firestore en React Native (RN) que se utiliza para escuchar cambios en una colección de documentos o un documento específico en tiempo real
      const unsuscribe = onSnapshot(q, (querySnapshot) => {
        // le hacemos el map porque docs es un arreglo 
        setIngresos(querySnapshot.docs.map(doc => ({
          id: doc.id, 
          createAt: doc.data().createAt,
          currentUser: doc.data().currentUser, 
          nombre: doc.data().nombre,
          monto: doc.data().monto
        })))
      })
      return unsuscribe 
    }, [])

    function handlePresentShared(){
        // El método present() es una función proporcionada por el componente BottomSheetModal de @gorhom/bottom-sheet. Cuando se llama a este método en una instancia de BottomSheetModal, se hace que la hoja inferior se muestre en la interfaz de usuario, deslizándose desde la parte inferior de la pantalla.
        sharedBottomSheetRef.current?.present(); 
      }
  
    const guardarMonto= async ()=>{
      try{
        if(ingreso.nombre == "" || ingreso.monto == 0){
          Alert.alert("Hay campos vacios en el formulario", "¡No ha sido posible guardar el ingreso!")
        }else{
          await addDoc(collection(database, "ingresos"), ingreso)
          Alert.alert("¡Felicidades! ", "¡Su ingreso ha sido guardado con exito!")
          setIngreso({
            createAt: new Date(), 
            currentUser: userEmail, 
            nombre: "", 
            monto: 0, 
          })
        }
      }catch(err){
        Alert.alert("¡Ha ocurrido un error!", "¡No se ha podido guardar el ingreso!")
        console.log(err)
      }
      }
  return (
    <ImageBackground
    source={require('../assets/ingresos.jpg')} // Reemplaza esto con la ruta de tu imagen
    style={styles.imageBackground}
      >
      <TouchableOpacity style={styles.addButton} onPress={handlePresentShared}><Text style={styles.addButtonText}>Añadir un nuevo ingreso + </Text></TouchableOpacity>
      <BottomSheetModalProvider>
        <ScrollView>
          <View style={styles.container}>
          <Text style={styles.title}>Ingresos 🛒</Text>
          {/* <Text>Monto actual disponible 💰: 💲{montoAcumulado}.00 </Text> */}
          <Text style={styles.listTitle}>Lista de Ingresos 📋</Text>
          { ingresos.map((ingreso)=>
            <IngresosList key={ingreso.id} ingreso={{...ingreso}}/>
          )
          }
          <BottomSheetModal style={styles.bottomSheet} ref={sharedBottomSheetRef} 
              snapPoints={["50%"]}
              backgroundStyle={{borderRadius: 50, borderWidth: 4}}
              >
                <TextInput style={styles.input} placeholder='Nombre de la fuente del monto' onChangeText={(text)=>{
                  setIngreso({...ingreso, nombre: text})
                }}></TextInput>
                <TextInput style={styles.input} keyboardType='numeric' placeholder='Cantidad del monto' onChangeText={(text) => {
                    if (!isNaN(text)) {
                      setIngreso({ ...ingreso, monto: parseFloat(text) });
                    } else {
                      Alert.alert("El monto no es valido", "Solo se aceptan numeros")
                    }
                  }}
                ></TextInput>

                <TouchableOpacity style={styles.saveButton} onPress={guardarMonto}>
                  <Text style={styles.saveButtonText}>Guardar monto 📤</Text>
                </TouchableOpacity>
          </BottomSheetModal>
          </View>
          </ScrollView>
      </BottomSheetModalProvider>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la forma en que la imagen se ajusta al fondo (cover, contain, stretch, etc.)
    justifyContent: 'center', // Alinea el contenido verticalmente (center, flex-start, flex-end, etc.)
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(51, 25, 0, 0.4)', // Fondo blanco
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white', // Texto en color verde
    marginBottom: 10,
    // backgroundColor: "rgba(0, 100, 0, 1)",
    textAlign: "center",
    width: 300
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255, 0.9)', // Fondo verde para el botón
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: 330,
    borderColor: "#26ab0b",
    // borderWidth: 1
  },
  addButtonText: {
    color: '#26ab0b', // Texto en color blanco
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Texto en color verde
    marginBottom: 10,
  },
  bottomSheet: {
    backgroundColor: 'white', // Fondo blanco para el modal
    borderRadius: 50,
    // borderWidth: 4,
    // borderColor: 'green', // Borde en color verde
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'green', // Borde en color verde
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'green', // Fondo verde para el botón de guardar
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white', // Texto en color blanco
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
})