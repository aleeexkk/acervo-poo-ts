// ===== UTILITY TYPES (Aula 7) =====

// Dados necessários para cadastrar um livro
export interface DadosLivro {
  titulo: string;
  anoLancamento: number;
  autor: string;
  paginas: number;
}

// Omit: pega DadosLivro e TIRA "autor" e "paginas".
// Depois soma (&) o campo "plataforma". Resultado = dados de um jogo.
export type DadosJogo = Omit<DadosLivro, 'autor' | 'paginas'> & {
  plataforma: string;
};

// Pick: pega SÓ "titulo" e "anoLancamento" (o que é comum aos dois)
export type DadosBasicos = Pick<DadosLivro, 'titulo' | 'anoLancamento'>;

// Readonly: resumo do item que ninguém pode alterar depois de criado
export type ResumoItem = Readonly<{
  id: number;
  tipo: string;
  titulo: string;
  status: string;
}>;

// Partial: todos os campos viram opcionais (serve pra filtrar só pelo que quiser)
export type FiltroResumo = Partial<Pick<ResumoItem, 'tipo' | 'status'>>;
