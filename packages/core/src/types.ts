export type ClassValue = string | null | undefined;

type BooleanStringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type VariantsDefinition = Record<string, Record<string, string>>;
export type Variant<V extends VariantsDefinition> = { [K in keyof V]?: BooleanStringToBoolean<keyof V[K]> };
export type SlotVariantsDefinition<S extends string = string> = Record<string, Record<string, { [K in S]?: string }>>;
export type SlotVariant<SV extends SlotVariantsDefinition> = { [K in keyof SV]?: BooleanStringToBoolean<keyof SV[K]> };

export type Recipe<V extends VariantsDefinition = VariantsDefinition> = {
    className?: string;
    base?: string;
    variants?: V;
    defaultVariants?: Variant<V>;
};

export type SlotRecipe<S extends string = string, SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>> = {
    className?: string;
    base?: Record<S, string>;
    variants?: SV;
    defaultVariants?: SlotVariant<SV>;
};

export interface CVA<V extends VariantsDefinition = VariantsDefinition> {
    (variant?: Variant<V>, ...className: ClassValue[]): string;
    splitProps: <P extends Variant<V>>(props: P) => [Pick<P, keyof V>, Omit<P, keyof V>];
}

export interface SVA<S extends string = string, SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>> {
    (variant?: SlotVariant<SV>): { [K in S]: (...className: ClassValue[]) => string };
    splitProps: <P extends SlotVariant<SV>>(props: P) => [Pick<P, keyof SV>, Omit<P, keyof SV>];
}

export type TailwindConfigVariantsOptions = {
    rootDir?: string;
    /**
     * Output directory for generated files
     */
    outDir?: string;
    /**
     * Recipe files glob pattern
     */
    recipes?: string[];
};
