import { Alert, StyleSheet, Text, View, ImageBackground, ScrollView } from 'react-native'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import React, { useRef, useState, useEffect } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { addDoc ,collection, onSnapshot, query, where } from 'firebase/firestore';
import { database } from '../credenciales';
import GastosImportantesList from './GastosImportantesList';

export default function GastosImportantes(props) {
    const {route} = props; 
    const {userEmail, montoAcumulado} = route.params; 
    const sharedBottomSheetRef= useRef(null)
    const [gastos, setGastos] = useState([])
    const [gastoImportante, setGastoImportante] = useState({
      createAt: new Date(),
      currentUser: userEmail,  
      nombre: "", 
      monto: 0, 
    }); 
    
    useEffect(()=>{
      
      const collectionRef = collection( database, "gastosImportantes"); 
      const q= query(collectionRef, where('currentUser', '==', userEmail)) 
      // onSnapshot es un método proporcionado por Firebase Firestore en React Native (RN) que se utiliza para escuchar cambios en una colección de documentos o un documento específico en tiempo real
      const unsuscribe = onSnapshot(q, (querySnapshot) => {
        // le hacemos el map porque docs es un arreglo 
        setGastos(querySnapshot.docs.map(doc => ({
          id: doc.id, 
          createAt: doc.data().createAt,
          currentUser: doc.data().currentUser, 
          monto: doc.data().monto,
          nombre: doc.data().nombre
        })))
      })
      return unsuscribe 
    }, [])

    function handlePresentShared(){
        // El método present() es una función proporcionada por el componente BottomSheetModal de @gorhom/bottom-sheet. Cuando se llama a este método en una instancia de BottomSheetModal, se hace que la hoja inferior se muestre en la interfaz de usuario, deslizándose desde la parte inferior de la pantalla.
        sharedBottomSheetRef.current?.present(); 
      }
  
    const guardarGastoImportante= async ()=>{
      try{
        if(gastoImportante.nombre == "" || gastoImportante.monto == 0){
          Alert.alert("Hay campos vacios en el formulario", "¡No ha sido posible guardar el gasto!")
        }else{
          if(gastoImportante.monto <= montoAcumulado){
            await addDoc(collection(database, "gastosImportantes"), gastoImportante)
            Alert.alert("¡Su gasto ha sido guardado con exito!")
            setGastoImportante({
              createAt: new Date(), 
              currentUser: userEmail, 
              nombre: "", 
              monto: 0, 
            })
          }else{
              Alert.alert("¡Sigue esforzandote!", "Tu monto no cuenta con el dinero necesario para cumplir esta meta!")
          }
        }
      }catch(err){
        Alert.alert("¡Ha ocurrido un error!", "¡No se ha podido guardar el gasto!")
        console.log(err)
      }
      }
  return (
    <ImageBackground 
      source={require('../assets/bus.jpg')} // Reemplaza esto con la ruta de tu imagen
      style={styles.imageBackground}>
      <TouchableOpacity style={styles.addButton} onPress={handlePresentShared}><Text style={styles.addButtonText}>Añadir un nuevo gasto + </Text></TouchableOpacity>
      <BottomSheetModalProvider>
      <ScrollView>
          <View style={styles.container}>
          <Text style={styles.header}>Gastos Importantes</Text>
          <Text style={styles.subheader}>Lista de gastos importantes 📋</Text>
          { gastos.map((gasto)=>
            <GastosImportantesList key={gasto.id} gasto={{...gasto}}/>
          )
          }
          <BottomSheetModal ref={sharedBottomSheetRef} 
              snapPoints={["50%"]}
              backgroundStyle={{borderRadius: 50, borderWidth: 4}}
              >
                <TextInput style={styles.input} placeholder='Nombre gasto' onChangeText={(text)=>{
                  setGastoImportante({...gastoImportante, nombre: text})
                }}></TextInput>
                <TextInput style={styles.input} keyboardType='numeric' placeholder='Cantidad del monto gastado' onChangeText={(text) => {
                    if (!isNaN(text)) {
                      setGastoImportante({ ...gastoImportante, monto: parseFloat(text) });
                    } else {
                      Alert.alert("El monto no es valido", "Solo se aceptan numeros")
                    }
                  }}
                ></TextInput>

                <TouchableOpacity style={styles.saveButton} onPress={guardarGastoImportante}>
                  <Text style={styles.saveButtonText}>Guardar gasto 📤</Text>
                </TouchableOpacity>
          </BottomSheetModal>
          </View>
      </ScrollView>  
      </BottomSheetModalProvider>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(129, 77, 20, 0.3)', 
    padding: 20,
    // marginHorizontal: 10
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la forma en que la imagen se ajusta al fondo (cover, contain, stretch, etc.)
    justifyContent: 'center', // Alinea el contenido verticalmente (center, flex-start, flex-end, etc.)
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: '#d2edfe', // Azul violeta
    marginBottom: 10,
    position: "relative",
    right: 20,
    textAlign: "center",
    backgroundColor: "rgba(129, 77, 20, 0.7)",
    width: "120%"
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#352008', // Azul violeta
    marginTop: 10,
    marginBottom: 10,
  },
  addButton: {
    fontSize: 16,
    color: '#ffffff',
    borderRadius: 10,
    padding: 10, 
    backgroundColor: "rgba(240, 160, 18, 0.8)",
    margin: 10,
    width: 300,
  },
  addButtonText:{
    textAlign: "right",
    fontWeight: "bold",
    color: "white"
  },
  modalBackground: {
    borderRadius: 50,
    borderWidth: 4,
  },
  input: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#352008', // Azul violeta
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#352008', // Azul violeta
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    margin:10
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
})