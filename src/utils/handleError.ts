export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }
}

export function handleError(
  customMessage: string,
  errorDetails: unknown,
): void {
  if (errorDetails instanceof CustomError) {
    console.error(errorDetails?.message);
    throw new Error(errorDetails?.message);
  } else if (errorDetails instanceof Error) {
    console.error(`${customMessage} ${errorDetails?.message}`);
    throw new Error(`${customMessage} ${errorDetails?.message}`);
  }
}
