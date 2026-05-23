import type { Recipe, SlotRecipe, SlotVariantsDefinition, VariantsDefinition } from "./types";

export function defineRecipe<V extends VariantsDefinition>(recipe: Recipe<V>) {
    return Object.assign(recipe, { __type: "cva" });
}

export function defineSlotRecipe<S extends string, SV extends SlotVariantsDefinition<S>>(recipe: SlotRecipe<S, SV>) {
    return Object.assign(recipe, { __type: "sva" });
}
