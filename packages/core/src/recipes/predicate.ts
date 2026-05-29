import type { Recipe, SlotRecipe } from "../types";

export function isCVA(recipe: Recipe | SlotRecipe): recipe is Recipe {
    return "__type" in recipe && recipe.__type === "cva";
}
export function isSVA(recipe: Recipe | SlotRecipe): recipe is SlotRecipe {
    return "__type" in recipe && recipe.__type === "sva";
}
