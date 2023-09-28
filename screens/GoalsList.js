import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState} from 'react';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { database } from '../credenciales';


const GoalsList = ({meta, montoAcumulado}) => {
  const {id, currentUser, createdAt, estado, monto, nombre, plazo} = meta; 
  const [fechaHoy, setfechaHoy] = useState(new Date())

  const updateState = ()=>{
    const docRef= doc(database, "metas", id);
    updateDoc(docRef, {
      estado: true,
    })
  }
  // const deleteMeta=()=>{
  //   const docRef= doc(database, "metas", id);
  //   deleteDoc(docRef); 
  // }

  useEffect(() => {
    setfechaHoy(new Date());
  }, [])
  

  const successfullyMeta= ()=>{
       {/* Actualizar estado de la meta*/}
       if(monto <= montoAcumulado){
          if(plazo.toDate() >= fechaHoy){
            updateState();
            Alert.alert("Meta finalizada!", "¡Felicidades por tu desempeño!")
          }else{
            Alert.alert("La meta ha caducado!", "¡El plazo ya se agoto :c!")
          }
        }else{
              Alert.alert("¡Sigue esforzandote!", "Tu monto no cuenta con el dinero necesario para cumplir esta meta!")
        }
      }
  return (
        <View style={styles.metaContainer}>
          {/* <Text>{createdAt}</Text> */}
          {/* <Text>Fecha de creacion:{createdAt.toDate().toLocaleDateString()}</Text> */}
          <Text style={styles.metaText}>Nombre de la meta: {nombre}</Text>
          <Text style={styles.metaText}>Monto objetivo: ${monto}.00</Text>
          <Text style={styles.metaText}>Fecha limite para cumplirla: {plazo.toDate().toLocaleDateString()}</Text>
          
          {/* padStart es un método que agrega ceros a la izquierda para asegurarse de que el número tenga al menos dos dígitos */}
          {
            !estado
            ?  
            plazo.toDate() >= fechaHoy 
              ? <Text style={styles.metaProcess}>Estado: En proceso 🕒</Text>
              : <Text style={styles.metaExpired}>Estado: Expiro fecha ⚠️</Text>
            
            : <Text style={styles.metaFinish}>Estado: Finalizada 👍</Text>
            
          }
          { estado
          ? <TouchableOpacity style={styles.completeButton} disabled={true}>
              <Text style={styles.completeButtonText}>Meta completada ✔️</Text>
            </TouchableOpacity>
          :
            <TouchableOpacity style={styles.successButton} onPress={successfullyMeta}>
              <Text style={styles.successButtonText}>Cumplir Meta</Text>
            </TouchableOpacity>
          }
          {/* <AntDesign onPress={deleteMeta} name="delete" size={24} color="black" /> */}
          
        </View>
  )
}

export default GoalsList

const styles = StyleSheet.create({
  metaContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  metaText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center"
  },
  metaExpired:{
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: "rgba(255,0,0,0.6)",
    color: "white",
    textAlign: "center",
    padding: 5
  },
  metaFinish:{
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: "rgba(160, 249, 174, 0.9)",
    color: "white",
    textAlign: "center",
    padding: 5
  },
  metaProcess:{
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: "rgba(244, 168, 87, 0.6)",
    color: "white",
    textAlign: "center",
    padding: 5
  },
  successButton: {
    backgroundColor: '#32CD32', // Color de fondo del botón de éxito
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  successButtonText: {
    color: 'white', // Color del texto del botón de éxito
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: 'grey', // Color de fondo del botón de completar
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white', // Color del texto del botón de completar
    fontSize: 16,
    fontWeight: 'bold',
  },
})