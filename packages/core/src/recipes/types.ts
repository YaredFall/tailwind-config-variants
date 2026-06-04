import type * as CSS from "csstype";
import type { BooleanStringToBoolean } from "../system-types";

type StylesObject = CSS.Properties & { [K in `--${string}`]: string };

export type StyleDeclaration = string | StylesObject;
export type VariantsDefinition = Record<string, Record<string, StyleDeclaration>>;

export type RecipeVariant<V extends VariantsDefinition | SlotVariantsDefinition> = {
    [K in keyof V]?: BooleanStringToBoolean<keyof V[K]>;
};

export interface RecipeDefinition<V extends VariantsDefinition = VariantsDefinition> {
    className?: string;
    base?: StyleDeclaration;
    variants?: V;
    defaultVariants?: RecipeVariant<V>;
}

export type SlotVariantsDefinition<S extends string = string> = Record<
    string,
    Record<string, { [K in S]?: StyleDeclaration }>
>;

export interface SlotRecipeDefinition<
    S extends string = string,
    SV extends SlotVariantsDefinition<S> = SlotVariantsDefinition<S>,
> {
    className?: string;
    base?: Record<S, StyleDeclaration>;
    variants?: SV;
    defaultVariants?: RecipeVariant<SV>;
}
