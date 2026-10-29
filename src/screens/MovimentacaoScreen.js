
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import {
  listarProdutos,
  registrarMovimentacao,
} from "../database/database";
import EntradaEstoque from "../models/EntradaEstoque";
import SaidaEstoque from "../models/SaidaEstoque";


export default function MovimentacaoScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState(null);
  const [tipo, setTipo] = useState("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const resultado = await listarProdutos();
        setProdutos(resultado);

        if (resultado.length > 0) {
          setProdutoId(resultado[0].id);
        }
      } catch (erro) {
        Alert.alert("Erro", erro.message);
      }
    }

    carregar();
  }, []);

  async function salvarMovimentacao() {
    if (salvando) return;

    try {
      if (produtoId === null) {
        Alert.alert("Atenção", "Cadastre um produto primeiro.");
        return;
      }

      if (!/^[1-9]\d*$/.test(quantidade.trim())) {
        Alert.alert(
          "Quantidade inválida",
          "Informe um número inteiro maior que zero."
        );
        return;
      }

     const movimentacao =
  tipo === "entrada"
    ? new EntradaEstoque(produtoId, Number(quantidade))
    : new SaidaEstoque(produtoId, Number(quantidade));

      movimentacao.validar();
      setSalvando(true);
     await registrarMovimentacao(movimentacao);

      Alert.alert("Sucesso", "Estoque atualizado!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (erro) {
      Alert.alert("Erro", erro.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>Movimentar estoque</Text>
      <Text style={styles.subtitulo}>
        Selecione um produto e informe a movimentação.
      </Text>

      <Text style={styles.label}>Produto</Text>

      {produtos.length === 0 ? (
        <Text style={styles.aviso}>
          Nenhum produto cadastrado. Cadastre um produto antes de continuar.
        </Text>
      ) : (
        produtos.map((produto) => (
          <Pressable
            key={produto.id}
            style={[
              styles.produto,
              produtoId === produto.id && styles.produtoSelecionado,
            ]}
            onPress={() => setProdutoId(produto.id)}
          >
            <Text style={styles.nomeProduto}>{produto.nome}</Text>
            <Text style={styles.detalhe}>
              Código: {produto.codigo} · Estoque: {produto.quantidade}
            </Text>
            {produtoId === produto.id && (
              <Text style={styles.selecionado}>Produto selecionado</Text>
            )}
          </Pressable>
        ))
      )}

      <Text style={styles.label}>Tipo de movimentação</Text>

      <View style={styles.tipos}>
        <Pressable
          style={[
            styles.tipoBotao,
            tipo === "entrada" && styles.entradaSelecionada,
          ]}
          onPress={() => setTipo("entrada")}
        >
          <Text
            style={[
              styles.tipoTexto,
              tipo === "entrada" && styles.textoSelecionado,
            ]}
          >
            + Entrada
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tipoBotao,
            tipo === "saida" && styles.saidaSelecionada,
          ]}
          onPress={() => setTipo("saida")}
        >
          <Text
            style={[
              styles.tipoTexto,
              tipo === "saida" && styles.textoSelecionado,
            ]}
          >
            − Saída
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="Ex.: 5"
        keyboardType="number-pad"
        maxLength={9}
      />

      <Pressable
        style={[
          styles.salvarBotao,
          (salvando || produtos.length === 0) && styles.desativado,
        ]}
        onPress={salvarMovimentacao}
        disabled={salvando || produtos.length === 0}
      >
        <Text style={styles.salvarTexto}>
          {salvando ? "Salvando..." : "Confirmar movimentação"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
  },
  conteudo: {
    padding: 20,
    paddingBottom: 35,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#173D2B",
  },
  subtitulo: {
    color: "#65736A",
    marginTop: 6,
    marginBottom: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#26382D",
    marginBottom: 10,
    marginTop: 12,
  },
  produto: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCE4DE",
    marginBottom: 10,
  },
  produtoSelecionado: {
    borderColor: "#176B45",
    borderWidth: 2,
  },
  nomeProduto: {
    color: "#173D2B",
    fontWeight: "bold",
    fontSize: 16,
  },
  detalhe: {
    color: "#65736A",
    marginTop: 5,
    fontSize: 13,
  },
  selecionado: {
    color: "#176B45",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 6,
  },
  aviso: {
    color: "#B54708",
    backgroundColor: "#FFF4E5",
    padding: 12,
    borderRadius: 8,
  },
  tipos: {
    flexDirection: "row",
    gap: 12,
  },
  tipoBotao: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCE4DE",
    padding: 15,
    alignItems: "center",
  },
  entradaSelecionada: {
    backgroundColor: "#176B45",
    borderColor: "#176B45",
  },
  saidaSelecionada: {
    backgroundColor: "#B42318",
    borderColor: "#B42318",
  },
  tipoTexto: {
    color: "#26382D",
    fontWeight: "bold",
  },
  textoSelecionado: {
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4DE",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  salvarBotao: {
    backgroundColor: "#176B45",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 25,
  },
  desativado: {
    opacity: 0.5,
  },
  salvarTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});

