import { none, Option, some } from "./Optional.js";

export default async <T>(
  promise: Promise<T>
): Promise<Option<Exclude<T, null | undefined>>> => {
  try {
    const val = await promise;
    if (val === null || val === undefined) return none;
    return some(val) as Option<Exclude<T, null | undefined>>;
  } catch (e) {
    return none;
  }
};
