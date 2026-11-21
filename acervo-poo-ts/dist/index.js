"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Livro_1 = require("./domain/Livro");
const JogoEletronico_1 = require("./domain/JogoEletronico");
const RepositorioMemoria_1 = require("./repository/RepositorioMemoria");
const AppErrors_1 = require("./errors/AppErrors");
// Função auxiliar: devolve uma data X dias atrás (pra simular empréstimos antigos)
function diasAtras(dias) {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return data;
}
// Formata número como dinheiro: 7.5 -> "R$ 7,50"
function emReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
// Filtra os resumos usando um Partial (pode passar só tipo, só status ou os dois)
function filtrar(resumos, filtro) {
    return resumos.filter((r) => (filtro.tipo === undefined || r.tipo === filtro.tipo) &&
        (filtro.status === undefined || r.status === filtro.status));
}
// Função que trata os erros: usa instanceof pra saber QUAL erro aconteceu
function tratarErro(erro) {
    if (erro instanceof AppErrors_1.ItemIndisponivelError) {
        console.warn(`⚠️  Indisponível: ${erro.message}`);
    }
    else if (erro instanceof AppErrors_1.EntidadeNaoEncontradaError) {
        console.warn(`🔍 Não encontrado (${erro.codigo}): ${erro.message}`);
    }
    else if (erro instanceof AppErrors_1.AplicacaoError) {
        console.warn(`🚫 Regra de negócio (${erro.codigo}): ${erro.message}`);
    }
    else if (erro instanceof Error) {
        console.error(`❌ Erro inesperado: ${erro.message}`);
    }
}
function main() {
    console.log('===== SISTEMA DE ACERVO =====\n');
    // Repositório genérico guardando QUALQUER ItemAcervo (livros e jogos juntos)
    const acervo = new RepositorioMemoria_1.RepositorioMemoria('Item');
    // --- 1. Cadastro (factory methods + Utility Types) ---
    const livro1 = acervo.adicionar(Livro_1.Livro.criar({ titulo: 'Clean Code', anoLancamento: 2008, autor: 'Robert C. Martin', paginas: 425 }));
    const livro2 = acervo.adicionar(Livro_1.Livro.criar({ titulo: 'O Hobbit', anoLancamento: 1937, autor: 'J.R.R. Tolkien', paginas: 310 }));
    const jogo1 = acervo.adicionar(JogoEletronico_1.JogoEletronico.criar({ titulo: 'The Legend of Zelda', anoLancamento: 2017, plataforma: 'Nintendo Switch' }));
    const jogo2 = new JogoEletronico_1.JogoEletronico('Minecraft', 2011, 'PC');
    acervo.adicionar(jogo2);
    console.log(`Itens cadastrados: ${acervo.total}`);
    acervo.listarTodos().forEach((item) => console.log('  ' + item.apresentar()));
    // --- 2. Empréstimos (métodos de negócio validados) ---
    console.log('\n--- Empréstimos ---');
    livro1.emprestar(diasAtras(20)); // emprestado há 20 dias (prazo 14 -> 6 dias de atraso)
    jogo1.emprestar(diasAtras(10)); // emprestado há 10 dias (prazo 7  -> 3 dias de atraso)
    livro2.emprestar(); // emprestado agora
    console.log(`"${livro1.titulo}": ${livro1.statusDisponibilidade}, há ${livro1.tempoEmprestado} dias`);
    console.log(`"${jogo1.titulo}": ${jogo1.statusDisponibilidade}, há ${jogo1.tempoEmprestado} dias`);
    // --- 3. Reserva (interface Reservavel) ---
    console.log('\n--- Reservas ---');
    jogo1.reservar('Alex');
    console.log(jogo1.apresentar());
    // --- 4. Polimorfismo: mesma chamada, cada classe calcula a multa do seu jeito ---
    console.log('\n--- Simulação de multa por 5 dias de atraso ---');
    acervo.listarTodos().forEach((item) => {
        console.log(`  ${item.tipo.padEnd(16)} "${item.titulo}": ${emReais(item.calcularMulta(5))}`);
    });
    // --- 5. Devoluções (calcula a multa real) ---
    console.log('\n--- Devoluções ---');
    console.log(`"${livro1.titulo}" devolvido. Multa: ${emReais(livro1.devolver())}`);
    console.log(`"${jogo1.titulo}" devolvido. Multa: ${emReais(jogo1.devolver())}`);
    console.log(`"${livro2.titulo}" devolvido. Multa: ${emReais(livro2.devolver())}`);
    // --- 6. Utility Types: resumos Readonly + filtro com Partial ---
    console.log('\n--- Resumo dos jogos disponíveis ---');
    const resumos = acervo.listarTodos().map((item) => item.gerarResumo());
    console.table(filtrar(resumos, { tipo: 'Jogo Eletrônico', status: 'Disponível' }));
    // --- 7. Tratamento de erros (try/catch + erros customizados) ---
    console.log('--- Testando erros ---');
    try {
        jogo2.emprestar();
        jogo2.emprestar(); // ❌ já está emprestado
    }
    catch (erro) {
        tratarErro(erro);
    }
    try {
        acervo.buscarPorId(999); // ❌ id que não existe
    }
    catch (erro) {
        tratarErro(erro);
    }
    try {
        livro2.devolver(); // ❌ não está emprestado
    }
    catch (erro) {
        tratarErro(erro);
    }
    try {
        jogo2.reservar('Maria');
        jogo2.reservar('João'); // ❌ já reservado
    }
    catch (erro) {
        tratarErro(erro);
    }
    try {
        Livro_1.Livro.criar({ titulo: '', anoLancamento: 2020, autor: 'Ninguém', paginas: 100 }); // ❌ título vazio
    }
    catch (erro) {
        tratarErro(erro);
    }
    finally {
        console.log('\n✅ Fim da execução (o finally roda sempre).');
    }
}
main();
