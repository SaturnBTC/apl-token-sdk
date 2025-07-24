export class InvalidCOptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCOptionError';
  }
}
