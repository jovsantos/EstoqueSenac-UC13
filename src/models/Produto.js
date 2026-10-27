
export default class Produto {
  #nome;
  #codigo;
  #quantidade;
  #preco;
  #categoria;

  constructor(nome, codigo, quantidade, preco, categoria) {
    this.#nome = nome;
    this.#codigo = codigo;
    this.#quantidade = quantidade;
    this.#preco = preco;
    this.#categoria = categoria;
  }

  validar() {
    if (!this.#nome || !this.#nome.trim()) {
      throw new Error("Informe o nome do produto.");
    }

    if (!this.#codigo || !this.#codigo.trim()) {
      throw new Error("Informe o código do produto.");
    }

    if (!Number.isInteger(this.#quantidade) || this.#quantidade < 0) {
      throw new Error("A quantidade deve ser um número inteiro igual ou maior que zero.");
    }

    if (!Number.isFinite(this.#preco) || this.#preco < 0) {
      throw new Error("O preço deve ser igual ou maior que zero.");
    }

    if (!this.#categoria || !this.#categoria.trim()) {
      throw new Error("Informe a categoria do produto.");
    }

    return true;
  }

  getDados() {
    return {
      nome: this.#nome.trim(),
      codigo: this.#codigo.trim(),
      quantidade: this.#quantidade,
      preco: this.#preco,
      categoria: this.#categoria.trim(),
    };
  }
}
