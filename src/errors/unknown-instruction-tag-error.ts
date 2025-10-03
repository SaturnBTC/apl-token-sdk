export class UnknownInstructionTagError extends Error {
  constructor(tag: number) {
    super(`Unknown instruction tag: ${tag}`);
    this.name = 'UnknownInstructionTagError';
  }
}
