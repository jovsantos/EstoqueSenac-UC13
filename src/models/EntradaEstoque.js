
import Movimentacao from "./Movimentacao";

export default class EntradaEstoque extends Movimentacao {
  constructor(produtoId, quantidade) {
    super(produtoId, quantidade);
  }

  get tipo() {
    return "entrada";
  }

  aplicar(quantidadeAtual) {
    this.validar();

    return quantidadeAtual + this.getDados().quantidade;
  }
}
