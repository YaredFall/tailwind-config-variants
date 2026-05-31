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

export interface Recipe<V extends VariantsDefinition = VariantsDefinition> {
    base: string;
    variants: V;
    defaultVariants: RecipeVariant<V>;
}

export interface RecipeDefinition<V extends VariantsDefinition = VariantsDefinition> extends Partial<Recipe<V>> {
    className?: string;
}

export interface SlotRecipe<
    S extends string = string,
    SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>,
> {
    base: Record<S, string>;
    variants: SV;
    defaultVariants: RecipeVariant<SV>;
}

export interface SlotRecipeDefinition<
    S extends string = string,
    SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>,
> extends Partial<SlotRecipe<S, SV>> {
    className?: string;
}

export type CVA<V extends VariantsDefinition = VariantsDefinition> = (
    variant?: RecipeVariant<V>,
    ...className: ClassValue[]
) => string;

export type SVA<S extends string = string, SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>> = (
    variant?: RecipeVariant<SV>,
) => { [K in S]: (...className: ClassValue[]) => string };

export type RecipeVariantProps<V extends CVA<VariantsDefinition> | SVA<string, SlotVariantsDefinition<string>>> =
    Pretty<NonNullable<Parameters<V>[0]>>;

