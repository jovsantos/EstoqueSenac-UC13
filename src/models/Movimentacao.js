
export default class Movimentacao {
  #produtoId;
  #quantidade;
  #data;

  constructor(produtoId, quantidade) {
    if (new.target === Movimentacao) {
      throw new Error(
        "Movimentacao é uma classe base e não pode ser instanciada diretamente."
      );
    }

    this.#produtoId = produtoId;
    this.#quantidade = quantidade;
    this.#data = new Date().toISOString();
  }

  validar() {
    if (!Number.isInteger(this.#produtoId) || this.#produtoId <= 0) {
      throw new Error("Produto inválido.");
    }

    if (!Number.isInteger(this.#quantidade) || this.#quantidade <= 0) {
      throw new Error(
        "A quantidade deve ser um inteiro maior que zero."
      );
    }

    return true;
  }

  get tipo() {
    throw new Error("O método tipo deve ser implementado pela classe filha.");
  }

  aplicar(quantidadeAtual) {
    throw new Error(
      "O método aplicar deve ser implementado pela classe filha."
    );
  }

  getDados() {
    return {
      produtoId: this.#produtoId,
      tipo: this.tipo,
      quantidade: this.#quantidade,
      data: this.#data,
    };
  }
}
