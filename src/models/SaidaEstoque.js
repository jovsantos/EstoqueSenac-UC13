
import Movimentacao from "./Movimentacao";

export default class SaidaEstoque extends Movimentacao {
  constructor(produtoId, quantidade) {
    super(produtoId, quantidade);
  }

  get tipo() {
    return "saida";
  }

  aplicar(quantidadeAtual) {
    this.validar();

    const quantidade = this.getDados().quantidade;

    if (quantidade > quantidadeAtual) {
      throw new Error(
        `Estoque insuficiente. Quantidade disponível: ${quantidadeAtual} unidade(s).`
      );
    }

    return quantidadeAtual - quantidade;
  }
}
