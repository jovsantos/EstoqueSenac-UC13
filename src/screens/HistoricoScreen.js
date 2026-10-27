
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import { listarMovimentacoes } from "../database/database";

export default function HistoricoScreen() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarHistorico() {
    try {
      setCarregando(true);
      const resultado = await listarMovimentacoes();
      setMovimentacoes(resultado);
    } catch (erro) {
      Alert.alert("Erro", erro.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

 function formatarData(data) {
  if (!data) return "Data não informada";

  const dataObjeto = new Date(data);

  if (Number.isNaN(dataObjeto.getTime())) return data;

  return dataObjeto.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

  function renderizarMovimentacao({ item }) {
    const entrada = item.tipo === "entrada";

    return (
      <View style={styles.card}>
        <Text style={styles.produto}>
          {item.produto_nome || `Produto ID: ${item.produto_id}`}
        </Text>

        <Text
          style={[
            styles.tipo,
            { color: entrada ? "#176B45" : "#B42318" },
          ]}
        >
          {entrada ? "↑ Entrada" : "↓ Saída"}: {item.quantidade} unidade(s)
        </Text>

        <Text style={styles.detalhe}>
          Código: {item.produto_codigo || "Não informado"}
        </Text>

        <Text style={styles.detalhe}>
          Data: {formatarData(item.data)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de movimentações</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#176B45" />
      ) : (
        <FlatList
          data={movimentacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderizarMovimentacao}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              Nenhuma movimentação registrada.
            </Text>
          }
          contentContainerStyle={styles.lista}
          onRefresh={carregarHistorico}
          refreshing={carregando}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
    padding: 20,
  },
  titulo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#454947",
    marginBottom: 20,
  },
  lista: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DCE4DE",
  },
  produto: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#173D2B",
    marginBottom: 8,
  },
  tipo: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detalhe: {
    color: "#65736A",
    marginTop: 4,
  },
  vazio: {
    color: "#65736A",
    textAlign: "center",
    marginTop: 30,
  },
});
