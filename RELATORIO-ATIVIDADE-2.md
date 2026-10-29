# Relatório de Novas Funcionalidades — EstoqueSenac

## 1. Funcionalidades implementadas

### 1.1. Alerta de estoque baixo

Foi implementado um alerta visual na listagem de produtos para identificar aqueles que possuem **cinco unidades ou menos** em estoque. O aviso ajuda o usuário a reconhecer produtos que podem precisar de reposição.

### 1.2. Filtro de produtos com estoque baixo

Foi adicionada uma opção para exibir somente os produtos que possuem cinco unidades ou menos. O filtro pode ser ativado ou desativado, permitindo alternar entre a visualização de todos os produtos e apenas aqueles com estoque baixo.

## 2. Testes realizados

- **Alerta de estoque baixo:** verificado que o aviso aparece para produtos com cinco unidades ou menos e não aparece para produtos com seis unidades ou mais.
- **Filtro de estoque baixo:** verificado que a lista exibe somente os produtos dentro do limite definido e volta a mostrar todos os produtos ao desativar o filtro.
- **Versão Android:** as duas funcionalidades foram testadas no APK instalado no emulador Pixel 7.

