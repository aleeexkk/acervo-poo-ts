# Sistema de Acervo — POO com TypeScript

Aplicação de console que gerencia um acervo de **Livros** e **Jogos Eletrônicos** (cadastro, empréstimo, devolução com multa e reserva), consolidando os conceitos de Orientação a Objetos da disciplina.

## Como rodar

```bash
npm install        # instala as dependências
npm run dev        # roda direto do TypeScript (ts-node)
npm run build      # compila src/ -> dist/ (tsc)
npm start          # roda a versão compilada (node dist/index.js)
```

## Estrutura

```
src/
├── index.ts                  # ponto de entrada (demonstração)
├── domain/
│   ├── ItemAcervo.ts         # classe abstrata base
│   ├── Livro.ts              # subclasse concreta
│   └── JogoEletronico.ts     # subclasse concreta + implements Reservavel
├── interfaces/
│   ├── EntidadeBase.ts       # contrato mínimo (readonly id)
│   └── Reservavel.ts         # contrato de reserva
├── repository/
│   └── RepositorioMemoria.ts # repositório genérico <T extends EntidadeBase>
├── errors/
│   └── AppErrors.ts          # erros customizados
└── types/
    └── DTOs.ts               # Utility Types (Omit, Pick, Readonly, Partial)
dist/                         # código JavaScript compilado
```

## Onde está cada requisito

| Aula | Requisito | Onde |
|---|---|---|
| 1 | `src/`, `dist/`, `tsconfig.json` com `"strict": true`, ts-node e tsc | `tsconfig.json`, `package.json` |
| 2 | Classes, construtores com Parameter Properties, arrays de objetos | `ItemAcervo`, `Livro`, `JogoEletronico`, `RepositorioMemoria` |
| 3 | Atributos `private`, métodos validados `emprestar()`/`devolver()`, `readonly id` | `ItemAcervo.ts` |
| 4 | Getters calculados `statusDisponibilidade` e `tempoEmprestado`, `private static _contadorId` | `ItemAcervo.ts` |
| 5 | `abstract class ItemAcervo`, `calcularMulta()` abstrato, `extends`, `super()`, `override` | `domain/` |
| 6 | Interface `Reservavel` com `implements` | `Reservavel.ts`, `JogoEletronico.ts` |
| 7 | `RepositorioMemoria<T>`, Utility Types, erros customizados com `try/catch` | `repository/`, `types/`, `errors/`, `index.ts` |

## Regras de negócio

| Item | Prazo | Multa por atraso |
|---|---|---|
| Livro | 14 dias | R$ 1,00 por dia |
| Jogo Eletrônico | 7 dias | R$ 2,50 por dia + R$ 5,00 de taxa fixa |
