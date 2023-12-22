/**
 * Convert caught exception to an instance of Error.
 * Typescript makes it very explicit that in the catch clause the caught exception can be of any type:
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
 * */
export function exceptionToError(exception: unknown): Error {
  return exception instanceof Error ? exception : new Error(String(exception));
}
