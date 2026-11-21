"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Livro = void 0;
const ItemAcervo_1 = require("./ItemAcervo");
const AppErrors_1 = require("../errors/AppErrors");
// ===== HERANÇA (Aula 5) =====
// "extends" = Livro É UM ItemAcervo e herda tudo dele.
class Livro extends ItemAcervo_1.ItemAcervo {
    constructor(titulo, anoLancamento, _autor, // atributos próprios do livro (privados)
    _paginas) {
        super(titulo, anoLancamento); // chama o construtor do pai (SEMPRE primeiro)
        this._autor = _autor;
        this._paginas = _paginas;
        if (_paginas <= 0) {
            throw new AppErrors_1.RegraNegocioError('O livro precisa ter pelo menos 1 página.');
        }
    }
    // ===== FACTORY METHOD ESTÁTICO (Aula 4) =====
    // Cria um livro a partir de um objeto de dados (mais fácil de ler)
    static criar(dados) {
        return new Livro(dados.titulo, dados.anoLancamento, dados.autor, dados.paginas);
    }
    get autor() {
        return this._autor;
    }
    get paginas() {
        return this._paginas;
    }
    // ===== OVERRIDE (Aula 5) =====
    // Cada filho dá a sua própria resposta para os métodos abstratos do pai
    get tipo() {
        return 'Livro';
    }
    get prazoDias() {
        return 14; // livro pode ficar 14 dias
    }
    // Regra de multa do livro: R$ 1,00 por dia de atraso
    calcularMulta(diasAtraso) {
        return diasAtraso * Livro.MULTA_POR_DIA;
    }
    // Aproveita o texto do pai e adiciona o autor
    apresentar() {
        return `${super.apresentar()} | Autor: ${this._autor}, ${this._paginas} págs.`;
    }
}
exports.Livro = Livro;
Livro.MULTA_POR_DIA = 1.0; // R$ 1,00 por dia de atraso
