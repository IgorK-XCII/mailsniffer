/**
 * Value of `T`, or explicit absence-of-value via `null`.
 *
 * Use this anywhere the domain models a slot that can be empty (selection,
 * optional foreign key, header that may be missing). Prefer `T | undefined`
 * for "not yet initialized" semantics — `Nullable<T>` is for "explicitly
 * empty".
 */
export type Nullable<T> = T | null;
