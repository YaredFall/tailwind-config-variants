export type BooleanStringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type Pretty<T> = { [K in keyof T]: T[K] } & {};
