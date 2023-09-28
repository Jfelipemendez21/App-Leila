import { Alert, StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react'
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
export default function Chart(props) {

  const { route } = props;
  const { montoAcumulado, gastosAcumulados, gastosHormigaAcumulados } = route.params;

  const [dataChart, setDataChart] = useState({
    labels: ["Ingresos", "Gastos Hormiga", "Gastos"],
    datasets: [
      {
        data: [montoAcumulado, gastosHormigaAcumulados, gastosAcumulados]
      }
    ]
  });

  useEffect(() => {
    console.log(route.params)
    setDataChart({
      labels: ["Ingresos", "Gastos Hormiga", "Gastos"],
      datasets: [
        {
          data: [montoAcumulado, gastosHormigaAcumulados, gastosAcumulados]
        }
      ]
    });
  }, [montoAcumulado, gastosAcumulados, gastosHormigaAcumulados]);


  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Estadisticas</Text>
      <BarChart data={dataChart} 
        width={Dimensions.get("window").width - 10} // from react-native
        height={420}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
            backgroundGradientFrom: "#342f66",
            backgroundGradientFromOpacity: 1,
            backgroundGradientTo: "#08130D",
            backgroundGradientToOpacity: 1,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 3, // optional, default 3
            barPercentage: 1.5,
            useShadowColorFromDataset: false,
        }}
        bezier
        style={{
          marginVertical: 10,
          alignSelf: "center",
        }}
        />
        <Text style={styles.obser}>Recomendacion: </Text>
        {
          
          montoAcumulado / gastosAcumulados >= 2 && montoAcumulado / gastosHormigaAcumulados >= 2   
          ? 
          <Text style={styles.ok}>- Vas por buen camino, sigue asi!</Text> 
          : 
          <Text style={styles.peligro}>- Uno de tus gastos sumados equivale al 50% o mas de tus ingresos, cuida mejor tus finanzas</Text> 
        }
    </View>
  </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: "rgba(52, 47, 102, 0.7)"
  },
  peligro: {
    color: "#ee9600",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "rgba(238, 150, 0, 0.1)",
    fontSize: 15,
  },
  ok: {
    color: "#00b936",
    marginVertical: 10,
    paddingHo: 10,
    backgroundColor: "rgba(0, 185, 54, 0.1)",
    fontSize: 15,
  },
  title: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "rgba(26, 255, 146, 0.7)",
    padding: 10,
    marginVertical: 10
  },
  obser:{
    color: "rgba(26, 255, 146, 0.7)",
    fontWeight: "normal",
    fontSize: 20,
    marginHorizontal: 5,
  }
})