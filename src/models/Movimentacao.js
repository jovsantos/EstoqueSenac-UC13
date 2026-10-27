
export default class Movimentacao {
  #produtoId;
  #tipo;
  #quantidade;
  #data;

  constructor(produtoId, tipo, quantidade) {
    this.#produtoId = produtoId;
    this.#tipo = tipo;
    this.#quantidade = quantidade;
    this.#data = new Date().toISOString();
  }

  validar() {
    if (!Number.isInteger(this.#produtoId) || this.#produtoId <= 0) {
      throw new Error("Produto inválido.");
    }

    if (!["entrada", "saida"].includes(this.#tipo)) {
      throw new Error("Tipo deve ser entrada ou saida.");
    }

    if (!Number.isInteger(this.#quantidade) || this.#quantidade <= 0) {
      throw new Error("A quantidade deve ser um inteiro maior que zero.");
    }

    return true;
  }

  getDados() {
    return {
      produtoId: this.#produtoId,
      tipo: this.#tipo,
      quantidade: this.#quantidade,
      data: this.#data,
    };
  }
}
