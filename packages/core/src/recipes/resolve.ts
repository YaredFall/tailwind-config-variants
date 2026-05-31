import * as path from "pathe";
import type { ResolvedFile } from "../loader";
import type { RecipeDefinition, SlotRecipeDefinition } from "../types";
import { isCVA, isSVA } from "./predicate.ts";

type ResolvedRecipe =
    | { name: string; type: "cva"; definition: RecipeDefinition }
    | { name: string; type: "sva"; definition: SlotRecipeDefinition };

export function resolveRecipe({
    module,
    resolvedPath,
}: ResolvedFile<RecipeDefinition | SlotRecipeDefinition>): ResolvedRecipe {
    const name = path.basename(resolvedPath).split(".")[0] ?? path.basename(resolvedPath);
    if (isCVA(module)) return { name, type: "cva", definition: module };
    if (isSVA(module)) return { name, type: "sva", definition: module };

    throw new Error(`Failed to resolve recipe at ${resolvedPath}`);
}
