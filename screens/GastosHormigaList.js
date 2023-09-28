import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function GastosImportantesList({gasto}) {

    const {createAt, currentUser, nombre, monto } = gasto; 
    return (
      <View style={styles.container}>
        <Text style={styles.dateText}>Fecha de creación 📅: {createAt.toDate().toLocaleDateString()}</Text>
        <Text style={styles.nameText}>Nombre del gasto: {nombre}</Text>
        <Text style={styles.amountText}>Monto del gasto 💰: ${monto}.00</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco
      padding: 16,
      marginBottom: 16,
      borderRadius: 8,
    },
    dateText: {
      fontSize: 16,
      // color: '#6633cc', // Azul violeta
      marginBottom: 8,
    },
    nameText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333', // Texto negro
      marginBottom: 8,
    },
    amountText: {
      fontSize: 16,
      color: '#333', // Texto negro
    },
  });