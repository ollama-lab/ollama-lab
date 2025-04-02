export const nullIsDefault = <T>(def: T, input: NonNullable<T> | null | undefined) => input === null ? def : input;

export const nullIsEmptyString = (input: string | null | undefined) => input === null ? "" : input;

export const nullIsUndefined = <T>(input: NonNullable<T> | null | undefined) => input ?? undefined;

export const unixTimestampIntoDate = (ts: number) => new Date(ts * 1000);
