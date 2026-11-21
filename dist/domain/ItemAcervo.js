"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAcervo = void 0;
const AppErrors_1 = require("../errors/AppErrors");
// Quantos milissegundos tem um dia (usado pra calcular os dias de empréstimo)
const MS_POR_DIA = 1000 * 60 * 60 * 24;
// ===== CLASSE ABSTRATA BASE (Aula 5) =====
// "abstract" = é só um molde. NÃO dá pra fazer "new ItemAcervo()".
// Ela guarda tudo que é comum a Livro e JogoEletronico.
class ItemAcervo {
    // ===== PARAMETER PROPERTIES (Aula 2) =====
    // "private _titulo: string" no construtor já CRIA, TIPA e PREENCHE o atributo.
    constructor(_titulo, _anoLancamento) {
        this._titulo = _titulo;
        this._anoLancamento = _anoLancamento;
        // Estado interno do empréstimo (privado = ninguém de fora altera direto)
        this._dataEmprestimo = null;
        // Validações: o objeto já nasce com dados corretos
        if (_titulo.trim() === '') {
            throw new AppErrors_1.RegraNegocioError('O título não pode ser vazio.');
        }
        if (_anoLancamento < 0) {
            throw new AppErrors_1.RegraNegocioError('O ano de lançamento é inválido.');
        }
        ItemAcervo._contadorId++; // soma 1 no contador da classe
        this.id = ItemAcervo._contadorId; // usa o número como id do item
    }
    // ===== GETTERS DE LEITURA (Aula 3 e 4) =====
    get titulo() {
        return this._titulo;
    }
    get anoLancamento() {
        return this._anoLancamento;
    }
    get estaEmprestado() {
        return this._dataEmprestimo !== null;
    }
    // ===== PROPRIEDADES CALCULADAS (Aula 4) =====
    // Não existe atributo "status" guardado: ele é calculado na hora que alguém lê.
    get statusDisponibilidade() {
        return this.estaEmprestado ? 'Emprestado' : 'Disponível';
    }
    // Dias desde o empréstimo até hoje (também calculado, nada guardado)
    get tempoEmprestado() {
        if (this._dataEmprestimo === null)
            return 0;
        return this.diasEntre(this._dataEmprestimo, new Date());
    }
    // ===== MÉTODOS DE NEGÓCIO (Aula 3 - Tell, Don't Ask) =====
    // Em vez de um "set emprestado = true", a classe oferece uma AÇÃO validada.
    // A data é opcional (padrão = agora) pra conseguir simular atrasos no teste.
    emprestar(data = new Date()) {
        if (this.estaEmprestado) {
            throw new AppErrors_1.ItemIndisponivelError(this._titulo);
        }
        this._dataEmprestimo = data;
    }
    // Devolve o item e retorna o valor da multa (0 se não atrasou)
    devolver(dataDevolucao = new Date()) {
        if (this._dataEmprestimo === null) {
            throw new AppErrors_1.RegraNegocioError(`O item "${this._titulo}" não está emprestado.`);
        }
        const diasEmprestado = this.diasEntre(this._dataEmprestimo, dataDevolucao);
        const diasAtraso = Math.max(0, diasEmprestado - this.prazoDias); // nunca negativo
        this._dataEmprestimo = null; // volta a ficar disponível
        return this.calcularMulta(diasAtraso); // POLIMORFISMO: cada filho calcula do seu jeito
    }
    // Resumo pronto pra mostrar na tela (tipo Readonly, ninguém altera)
    gerarResumo() {
        return {
            id: this.id,
            tipo: this.tipo,
            titulo: this._titulo,
            status: this.statusDisponibilidade,
        };
    }
    // Texto de apresentação. Os filhos completam com "super.apresentar()".
    apresentar() {
        return `#${this.id} [${this.tipo}] ${this._titulo} (${this._anoLancamento}) - ${this.statusDisponibilidade}`;
    }
    // ===== HELPER PRIVADO (Aula 3) =====
    // Método "da casa de máquinas": só a própria classe usa.
    diasEntre(inicio, fim) {
        return Math.floor((fim.getTime() - inicio.getTime()) / MS_POR_DIA);
    }
}
exports.ItemAcervo = ItemAcervo;
// ===== STATIC (Aula 4) =====
// Contador da CLASSE (um só pra todos os objetos). Privado = só a classe mexe.
ItemAcervo._contadorId = 0;
