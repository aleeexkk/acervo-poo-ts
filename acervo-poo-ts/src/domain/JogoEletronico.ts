import { ItemAcervo } from './ItemAcervo';
import { Reservavel } from '../interfaces/Reservavel';
import { RegraNegocioError } from '../errors/AppErrors';
import { DadosJogo } from '../types/DTOs';

// ===== HERANÇA + INTERFACE (Aulas 5 e 6) =====
// extends ItemAcervo  -> herda do pai (só pode ter 1 pai)
// implements Reservavel -> assina o contrato (pode assinar vários)
export class JogoEletronico extends ItemAcervo implements Reservavel {
  private static readonly MULTA_POR_DIA = 2.5; // R$ 2,50 por dia
  private static readonly TAXA_FIXA = 5.0;     // + R$ 5,00 se atrasar

  private _reservadoPor: string | null = null; // ninguém reservou ainda

  constructor(
    titulo: string,
    anoLancamento: number,
    private _plataforma: string
  ) {
    super(titulo, anoLancamento); // chama o construtor do pai (SEMPRE primeiro)
  }

  // Factory method: cria um jogo a partir de um objeto de dados
  public static criar(dados: DadosJogo): JogoEletronico {
    return new JogoEletronico(dados.titulo, dados.anoLancamento, dados.plataforma);
  }

  public get plataforma(): string {
    return this._plataforma;
  }

  // ===== OVERRIDE (Aula 5) =====
  public override get tipo(): string {
    return 'Jogo Eletrônico';
  }

  public override get prazoDias(): number {
    return 7; // jogo pode ficar só 7 dias
  }

  // Regra de multa do jogo: R$ 2,50 por dia + taxa fixa de R$ 5,00 (se atrasou)
  public override calcularMulta(diasAtraso: number): number {
    if (diasAtraso <= 0) return 0;
    return diasAtraso * JogoEletronico.MULTA_POR_DIA + JogoEletronico.TAXA_FIXA;
  }

  // ===== IMPLEMENTANDO O CONTRATO Reservavel (Aula 6) =====
  public get reservadoPor(): string | null {
    return this._reservadoPor;
  }

  public reservar(nomeCliente: string): void {
    if (nomeCliente.trim() === '') {
      throw new RegraNegocioError('Informe o nome do cliente para reservar.');
    }
    if (this._reservadoPor !== null) {
      throw new RegraNegocioError(
        `"${this.titulo}" já está reservado para ${this._reservadoPor}.`
      );
    }
    this._reservadoPor = nomeCliente;
  }

  public cancelarReserva(): void {
    if (this._reservadoPor === null) {
      throw new RegraNegocioError(`"${this.titulo}" não possui reserva.`);
    }
    this._reservadoPor = null;
  }

  // Aproveita o texto do pai e adiciona a plataforma e a reserva
  public override apresentar(): string {
    const reserva = this._reservadoPor ? ` | Reservado por: ${this._reservadoPor}` : '';
    return `${super.apresentar()} | Plataforma: ${this._plataforma}${reserva}`;
  }
}
