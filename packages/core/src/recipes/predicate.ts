import type { RecipeDefinition, SlotRecipeDefinition } from "../types";

export function isCVA(recipe: RecipeDefinition | SlotRecipeDefinition): recipe is RecipeDefinition {
    return "__type" in recipe && recipe.__type === "cva";
}
export function isSVA(recipe: RecipeDefinition | SlotRecipeDefinition): recipe is SlotRecipeDefinition {
    return "__type" in recipe && recipe.__type === "sva";
}
