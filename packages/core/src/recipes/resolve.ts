import * as path from "pathe";
import type { ResolvedFile } from "../loader";
import type { RecipeDefinition, SlotRecipeDefinition } from "./types";

export type ResolvedRecipeDefinition = RecipeDefinition;
export type ResolvedSlotRecipeDefinition = SlotRecipeDefinition;

export type ResolvedRecipe = { id: string; name: string; type: "cva"; definition: ResolvedRecipeDefinition };
export type ResolvedSlotRecipe = { id: string; name: string; type: "sva"; definition: ResolvedSlotRecipeDefinition };

export type ResolvedRecipes = Map<string, ResolvedRecipe | ResolvedSlotRecipe>;

function isCVA(recipe: RecipeDefinition | SlotRecipeDefinition): recipe is ResolvedRecipeDefinition {
    return "__type" in recipe && recipe.__type === "cva";
}
function isSVA(recipe: RecipeDefinition | SlotRecipeDefinition): recipe is ResolvedSlotRecipeDefinition {
    return "__type" in recipe && recipe.__type === "sva";
}

export function resolveRecipes(files: ResolvedFile<RecipeDefinition | SlotRecipeDefinition>[]): ResolvedRecipes {
    const resolved: ResolvedRecipes = new Map();

    const getUID = () => {
        let id = generateID();
        while (resolved.has(id)) id = generateID();
        return id;
    };

    files.forEach(({ module, resolvedPath }) => {
        const name = path.basename(resolvedPath).split(".")[0] ?? path.basename(resolvedPath);

        if (isCVA(module)) {
            const id = getUID();
            resolved.set(id, { id, name, type: "cva", definition: module });
        }
        if (isSVA(module)) {
            const id = getUID();
            resolved.set(id, { id, name, type: "sva", definition: module });
        }
    });

    return resolved;
}

function generateID() {
    return Math.random().toString(36).slice(2);
}
