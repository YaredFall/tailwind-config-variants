import * as path from "pathe";
import type { ResolvedFile } from "../loader";
import type { RecipeDefinition, SlotRecipeDefinition } from "../types";

export type ResolvedRecipeDefinition = RecipeDefinition & { hash: string };
export type ResolvedSlotRecipeDefinition = SlotRecipeDefinition & { hash: string };

export type ResolvedRecipe = { name: string; type: "cva"; definition: ResolvedRecipeDefinition };
export type ResolvedSlotRecipe = { name: string; type: "sva"; definition: ResolvedSlotRecipeDefinition };

function isCVA(recipe: RecipeDefinition | SlotRecipeDefinition): recipe is ResolvedRecipeDefinition {
    return "__type" in recipe && recipe.__type === "cva";
}
function isSVA(recipe: RecipeDefinition | SlotRecipeDefinition): recipe is ResolvedSlotRecipeDefinition {
    return "__type" in recipe && recipe.__type === "sva";
}

export function resolveRecipe({
    module,
    resolvedPath,
}: ResolvedFile<RecipeDefinition | SlotRecipeDefinition>): ResolvedRecipe | ResolvedSlotRecipe {
    const name = path.basename(resolvedPath).split(".")[0] ?? path.basename(resolvedPath);
    if (isCVA(module)) return { name, type: "cva", definition: module };
    if (isSVA(module)) return { name, type: "sva", definition: module };

    throw new Error(`Failed to resolve recipe at ${resolvedPath}`);
}

export function resolveRecipes(files: ResolvedFile<RecipeDefinition | SlotRecipeDefinition>[]) {
    const resolved: (ResolvedRecipe | ResolvedSlotRecipe)[] = [];
    files.forEach((file) => {
        try {
            resolved.push(resolveRecipe(file));
        } catch {
            // Skip unresolved
        }
    });
    return resolved;
}
