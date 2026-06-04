import { globby } from "globby";
import { loadFile } from "../loader.ts";
import type { RecipeDefinition, SlotRecipeDefinition } from "./types";

async function loadRecipe(path: string) {
    try {
        return await loadFile<RecipeDefinition | SlotRecipeDefinition>(path);
    } catch {
        return undefined;
    }
}

export async function loadRecipes(glob: string | string[]) {
    const paths = await globby(glob, {
        absolute: true,
        onlyFiles: true,
        gitignore: true,
    });

    return (await Promise.all(paths.map((path) => loadRecipe(path)))).filter((f) => f !== undefined);
}
