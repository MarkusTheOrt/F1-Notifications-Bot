export interface None {
  readonly _tag: "None";
}

export interface Some<A> {
  readonly _tag: "Some";
  readonly value: A;
}

export type Option<A> = None | Some<A>;

export const none: Option<never> = { _tag: "None" };

export const some = <A>(a: A): Option<Exclude<A, undefined | null>> => ({
  _tag: "Some",
  value: a as Exclude<A, undefined | null>,
});

export const isNone = (fa: Option<unknown>): fa is None => fa._tag === "None";

export const isSome = <A>(fa: Option<A>): fa is Some<A> => fa._tag === "Some";

export const wrap = <A>(a: A): Option<Exclude<A, undefined | null>> => {
  if (a === undefined || a === null) return none;
  return some(a) as Option<Exclude<A, undefined | null>>;
};

export const unwrap = <A>(fa: Option<Exclude<A, undefined | null>>): A => {
  if (isNone(fa)) {
    throw new Error("Failed to unwrap Optional value.");
  }
  return fa.value as A;
};
