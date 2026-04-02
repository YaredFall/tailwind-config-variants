import type { Recipe, SlotRecipe, SlotVariantMap, VariantsMap } from "./types";

export function defineRecipe<V extends VariantsMap>(recipe: Recipe<V>) {
    return Object.assign(recipe, { __type: "cva" });
}

export function defineSlotRecipe<S extends string, SV extends SlotVariantMap<S>>(recipe: SlotRecipe<S, SV>) {
    return Object.assign(recipe, { __type: "sva" });
}
