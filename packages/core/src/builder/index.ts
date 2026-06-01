import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import * as path from "pathe";
import type { ResolvedConfig } from "../config/resolve.ts";
import { LIBRARY_NAME } from "../constant.ts";
import type { ResolvedRecipe, ResolvedSlotRecipe } from "../recipes/resolve.ts";
import cnTemplate from "../templates/cn.ts";
import cvaTemplate from "../templates/cva.ts";
import recipeTemplate from "../templates/recipe.ts";
import slotRecipeTemplate from "../templates/slot-recipe.ts";
import svaTemplate from "../templates/sva.ts";
import tailwindTemplate from "../templates/tailwind.ts";
import { BuilderContext } from "./context.ts";
import { processCVA } from "./process-cva.ts";
import { processSVA } from "./process-sva.ts";

export function execute(recipes: (ResolvedRecipe | ResolvedSlotRecipe)[], config: ResolvedConfig) {
    const start = performance.now();

    const ctx = new BuilderContext();

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

    for (const recipe of recipes) {
        const { type, name, definition } = recipe;

        if (type === "cva") processCVA(ctx, name, definition);
        else if (type === "sva") processSVA(ctx, name, definition);
    }

    ctx.recipes.forEach(({ name, definition }) => {
        writeFileSync(path.join(recipesDir, `${name}.ts`), recipeTemplate(name, definition));
    });
    ctx.slotRecipes.forEach(({ name, definition }) => {
        writeFileSync(path.join(recipesDir, `${name}.ts`), slotRecipeTemplate(name, definition));
    });

    const twContent = [recipesDir, ...config.recipes.map((p) => `!${path.resolve(config.rootDir, p)}`)];
    writeFileSync(path.join(outDir, "plugin.ts"), tailwindTemplate(ctx.components, twContent));

    const end = performance.now();
    console.log(
        `[${LIBRARY_NAME}] Generated ${ctx.components.length} declaration(s) for ${ctx.recipes.size} recipe(s) and ${ctx.slotRecipes.size} slot recipe(s) in ${(end - start).toFixed(2)}ms`,
    );
}
