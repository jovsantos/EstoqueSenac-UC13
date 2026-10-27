
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import AppRoutes from "./src/navigation/AppRoutes";
import SplashScreen from "./src/screens/SplashScreen";
import { conectarBanco } from "./src/database/database";

export default function App() {
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function iniciarAplicativo() {
      try {
        await Promise.all([
          conectarBanco(),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        if (ativo) {
          setPronto(true);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message || "Não foi possível iniciar o aplicativo."
          );
        }
      }
    }

    iniciarAplicativo();

    return () => {
      ativo = false;
    };
  }, []);

  if (erro) {
    return (
      <View style={styles.erroContainer}>
        <Text style={styles.tituloErro}>Erro ao iniciar</Text>
        <Text style={styles.mensagemErro}>{erro}</Text>
      </View>
    );
  }

  if (!pronto) {
    return <SplashScreen />;
  }

  return <AppRoutes />;
}

const styles = StyleSheet.create({
  erroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F6F5",
  },
  tituloErro: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B42318",
    marginBottom: 10,
  },
  mensagemErro: {
    fontSize: 15,
    color: "#526258",
    textAlign: "center",
  },
});
