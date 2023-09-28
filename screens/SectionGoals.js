import { Text, TextInput, StyleSheet, View, TouchableOpacity, Alert, ScrollView, ImageBackground} from 'react-native'
import React, {useEffect, useState, useRef} from 'react';
import { useNavigation } from '@react-navigation/native';
import { addDoc ,collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { database } from '../credenciales';
import GoalsList from './GoalsList';
import { BottomSheetModalProvider, BottomSheetModal } from '@gorhom/bottom-sheet';

export default function SectionGoals(props) {

    const {route} = props; 
    const {userEmail, montoAcumulado} = route.params;  
    const navigation= useNavigation(); 
    const [day, setDay] = useState(0)
    const [month, setMonth] = useState(0)
    const [year, setYear] = useState(0)
    const [dataMeta, setDataMeta] = useState({
      currentUser: userEmail,
      createdAt: new Date(),  
      monto:0,
      nombre:"",
      plazo: Date(),
      estado: false
    })
    const [metasSinTerminar, setMetasSinTerminar] = useState([]);
    const [metas, setMetas] = useState([]); 
    const metaFilter= metas.filter((meta)=>meta.estado == false);
    const sharedBottomSheetRef= useRef(null)
    const [historial, setHistorial] = useState(false)


    function handlePresentShared(){
        // El método present() es una función proporcionada por el componente BottomSheetModal de @gorhom/bottom-sheet. Cuando se llama a este método en una instancia de BottomSheetModal, se hace que la hoja inferior se muestre en la interfaz de usuario, deslizándose desde la parte inferior de la pantalla.
        sharedBottomSheetRef.current?.present(); 
      }
    
    
    useEffect(() => {
        if(metasSinTerminar.length == 0 && metas.length > 0){
            const metasSinTerminarData = metas.filter(meta => !meta.estado);
            setMetasSinTerminar(metasSinTerminarData);
        }else{
            setMetasSinTerminar([])
        }
    }, [metas])
    
    useEffect(()=>{
      
      const collectionRef = collection( database, "metas"); 
      const q= query(collectionRef, where('currentUser', '==', userEmail)) 
      // onSnapshot es un método proporcionado por Firebase Firestore en React Native (RN) que se utiliza para escuchar cambios en una colección de documentos o un documento específico en tiempo real
      const unsuscribe = onSnapshot(q, (querySnapshot) => {
        // le hacemos el map porque docs es un arreglo 
        setMetas(querySnapshot.docs.map(doc => ({
          id: doc.id, 
          currentUser: doc.data().currentUser, 
          createdAt: doc.data().createdAt,
          estado: doc.data().estado, 
          monto: doc.data().monto, 
          nombre: doc.data().nombre,
          plazo: doc.data().plazo
        })))
      })
      return unsuscribe 
    }, [])

    // useLayoutEffect es un gancho (hook) en React que se utiliza para realizar efectos secundarios después de que se ha realizado la renderización de un componente y antes de que los cambios resultantes sean visibles en la pantalla. Es similar a useEffect, pero se ejecuta de forma síncrona después de la renderización

  
    const guardarMeta = async ()=>{
      try {
        if(dataMeta.monto == "" || dataMeta.nombre == "" || dataMeta.plazo == ""){
          Alert.alert("¡Alguno de los campos esta vacio!", "Intentelo nuevamente"); 
        }else{
          await addDoc(collection(database, "metas"),dataMeta);
          Alert.alert("Se ha añadido una nueva meta", "¡Mucha suerte!"); 
          setDataMeta({
            currentUser: userEmail,
            createdAt: new Date(),  
            monto:0,
            nombre:"",
            plazo:"",
            estado: false
          })
        }
      } catch (error) {
        Alert.alert("¡Ha ocurrido un error al crear la meta!", "Intentelo nuevamente"); 
      }
    }

  return (
    <ImageBackground
      source={require('../assets/metas.jpg')} // Reemplaza esto con la ruta de tu imagen
      style={styles.imageBackground}
      >
      {/* <Text>Monto acumulado 💰: ${montoAcumulado}.00 </Text> */}
      {console.log(montoAcumulado)}
      <TouchableOpacity style={styles.addButton} onPress={handlePresentShared}><Text style={styles.addButtonText}>Añade una nueva meta +</Text></TouchableOpacity>
    <BottomSheetModalProvider>
    <ScrollView>
      <View style={styles.container}>
          {
            metasSinTerminar.length <= 2
            ?
            <BottomSheetModal ref={sharedBottomSheetRef} 
            snapPoints={["85%"]}
            backgroundStyle={{borderRadius: 50, borderWidth: 4}}
            >
              <TextInput style={styles.input} placeholder='Añade un nombre a tu meta' onChangeText={(text)=>{setDataMeta({...dataMeta, nombre: text})}} />
            <TextInput style={styles.input} keyboardType='number-pad' placeholder='Añade un monto' onChangeText={(text) => {
                  if (!isNaN(text)) {
                    setDataMeta({ ...dataMeta, monto: parseFloat(text) });
                  } else {
                    Alert.alert("El monto no es valido", "Solo se aceptan numeros")
                  }
                }} />
            <Text style={styles.dateInput} >Fecha meta:</Text>
            <TextInput style={styles.input} keyboardType='number-pad' placeholder='dia' onChangeText={ (text)=>{setDay(text)}} />
            <TextInput style={styles.input} keyboardType='number-pad' placeholder='mes' onChangeText={ (text)=>{setMonth(text)}} />
            <TextInput style={styles.input} keyboardType='number-pad' placeholder='año' onChangeText={ (text)=>{
              setYear(text)}} /> 
            <TouchableOpacity style={styles.dateButton} onPress={ async ()=>{
                setDataMeta({...dataMeta , plazo:new Date(`${year}-${month}-${day}`)})
                if(day != 0 && month != 0 && year != 0){
                  Alert.alert("¡Se establecio la fecha satisfactoriamente!")
                }else{
                  Alert.alert("¡Debes llenar todos los campos de la fecha!")
                }
              }}>
                <Text style={styles.dateButtonText}>Establecer fecha 📅</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}
                onPress={guardarMeta}> 
                <Text style={styles.saveButtonText}>Guardar Meta 🪁</Text>
              </TouchableOpacity>
            </BottomSheetModal>
            : 
            <BottomSheetModal ref={sharedBottomSheetRef} 
            snapPoints={["60%"]}
            backgroundStyle={{borderRadius: 50, borderWidth: 4}}
            >
            <Text style={styles.metaDontSave}>Debe culminar alguna de sus metas antes de poder agregar una nueva ❗</Text>
            <TextInput style={styles.input} editable={false} keyboardType='number-pad' placeholder='Añade un monto' onChangeText={(text) => {
                  if (!isNaN(text)) {
                    setIngreso({ ...ingreso, monto: parseFloat(text) });
                  } else {
                    Alert.alert("El monto no es valido", "Solo se aceptan numeros")
                  }
                }} />
            <TextInput style={styles.input} editable={false}  placeholder='Añade un nombre a tu meta' onChangeText={(text)=>{setDataMeta({...dataMeta, nombre: text})}} />
            <TextInput style={styles.input} editable={false}  keyboardType='number-pad' placeholder='Añade los dias de plazo para su cumplimiento' onChangeText={ (text)=>{setDataMeta({...dataMeta , plazo:text})}} />
            <TouchableOpacity 
              style={styles.disabledButton}
              disabled={true}> 
                <Text style={styles.disabledButtonText}>No se pueden guardar mas metas ⛔</Text>
              </TouchableOpacity>
            </BottomSheetModal>
          }

          <Text style={styles.metaText}>Metas pendientes 📅</Text>
          {metaFilter.length > 0
          ?
            metaFilter.map((meta)=><GoalsList key={meta.id} meta={{...meta}} montoAcumulado={montoAcumulado}/>)
          :
            <Text style={{color:"#fbff79", padding: 20}}>No hay metas pendientes!</Text>
          }
          <TouchableOpacity onPress={()=>{setHistorial(!historial)}}><Text style={styles.historicalMetaText}>Historial de metas 🗃️</Text></TouchableOpacity>
          {
            historial && metas.map((meta)=><GoalsList key={meta.id} meta={{...meta}}/>)
          }
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Fondo semitransparente
    padding: 30,
    margin: 10
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.8)', // Color de fondo del botón
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "90%"
  },
  addButtonText: {
    textAlign: "right",
    color: '#1E90FF', // Color del texto del botón
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10
  },
  dateButton: {
    backgroundColor: '#1E90FF', // Color de fondo del botón de fecha
    padding: 10,
    borderRadius: 5,
    margin: 10
  },
  dateButtonText: {
    color: 'white', // Color del texto del botón de fecha
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#32CD32', // Color de fondo del botón de guardar
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10
  },
  saveButtonText: {
    color: 'white', // Color del texto del botón de guardar
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc', // Color de fondo del botón deshabilitado
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10
  },
  disabledButtonText: {
    color: 'white', // Color del texto del botón deshabilitado
    fontSize: 16,
    fontWeight: 'bold',
  },
  metaText: {
    fontSize: 25,
    marginBottom: 10,
    color: "#ffffff"
  },
  metaDontSave:{
    margin: 10,
    padding: 5,
    color: "red"
  },
  historicalMetaText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#b8fae3', // Color del texto del historial
    textDecorationLine: "underline",
    textAlign: "center"
  },
})