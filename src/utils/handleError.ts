export function handleError(
  customMessage: string,
  errorDetails: unknown,
): void {
  const { message } = errorDetails as Error;
  console.error(customMessage, message);
  throw new Error(`${customMessage} ${message}`);
}
