"use strict";
// ===== ERROS CUSTOMIZADOS (Aula 7) =====
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegraNegocioError = exports.ItemIndisponivelError = exports.EntidadeNaoEncontradaError = exports.AplicacaoError = void 0;
// Classe abstrata base para todos os erros da aplicação.
// Herda de Error (classe nativa do JS).
class AplicacaoError extends Error {
    constructor(mensagem, codigo) {
        super(mensagem); // OBRIGATÓRIO: inicializa o Error pai (mantém o stack trace)
        this.codigo = codigo;
        this.name = this.constructor.name; // nome do erro = nome da classe filha
    }
}
exports.AplicacaoError = AplicacaoError;
// Disparado quando o ID buscado não existe no repositório
class EntidadeNaoEncontradaError extends AplicacaoError {
    constructor(entidade, id) {
        super(`${entidade} com ID ${id} não foi encontrado(a).`, 404);
    }
}
exports.EntidadeNaoEncontradaError = EntidadeNaoEncontradaError;
// Disparado quando alguém tenta emprestar um item que já está emprestado
class ItemIndisponivelError extends AplicacaoError {
    constructor(titulo) {
        super(`O item "${titulo}" já está emprestado.`, 409);
    }
}
exports.ItemIndisponivelError = ItemIndisponivelError;
// Disparado quando uma regra de negócio é quebrada (dados inválidos, etc.)
class RegraNegocioError extends AplicacaoError {
    constructor(mensagem) {
        super(mensagem, 400);
    }
}
exports.RegraNegocioError = RegraNegocioError;
