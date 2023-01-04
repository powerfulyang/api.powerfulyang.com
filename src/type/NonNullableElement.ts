export type NonNullableElement<T> = T extends (infer U)[] ? NonNullable<U>[] : T;
export type NonEmptyArray<T> = [T, ...T[]];
