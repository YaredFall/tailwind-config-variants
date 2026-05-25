type BooleanStringToBoolean<T> = T extends "true" | "false" ? boolean : T;

type Pretty<T> = { [K in keyof T]: T[K] } & {};

export type ClassValue = string | null | undefined;

export type VariantsDefinition = Record<string, Record<string, string>>;
export type SlotVariantsDefinition<S extends string = string> = Record<string, Record<string, { [K in S]?: string }>>;

export type RecipeVariant<V extends VariantsDefinition | SlotVariantsDefinition> = {
    [K in keyof V]?: BooleanStringToBoolean<keyof V[K]>;
};

export type VariantKeys<V extends VariantsDefinition | SlotVariantsDefinition> = Array<keyof V>;
export type VariantMap<V extends VariantsDefinition | SlotVariantsDefinition> = Pretty<{
    [K in keyof V]: Array<keyof V[K]>;
}>;

export type Recipe<V extends VariantsDefinition = VariantsDefinition> = {
    className?: string;
    base?: string;
    variants?: V;
    defaultVariants?: RecipeVariant<V>;
};

export type SlotRecipe<S extends string = string, SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>> = {
    className?: string;
    base?: Record<S, string>;
    variants?: SV;
    defaultVariants?: RecipeVariant<SV>;
};

export interface CVA<V extends VariantsDefinition = VariantsDefinition> {
    (variant?: RecipeVariant<V>, ...className: ClassValue[]): string;
    variantKeys: VariantKeys<V>;
    variantMap: VariantMap<V>;
    splitProps: <P extends RecipeVariant<V>>(props: P) => [Pick<P, keyof V>, Omit<P, keyof V>];
}

export interface SVA<S extends string = string, SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>> {
    (variant?: RecipeVariant<SV>): { [K in S]: (...className: ClassValue[]) => string };
    variantKeys: VariantKeys<SV>;
    variantMap: VariantMap<SV>;
    splitProps: <P extends RecipeVariant<SV>>(props: P) => [Pick<P, keyof SV>, Omit<P, keyof SV>];
}

export type RecipeVariantProps<V extends CVA | SVA> = Pretty<NonNullable<Parameters<V>[0]>>;

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
