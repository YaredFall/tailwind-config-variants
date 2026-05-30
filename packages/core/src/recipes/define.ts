import type { RecipeDefinition, SlotRecipeDefinition, SlotVariantsDefinition, VariantsDefinition } from "../types";

export function defineRecipe<V extends VariantsDefinition>(recipe: RecipeDefinition<V>) {
    return Object.assign(recipe, { __type: "cva" });
}

export function defineSlotRecipe<S extends string, SV extends SlotVariantsDefinition<S>>(
    recipe: SlotRecipeDefinition<S, SV>,
) {
    return Object.assign(recipe, { __type: "sva" });
}
