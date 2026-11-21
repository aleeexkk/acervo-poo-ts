import { EntidadeBase } from '../interfaces/EntidadeBase';
import { ItemIndisponivelError, RegraNegocioError } from '../errors/AppErrors';
import { ResumoItem } from '../types/DTOs';

// Quantos milissegundos tem um dia (usado pra calcular os dias de empréstimo)
const MS_POR_DIA = 1000 * 60 * 60 * 24;

// ===== CLASSE ABSTRATA BASE (Aula 5) =====
// "abstract" = é só um molde. NÃO dá pra fazer "new ItemAcervo()".
// Ela guarda tudo que é comum a Livro e JogoEletronico.
export abstract class ItemAcervo implements EntidadeBase {
  // ===== STATIC (Aula 4) =====
  // Contador da CLASSE (um só pra todos os objetos). Privado = só a classe mexe.
  private static _contadorId: number = 0;

  // ===== READONLY (Aula 3) =====
  // O id é definido uma vez no construtor e nunca mais muda.
  public readonly id: number;

  // Estado interno do empréstimo (privado = ninguém de fora altera direto)
  private _dataEmprestimo: Date | null = null;

  // ===== PARAMETER PROPERTIES (Aula 2) =====
  // "private _titulo: string" no construtor já CRIA, TIPA e PREENCHE o atributo.
  constructor(
    private _titulo: string,
    private _anoLancamento: number
  ) {
    // Validações: o objeto já nasce com dados corretos
    if (_titulo.trim() === '') {
      throw new RegraNegocioError('O título não pode ser vazio.');
    }
    if (_anoLancamento < 0) {
      throw new RegraNegocioError('O ano de lançamento é inválido.');
    }

    ItemAcervo._contadorId++;          // soma 1 no contador da classe
    this.id = ItemAcervo._contadorId;  // usa o número como id do item
  }

  // ===== MÉTODOS ABSTRATOS (Aula 5) =====
  // Só a assinatura. Cada filho é OBRIGADO a criar o seu.
  public abstract calcularMulta(diasAtraso: number): number;
  public abstract get prazoDias(): number; // quantos dias pode ficar emprestado
  public abstract get tipo(): string;      // "Livro" ou "Jogo Eletrônico"

  // ===== GETTERS DE LEITURA (Aula 3 e 4) =====
  public get titulo(): string {
    return this._titulo;
  }

  public get anoLancamento(): number {
    return this._anoLancamento;
  }

  public get estaEmprestado(): boolean {
    return this._dataEmprestimo !== null;
  }

  // ===== PROPRIEDADES CALCULADAS (Aula 4) =====
  // Não existe atributo "status" guardado: ele é calculado na hora que alguém lê.
  public get statusDisponibilidade(): string {
    return this.estaEmprestado ? 'Emprestado' : 'Disponível';
  }

  // Dias desde o empréstimo até hoje (também calculado, nada guardado)
  public get tempoEmprestado(): number {
    if (this._dataEmprestimo === null) return 0;
    return this.diasEntre(this._dataEmprestimo, new Date());
  }

  // ===== MÉTODOS DE NEGÓCIO (Aula 3 - Tell, Don't Ask) =====
  // Em vez de um "set emprestado = true", a classe oferece uma AÇÃO validada.
  // A data é opcional (padrão = agora) pra conseguir simular atrasos no teste.
  public emprestar(data: Date = new Date()): void {
    if (this.estaEmprestado) {
      throw new ItemIndisponivelError(this._titulo);
    }
    this._dataEmprestimo = data;
  }

  // Devolve o item e retorna o valor da multa (0 se não atrasou)
  public devolver(dataDevolucao: Date = new Date()): number {
    if (this._dataEmprestimo === null) {
      throw new RegraNegocioError(`O item "${this._titulo}" não está emprestado.`);
    }

    const diasEmprestado = this.diasEntre(this._dataEmprestimo, dataDevolucao);
    const diasAtraso = Math.max(0, diasEmprestado - this.prazoDias); // nunca negativo

    this._dataEmprestimo = null; // volta a ficar disponível
    return this.calcularMulta(diasAtraso); // POLIMORFISMO: cada filho calcula do seu jeito
  }

  // Resumo pronto pra mostrar na tela (tipo Readonly, ninguém altera)
  public gerarResumo(): ResumoItem {
    return {
      id: this.id,
      tipo: this.tipo,
      titulo: this._titulo,
      status: this.statusDisponibilidade,
    };
  }

  // Texto de apresentação. Os filhos completam com "super.apresentar()".
  public apresentar(): string {
    return `#${this.id} [${this.tipo}] ${this._titulo} (${this._anoLancamento}) - ${this.statusDisponibilidade}`;
  }

  // ===== HELPER PRIVADO (Aula 3) =====
  // Método "da casa de máquinas": só a própria classe usa.
  private diasEntre(inicio: Date, fim: Date): number {
    return Math.floor((fim.getTime() - inicio.getTime()) / MS_POR_DIA);
  }
}
