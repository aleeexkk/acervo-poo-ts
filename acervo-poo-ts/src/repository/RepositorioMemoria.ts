import { EntidadeBase } from '../interfaces/EntidadeBase';
import { EntidadeNaoEncontradaError } from '../errors/AppErrors';

// ===== GENERICS (Aula 7) =====
// <T> = "tipo curinga". O mesmo repositório serve pra Livro, Jogo, ItemAcervo...
// "T extends EntidadeBase" = T pode ser qualquer coisa, DESDE QUE tenha um id.
export class RepositorioMemoria<T extends EntidadeBase> {
  // Coleção em memória: um array de objetos (Aula 2)
  private itens: T[] = [];

  constructor(private nomeEntidade: string) {} // usado nas mensagens de erro

  // Adiciona um item e devolve ele mesmo.
  // <U extends T> = devolve com o tipo EXATO que entrou (ex.: entra Livro, sai Livro)
  public adicionar<U extends T>(item: U): U {
    this.itens.push(item);
    return item;
  }

  // Busca pelo id. Se não achar, DISPARA um erro customizado.
  public buscarPorId(id: number): T {
    const item = this.itens.find((i) => i.id === id);
    if (!item) {
      throw new EntidadeNaoEncontradaError(this.nomeEntidade, id);
    }
    return item;
  }

  // ===== CÓPIA DEFENSIVA (Aula 3) =====
  // Devolve uma CÓPIA do array, pra ninguém de fora bagunçar a lista original
  public listarTodos(): T[] {
    return [...this.itens];
  }

  // Remove pelo id (dispara erro se não existir)
  public remover(id: number): void {
    this.buscarPorId(id); // garante que existe antes de remover
    this.itens = this.itens.filter((i) => i.id !== id);
  }

  public get total(): number {
    return this.itens.length; // propriedade calculada
  }
}
