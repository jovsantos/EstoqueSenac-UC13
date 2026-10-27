
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  listarProdutos,
  excluirProduto,
} from "../database/database";


export default function HomeScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      const resultado = await listarProdutos(filtro);
      setProdutos(resultado);
    } catch (erro) {
      Alert.alert("Erro", erro.message);
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [carregarProdutos])
  );

    async function confirmarExclusao(produto) { 
    Alert.alert(
      "Excluir produto",
      `Deseja realmente excluir "${produto.nome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirProduto(produto.id);
              await carregarProdutos();

              Alert.alert(
                "Sucesso",
                "Produto excluído com sucesso."
              );
            } catch (erro) {
              Alert.alert(
                "Erro",
                erro.message || "Não foi possível excluir o produto."
              );
            }
          },
        },
      ]
    );
  }

  function renderizarProduto({ item }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("CadastroProduto", { produto: item })
        }
      >
        <View style={styles.cardTopo}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.quantidade}>
            Estoque: {item.quantidade}
          </Text>
        </View>

        <Text style={styles.detalhe}>Código: {item.codigo}</Text>
        <Text style={styles.detalhe}>Categoria: {item.categoria}</Text>
       <Text style={styles.preco}>
            {Number(item.preco).toLocaleString("pt-BR", {
                style: "currency",
            currency: "BRL",
            })}
        </Text>
        
        <Pressable
        style={styles.botaoExcluir}
            onPress={(evento) => {
            evento.stopPropagation();
         confirmarExclusao(item);
            }}
            >
  <Text style={styles.textoExcluir}>Excluir produto</Text>
</Pressable>

      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Estoque</Text>
      <Text style={styles.subtitulo}>
        Gerencie seus produtos de forma simples.
      </Text>

      <TextInput
        style={styles.busca}
        placeholder="Buscar por nome, código ou categoria"
        placeholderTextColor="#777777"
        value={filtro}
        onChangeText={setFiltro}
        autoCapitalize="none"
      />

      <Pressable
        style={styles.botao}
        onPress={() => navigation.navigate("CadastroProduto")}
      >
        <Text style={styles.textoBotao}>+ Novo produto</Text>
      </Pressable>

      <Pressable
  style={styles.botaoMovimentacao}
  onPress={() => navigation.navigate("Movimentacao")}
>
  <Text style={styles.textoBotaoMovimentacao}>
    ⇄ Entrada / Saída de estoque
  </Text>
        </Pressable>
        
      <Pressable
        style={styles.botaoHistorico}
        onPress={() => navigation.navigate("Historico")}
      >
        <Text style={styles.textoBotaoHistorico}>
          📋 Consultar movimentações
        </Text>
      </Pressable>


      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#176B45"
          style={styles.carregando}
        />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderizarProduto}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.vazio}>
              Nenhum produto encontrado.
            </Text>
          }
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#454947ff",
  },
  subtitulo: {
    fontSize: 14,
    color: "#65736A",
    marginTop: 5,
    marginBottom: 20,
  },
  busca: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4DE",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: "#c4730aff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
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
    borderColor: "#E0E7E2",
  },
  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  nome: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#173D2B",
    flex: 1,
  },
  quantidade: {
    color: "#c4730aff",
    fontWeight: "bold",
  },
  detalhe: {
    color: "#65736A",
    marginTop: 7,
    fontSize: 14,
  },
  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#202820",
    marginTop: 10,
  },
  vazio: {
    textAlign: "center",
    color: "#65736A",
    marginTop: 35,
  },
  carregando: {
    marginTop: 30,
  },
  
botaoExcluir: {
  marginTop: 14,
  padding: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#D92D20",
  alignItems: "center",
},
textoExcluir: {
  color: "#D92D20",
  fontWeight: "bold",
  fontSize: 14,
},
botaoMovimentacao: {
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#c4730aff",
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 18,
},
textoBotaoMovimentacao: {
  color: "#c4730aff",
  fontWeight: "bold",
  fontSize: 15,
},

  botaoHistorico: {
    backgroundColor: "#176B45",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
  },
  textoBotaoHistorico: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },


});
