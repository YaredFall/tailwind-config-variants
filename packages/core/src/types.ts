export type ClassValue = string | null | undefined;

type BooleanStringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type VariantsMap = Record<string, Record<string, string>>;
export type Variant<V extends VariantsMap> = { [K in keyof V]?: BooleanStringToBoolean<keyof V[K]> };
export type SlotVariantMap<S extends string = string> = Record<string, Record<string, { [K in S]?: string }>>;
export type SlotVariant<SV extends SlotVariantMap> = { [K in keyof SV]?: BooleanStringToBoolean<keyof SV[K]> };

export type Recipe<V extends VariantsMap = VariantsMap> = {
    className?: string;
    base?: string;
    variants?: V;
    defaultVariants?: Variant<V>;
};

export type SlotRecipe<S extends string = string, SV extends SlotVariantMap<S> = SlotVariantMap<S>> = {
    className?: string;
    base?: Record<S, string>;
    variants?: SV;
    defaultVariants?: SlotVariant<SV>;
};
