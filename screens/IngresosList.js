import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function IngresosList({ingreso}) {

    const {createAt, nombre, monto } = ingreso; 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fecha de creacion 📅: {createAt.toDate().toLocaleDateString()}</Text>
      <Text style={styles.text}>Fuente del ingreso: {nombre}</Text>
      <Text style={styles.text}>Monto 💰: ${monto}.00</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo blanco
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)', // Borde en color verde
    padding: 10,
    marginBottom: 10,
  },
  text: {
    // textAlign: "center",
    color: 'black', // Texto en color verde
    fontSize: 16,
    marginBottom: 5,
    // fontWeight: "bold"
  },
})