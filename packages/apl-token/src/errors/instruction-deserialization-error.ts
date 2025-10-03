export class InstructionDeserializationError extends Error {
  constructor(
    message: string,
    public readonly tag?: number,
  ) {
    super(message);
    this.name = 'InstructionDeserializationError';
  }
}
