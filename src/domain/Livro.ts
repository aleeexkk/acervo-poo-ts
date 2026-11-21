import { ItemAcervo } from './ItemAcervo';
import { RegraNegocioError } from '../errors/AppErrors';
import { DadosLivro } from '../types/DTOs';

// ===== HERANÇA (Aula 5) =====
// "extends" = Livro É UM ItemAcervo e herda tudo dele.
export class Livro extends ItemAcervo {
  private static readonly MULTA_POR_DIA = 1.0; // R$ 1,00 por dia de atraso

  constructor(
    titulo: string,
    anoLancamento: number,
    private _autor: string,   // atributos próprios do livro (privados)
    private _paginas: number
  ) {
    super(titulo, anoLancamento); // chama o construtor do pai (SEMPRE primeiro)

    if (_paginas <= 0) {
      throw new RegraNegocioError('O livro precisa ter pelo menos 1 página.');
    }
  }

  // ===== FACTORY METHOD ESTÁTICO (Aula 4) =====
  // Cria um livro a partir de um objeto de dados (mais fácil de ler)
  public static criar(dados: DadosLivro): Livro {
    return new Livro(dados.titulo, dados.anoLancamento, dados.autor, dados.paginas);
  }

  public get autor(): string {
    return this._autor;
  }

  public get paginas(): number {
    return this._paginas;
  }

  // ===== OVERRIDE (Aula 5) =====
  // Cada filho dá a sua própria resposta para os métodos abstratos do pai
  public override get tipo(): string {
    return 'Livro';
  }

  public override get prazoDias(): number {
    return 14; // livro pode ficar 14 dias
  }

  // Regra de multa do livro: R$ 1,00 por dia de atraso
  public override calcularMulta(diasAtraso: number): number {
    return diasAtraso * Livro.MULTA_POR_DIA;
  }

  // Aproveita o texto do pai e adiciona o autor
  public override apresentar(): string {
    return `${super.apresentar()} | Autor: ${this._autor}, ${this._paginas} págs.`;
  }
}
