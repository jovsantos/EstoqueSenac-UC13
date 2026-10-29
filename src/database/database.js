
import * as SQLite from "expo-sqlite";

let db;

export async function conectarBanco() { // Função para conectar ao banco de dados SQLite
  try {
    if (!db) { // Se a conexão ainda não foi estabelecida, abre o banco de dados
      db = await SQLite.openDatabaseAsync("estoquesenac.db");
    }

 // Criação da tabela de produtos, caso não exista
    await db.execAsync(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    codigo TEXT NOT NULL UNIQUE,
    quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
    preco REAL NOT NULL CHECK (preco >= 0),
    categoria TEXT NOT NULL
  );
`);
// Criação da tabela de movimentações, caso não exista
    await db.execAsync(`
  CREATE TABLE IF NOT EXISTS movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    data TEXT NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  );
`);


    return db;
  } catch (erro) {
    console.error("Erro ao conectar ao banco:", erro);
    throw new Error("Não foi possível preparar o banco de dados.");
  }
}

export async function cadastrarProduto(produto) { // Função para cadastrar um novo produto no banco de dados
  try {
    const banco = await conectarBanco(); // Conecta ao banco de dados
    const dados = produto.getDados(); // Obtém os dados do produto a partir do objeto Produto

    await banco.runAsync( // Executa a query SQL para inserir o novo produto na tabela "produtos"
      `INSERT INTO produtos
        (nome, codigo, quantidade, preco, categoria)
       VALUES (?, ?, ?, ?, ?)`,
      [
        dados.nome,
        dados.codigo,
        dados.quantidade,
        dados.preco,
        dados.categoria,
      ]
    );
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);

    if (erro.message?.includes("UNIQUE")) { 
      throw new Error("Já existe um produto com esse código.");
    }

    throw new Error("Não foi possível cadastrar o produto.");
  }
}

export async function listarProdutos(filtro = "") { // Função para listar produtos do banco de dados, com filtro opcional
  try {
    const banco = await conectarBanco(); // Conecta ao banco de dados

    return await banco.getAllAsync( 
      `SELECT * FROM produtos
       WHERE nome LIKE ? OR codigo LIKE ? OR categoria LIKE ?
       ORDER BY nome COLLATE NOCASE ASC`,
      [`%${filtro}%`, `%${filtro}%`, `%${filtro}%`] // Parâmetros para a query SQL, usando o filtro fornecido
    );
  } catch (erro) {
    console.error("Erro ao consultar produtos:", erro);
    throw new Error("Não foi possível consultar os produtos.");
  }
}

export async function buscarProdutoPorId(id) { // Função para buscar um produto específico pelo seu ID
  try {
    const banco = await conectarBanco();

    return await banco.getFirstAsync(
      "SELECT * FROM produtos WHERE id = ?",
      [id]
    );
  } catch (erro) {
    console.error("Erro ao buscar produto:", erro);
    throw new Error("Não foi possível buscar o produto.");
  }
}

export async function atualizarProduto(id, produto) {
  try {
    const banco = await conectarBanco();
    const dados = produto.getDados();

    const resultado = await banco.runAsync(
      `UPDATE produtos
       SET nome = ?, codigo = ?, quantidade = ?,
           preco = ?, categoria = ?
       WHERE id = ?`,
      [
        dados.nome,
        dados.codigo,
        dados.quantidade,
        dados.preco,
        dados.categoria,
        id,
      ]
    );

    if (resultado.changes === 0) {
      throw new Error("Produto não encontrado.");
    }
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);

    if (erro.message?.includes("UNIQUE")) {
      throw new Error("Já existe um produto com esse código.");
    }

    if (erro.message === "Produto não encontrado.") {
      throw erro;
    }

    throw new Error("Não foi possível atualizar o produto.");
  }
}

export async function excluirProduto(id) {
  try {
    const banco = await conectarBanco();

    const resultado = await banco.runAsync(
      "DELETE FROM produtos WHERE id = ?",
      [id]
    );

    if (resultado.changes === 0) {
      throw new Error("Produto não encontrado.");
    }
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);

    if (erro.message === "Produto não encontrado.") {
      throw erro;
    }

    throw new Error("Não foi possível excluir o produto.");
  }
}



export async function registrarMovimentacao(movimentacao) {
  const banco = await conectarBanco();
  const dados = movimentacao.getDados();

  movimentacao.validar();

  try {
    await banco.withExclusiveTransactionAsync(async (transacao) => {
      const produto = await transacao.getFirstAsync(
        "SELECT id, quantidade FROM produtos WHERE id = ?",
        [dados.produtoId]
      );

      if (!produto) {
        throw new Error("Produto não encontrado.");
      }

      const quantidadeAtual = Number(produto.quantidade);
      const quantidadeMovimentada = Number(dados.quantidade);

      // Polimorfismo: cada classe calcula o estoque de forma diferente.
      const novaQuantidade = movimentacao.aplicar(quantidadeAtual);

      await transacao.runAsync(
        "UPDATE produtos SET quantidade = ? WHERE id = ?",
        [novaQuantidade, dados.produtoId]
      );

      await transacao.runAsync(
        `INSERT INTO movimentacoes
          (produto_id, tipo, quantidade, data)
         VALUES (?, ?, ?, ?)`,
        [
          dados.produtoId,
          dados.tipo,
          quantidadeMovimentada,
          dados.data,
        ]
      );
    });
  } catch (erro) {
    console.error("Erro ao registrar movimentação:", erro);

    if (
      erro.message === "Produto não encontrado." ||
      erro.message.startsWith("Estoque insuficiente.")
    ) {
      throw erro;
    }

    throw new Error("Não foi possível registrar a movimentação.");
  }
}



export async function listarMovimentacoes() {
  try {
    const banco = await conectarBanco();

    return await banco.getAllAsync(
      `SELECT 
         m.id,
         m.produto_id,
         m.tipo,
         m.quantidade,
         m.data,
         p.nome AS produto_nome,
         p.codigo AS produto_codigo
       FROM movimentacoes m
       INNER JOIN produtos p ON p.id = m.produto_id
       ORDER BY m.data DESC, m.id DESC`
    );
  } catch (erro) {
    console.error("Erro ao consultar movimentações:", erro);
    throw new Error("Não foi possível consultar o histórico.");
  }
}


