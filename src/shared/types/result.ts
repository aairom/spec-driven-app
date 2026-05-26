/**
 * Result type for explicit error handling
 * Represents either a success (Ok) or failure (Err)
 */
export type Result<T, E> = Ok<T> | Err<E>;

export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

/**
 * Create a successful result
 */
export const ok = <T>(value: T): Ok<T> => ({
  ok: true,
  value,
});

/**
 * Create a failed result
 */
export const err = <E>(error: E): Err<E> => ({
  ok: false,
  error,
});

/**
 * Check if result is Ok
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.ok;

/**
 * Check if result is Err
 */
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => !result.ok;

/**
 * Map the value of an Ok result
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  return isOk(result) ? ok(fn(result.value)) : result;
};

/**
 * Map the error of an Err result
 */
export const mapErr = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  return isErr(result) ? err(fn(result.error)) : result;
};

/**
 * Chain operations that return Results
 */
export const andThen = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  return isOk(result) ? fn(result.value) : result;
};

/**
 * Unwrap a Result, throwing if it's an error
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(`Attempted to unwrap an Err: ${JSON.stringify(result.error)}`);
};

/**
 * Unwrap a Result or return a default value
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return isOk(result) ? result.value : defaultValue;
};

// Made with Bob
