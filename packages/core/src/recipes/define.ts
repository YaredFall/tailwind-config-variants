import { hash } from "ohash";
import type { RecipeDefinition, SlotRecipeDefinition, SlotVariantsDefinition, VariantsDefinition } from "../types";

export function defineRecipe<V extends VariantsDefinition>(recipe: RecipeDefinition<V>) {
    return Object.assign(recipe, { __type: "cva", hash: hash(recipe) }) as RecipeDefinition;
}

export function defineSlotRecipe<S extends string, SV extends SlotVariantsDefinition<S>>(
    recipe: SlotRecipeDefinition<S, SV>,
) {
    return Object.assign(recipe, { __type: "sva", hash: hash(recipe) }) as SlotRecipeDefinition;
}
