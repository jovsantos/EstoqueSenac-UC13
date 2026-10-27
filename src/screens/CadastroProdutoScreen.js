import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Produto from "../models/Produto";
import {
  cadastrarProduto,
  atualizarProduto,
} from "../database/database";

export default function CadastroProdutoScreen({ navigation, route }) {
  const produtoExistente = route.params?.produto;
  const editando = Boolean(produtoExistente);

  const [nome, setNome] = useState(produtoExistente?.nome ?? "");
  const [codigo, setCodigo] = useState(produtoExistente?.codigo ?? "");
  const [quantidade, setQuantidade] = useState(
    String(produtoExistente?.quantidade ?? "0")
  );
  const [preco, setPreco] = useState(
    produtoExistente ? String(produtoExistente.preco) : ""
  );
  const [categoria, setCategoria] = useState(
    produtoExistente?.categoria ?? ""
  );
  const [salvando, setSalvando] = useState(false);

  async function salvarProduto() {
    if (salvando) return;

    try {
      const nomeLimpo = nome.trim();
      const codigoLimpo = codigo.trim();
      const categoriaLimpa = categoria.trim();

      if (!nomeLimpo || !codigoLimpo || !categoriaLimpa) {
        Alert.alert(
          "Campos obrigatórios",
          "Preencha o nome, o código e a categoria."
        );
        return;
      }

      if (!/^\d+$/.test(quantidade.trim())) {
        Alert.alert(
          "Quantidade inválida",
          "Informe uma quantidade inteira igual ou maior que zero."
        );
        return;
      }

      const precoTexto = preco.trim().replace(",", ".");

      if (!/^\d+(\.\d{1,2})?$/.test(precoTexto)) {
        Alert.alert(
          "Preço inválido",
          "Informe um preço válido, como 10 ou 10,50."
        );
        return;
      }

      const quantidadeNumero = Number(quantidade);
      const precoNumero = Number(precoTexto);

      const novoProduto = new Produto(
        nomeLimpo,
        codigoLimpo,
        quantidadeNumero,
        precoNumero,
        categoriaLimpa
      );

      novoProduto.validar();

      setSalvando(true);

      if (editando) {
        await atualizarProduto(produtoExistente.id, novoProduto);
      } else {
        await cadastrarProduto(novoProduto);
      }

      Alert.alert(
        "Sucesso",
        editando
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (erro) {
      Alert.alert(
        "Não foi possível salvar",
        erro.message || "Ocorreu um erro inesperado."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>
          {editando ? "Editar produto" : "Novo produto"}
        </Text>

        <Text style={styles.subtitulo}>
          Preencha os dados do produto abaixo.
        </Text>

        <Text style={styles.label}>Nome do produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Teclado"
          value={nome}
          onChangeText={setNome}
          maxLength={100}
        />

        <Text style={styles.label}>Código</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: PROD001"
          value={codigo}
          onChangeText={setCodigo}
          autoCapitalize="characters"
          maxLength={40}
          editable={!editando}
        />

        {editando && (
          <Text style={styles.ajuda}>
            O código não pode ser alterado nesta versão.
          </Text>
        )}

        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Eletrônicos"
          value={categoria}
          onChangeText={setCategoria}
          maxLength={60}
        />

        <Text style={styles.label}>Quantidade em estoque</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 20"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
          maxLength={9}
        />

        <Text style={styles.label}>Preço unitário (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 49,90"
          value={preco}
          onChangeText={setPreco}
          keyboardType="decimal-pad"
          maxLength={15}
        />

        <Pressable
          style={[styles.botao, salvando && styles.botaoDesativado]}
          onPress={salvarProduto}
          disabled={salvando}
        >
          <Text style={styles.textoBotao}>
            {salvando
              ? "Salvando..."
              : editando
                ? "Salvar alterações"
                : "Cadastrar produto"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.botaoCancelar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoCancelar}>Voltar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    color: "#454947ff",
  },
  subtitulo: {
    fontSize: 14,
    color: "#65736A",
    marginTop: 6,
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#26382D",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4DE",
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    marginBottom: 17,
  },
  ajuda: {
    color: "#65736A",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#c4730aff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  botaoDesativado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoCancelar: {
    padding: 15,
    alignItems: "center",
    marginTop: 5,
  },
  textoCancelar: {
    color: "#c4730aff",
    fontWeight: "600",
    fontSize: 15,
  },
});
