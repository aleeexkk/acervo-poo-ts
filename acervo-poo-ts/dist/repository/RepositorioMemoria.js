"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioMemoria = void 0;
const AppErrors_1 = require("../errors/AppErrors");
// ===== GENERICS (Aula 7) =====
// <T> = "tipo curinga". O mesmo repositório serve pra Livro, Jogo, ItemAcervo...
// "T extends EntidadeBase" = T pode ser qualquer coisa, DESDE QUE tenha um id.
class RepositorioMemoria {
    constructor(nomeEntidade) {
        this.nomeEntidade = nomeEntidade;
        // Coleção em memória: um array de objetos (Aula 2)
        this.itens = [];
    } // usado nas mensagens de erro
    // Adiciona um item e devolve ele mesmo.
    // <U extends T> = devolve com o tipo EXATO que entrou (ex.: entra Livro, sai Livro)
    adicionar(item) {
        this.itens.push(item);
        return item;
    }
    // Busca pelo id. Se não achar, DISPARA um erro customizado.
    buscarPorId(id) {
        const item = this.itens.find((i) => i.id === id);
        if (!item) {
            throw new AppErrors_1.EntidadeNaoEncontradaError(this.nomeEntidade, id);
        }
        return item;
    }
    // ===== CÓPIA DEFENSIVA (Aula 3) =====
    // Devolve uma CÓPIA do array, pra ninguém de fora bagunçar a lista original
    listarTodos() {
        return [...this.itens];
    }
    // Remove pelo id (dispara erro se não existir)
    remover(id) {
        this.buscarPorId(id); // garante que existe antes de remover
        this.itens = this.itens.filter((i) => i.id !== id);
    }
    get total() {
        return this.itens.length; // propriedade calculada
    }
}
exports.RepositorioMemoria = RepositorioMemoria;
