import type { Recipe, VariantsMap } from "./types";

export function defineRecipe<V extends VariantsMap>(recipe: Recipe<V>) {
    return recipe;
}
