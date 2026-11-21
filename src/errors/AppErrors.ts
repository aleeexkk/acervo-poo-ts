// ===== ERROS CUSTOMIZADOS (Aula 7) =====

// Classe abstrata base para todos os erros da aplicação.
// Herda de Error (classe nativa do JS).
export abstract class AplicacaoError extends Error {
  constructor(mensagem: string, public readonly codigo: number) {
    super(mensagem); // OBRIGATÓRIO: inicializa o Error pai (mantém o stack trace)
    this.name = this.constructor.name; // nome do erro = nome da classe filha
  }
}

// Disparado quando o ID buscado não existe no repositório
export class EntidadeNaoEncontradaError extends AplicacaoError {
  constructor(entidade: string, id: number) {
    super(`${entidade} com ID ${id} não foi encontrado(a).`, 404);
  }
}

// Disparado quando alguém tenta emprestar um item que já está emprestado
export class ItemIndisponivelError extends AplicacaoError {
  constructor(titulo: string) {
    super(`O item "${titulo}" já está emprestado.`, 409);
  }
}

// Disparado quando uma regra de negócio é quebrada (dados inválidos, etc.)
export class RegraNegocioError extends AplicacaoError {
  constructor(mensagem: string) {
    super(mensagem, 400);
  }
}
