import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import * as path from "pathe";
import type { ResolvedConfig } from "../config/resolve-config.ts";
import { PLUGIN_NAME } from "../constant.ts";
import { isCVA, isSVA } from "../recipes/predicate.ts";
import cnTemplate from "../templates/cn.ts";
import cvaTemplate from "../templates/cva.ts";
import recipeTemplate from "../templates/recipe.ts";
import slotRecipeTemplate from "../templates/slot-recipe.ts";
import svaTemplate from "../templates/sva.ts";
import tailwindTemplate from "../templates/tailwind.ts";
import type { Recipe, SlotRecipe } from "../types.ts";
import { BuilderContext } from "./context.ts";
import { processCVA } from "./process-cva.ts";
import { processSVA } from "./process-sva.ts";

export function execute(recipes: Record<string, Recipe | SlotRecipe>, config: ResolvedConfig) {
    const start = performance.now();

    const outDir = path.resolve(config.rootDir, config.outDir);
    const recipesDir = path.resolve(config.rootDir, outDir, "recipes");

    try {
        rmSync(outDir, { recursive: true });
    } catch {
        // Directory doesn't exist, ignore
    }
    mkdirSync(recipesDir, { recursive: true });

    writeFileSync(path.join(outDir, "cn.ts"), cnTemplate());
    writeFileSync(path.join(outDir, "cva.ts"), cvaTemplate());
    writeFileSync(path.join(outDir, "sva.ts"), svaTemplate());

    const ctx = new BuilderContext();

    for (const name in recipes) {
        const recipe = recipes[name];
        if (!recipe) continue;

        if (isCVA(recipe)) {
            processCVA(ctx, name, recipe);
        } else if (isSVA(recipe)) {
            processSVA(ctx, name, recipe);
        }
    }

    ctx.recipes.forEach((recipe, key) => {
        writeFileSync(path.join(recipesDir, `${key}.ts`), recipeTemplate(key, recipe));
    });
    ctx.slotRecipes.forEach((recipe, key) => {
        writeFileSync(path.join(recipesDir, `${key}.ts`), slotRecipeTemplate(key, recipe));
    });

    const twContent = [recipesDir, ...config.recipes.map((p) => `!${path.resolve(config.rootDir, p)}`)];
    writeFileSync(path.join(outDir, "plugin.ts"), tailwindTemplate(ctx.components, twContent));

    const end = performance.now();
    console.log(
        `[${PLUGIN_NAME}] Generated ${ctx.components.length} declaration(s) for ${ctx.recipes.size} recipe(s) and ${ctx.slotRecipes.size} slot recipe(s) in ${(end - start).toFixed(2)}ms`,
    );
}
