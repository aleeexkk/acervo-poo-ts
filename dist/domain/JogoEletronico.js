"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JogoEletronico = void 0;
const ItemAcervo_1 = require("./ItemAcervo");
const AppErrors_1 = require("../errors/AppErrors");
// ===== HERANÇA + INTERFACE (Aulas 5 e 6) =====
// extends ItemAcervo  -> herda do pai (só pode ter 1 pai)
// implements Reservavel -> assina o contrato (pode assinar vários)
class JogoEletronico extends ItemAcervo_1.ItemAcervo {
    constructor(titulo, anoLancamento, _plataforma) {
        super(titulo, anoLancamento); // chama o construtor do pai (SEMPRE primeiro)
        this._plataforma = _plataforma;
        this._reservadoPor = null; // ninguém reservou ainda
    }
    // Factory method: cria um jogo a partir de um objeto de dados
    static criar(dados) {
        return new JogoEletronico(dados.titulo, dados.anoLancamento, dados.plataforma);
    }
    get plataforma() {
        return this._plataforma;
    }
    // ===== OVERRIDE (Aula 5) =====
    get tipo() {
        return 'Jogo Eletrônico';
    }
    get prazoDias() {
        return 7; // jogo pode ficar só 7 dias
    }
    // Regra de multa do jogo: R$ 2,50 por dia + taxa fixa de R$ 5,00 (se atrasou)
    calcularMulta(diasAtraso) {
        if (diasAtraso <= 0)
            return 0;
        return diasAtraso * JogoEletronico.MULTA_POR_DIA + JogoEletronico.TAXA_FIXA;
    }
    // ===== IMPLEMENTANDO O CONTRATO Reservavel (Aula 6) =====
    get reservadoPor() {
        return this._reservadoPor;
    }
    reservar(nomeCliente) {
        if (nomeCliente.trim() === '') {
            throw new AppErrors_1.RegraNegocioError('Informe o nome do cliente para reservar.');
        }
        if (this._reservadoPor !== null) {
            throw new AppErrors_1.RegraNegocioError(`"${this.titulo}" já está reservado para ${this._reservadoPor}.`);
        }
        this._reservadoPor = nomeCliente;
    }
    cancelarReserva() {
        if (this._reservadoPor === null) {
            throw new AppErrors_1.RegraNegocioError(`"${this.titulo}" não possui reserva.`);
        }
        this._reservadoPor = null;
    }
    // Aproveita o texto do pai e adiciona a plataforma e a reserva
    apresentar() {
        const reserva = this._reservadoPor ? ` | Reservado por: ${this._reservadoPor}` : '';
        return `${super.apresentar()} | Plataforma: ${this._plataforma}${reserva}`;
    }
}
exports.JogoEletronico = JogoEletronico;
JogoEletronico.MULTA_POR_DIA = 2.5; // R$ 2,50 por dia
JogoEletronico.TAXA_FIXA = 5.0; // + R$ 5,00 se atrasar
