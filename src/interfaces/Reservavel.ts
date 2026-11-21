// ===== INTERFACE / CONTRATO (Aula 6) =====
// Diz O QUE uma classe reservável precisa ter, mas não diz COMO fazer.
// Quem usar "implements Reservavel" é OBRIGADO a criar esses métodos.
export interface Reservavel {
  reservar(nomeCliente: string): void; // reserva o item para um cliente
  cancelarReserva(): void;             // tira a reserva
  readonly reservadoPor: string | null; // quem reservou (ou null se ninguém)
}
