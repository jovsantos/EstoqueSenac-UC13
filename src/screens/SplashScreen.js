
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#124D32"
        barStyle="light-content"
      />

      <View style={styles.logoContainer}>
        <Text style={styles.icone}>📦</Text>
      </View>

      <Text style={styles.titulo}>EstoqueSenac</Text>

      <Text style={styles.subtitulo}>
        Controle de estoque simples e eficiente
      </Text>

      <View style={styles.carregamento}>
        <ActivityIndicator size="small" color="#FFFFFF" />
        <Text style={styles.textoCarregamento}>
          Preparando seu estoque...
        </Text>
      </View>

      <Text style={styles.rodape}>
        Feito por João Vitor • SENAC
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d62d3f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    elevation: 8,
  },
  icone: {
    fontSize: 58,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subtitulo: {
    color: "#DCEFE4",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  carregamento: {
    alignItems: "center",
    marginTop: 55,
    gap: 12,
  },
  textoCarregamento: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  rodape: {
    position: "absolute",
    bottom: 35,
    color: "#DCEFE4",
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
