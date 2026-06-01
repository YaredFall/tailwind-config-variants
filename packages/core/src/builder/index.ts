import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import * as path from "pathe";
import type { ResolvedConfig } from "../config/resolve.ts";
import { LIBRARY_NAME } from "../constant.ts";
import type { ResolvedRecipe, ResolvedSlotRecipe } from "../recipes/resolve.ts";
import cnTemplate from "../templates/cn.ts";
import cvaTemplate from "../templates/cva.ts";
import recipeTemplate from "../templates/recipe.ts";
import svaTemplate from "../templates/sva.ts";
import tailwindTemplate from "../templates/tailwind.ts";
import { BuilderContext } from "./context.ts";
import { processCVA } from "./process-cva.ts";
import { processSVA } from "./process-sva.ts";

type BuilderParams = {
    recipes: (ResolvedRecipe | ResolvedSlotRecipe)[];
    config: ResolvedConfig;
};

export function execute({ config, recipes }: BuilderParams) {
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

    for (const recipe of recipes) {
        if (recipe.type === "cva") processCVA(ctx, recipe);
        else if (recipe.type === "sva") processSVA(ctx, recipe);
    }

    ctx.recipes.forEach((recipe) => {
        writeFileSync(path.join(recipesDir, `${recipe.name}.ts`), recipeTemplate(recipe));
    });

    const twContent = [recipesDir, ...config.recipes.map((p) => `!${path.resolve(config.rootDir, p)}`)];
    writeFileSync(path.join(outDir, "plugin.ts"), tailwindTemplate(ctx.components, twContent));

    const end = performance.now();
    console.log(
        `[${LIBRARY_NAME}] Generated ${ctx.components.length} declaration(s) for ${ctx.recipes.size} recipe(s) in ${(end - start).toFixed(2)}ms`,
    );
}
