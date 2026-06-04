import type { ResolvedConfig } from "../config/resolve.ts";
import * as logger from "../logger.ts";
import type { ResolvedRecipes } from "../recipes/resolve.ts";
import { BuilderContext } from "./context.ts";
import { processCVA } from "./process-cva.ts";
import { processSVA } from "./process-sva.ts";
import { Writer } from "./writer.ts";

type BuilderParams = {
    config: ResolvedConfig;
    recipes: ResolvedRecipes;
};

export function execute({ config, recipes }: BuilderParams) {
    const inform = logger.measure();

    const writer = new Writer(config);

    writer.setup();

    writer.writeCX();
    writer.writeCVA();
    writer.writeSVA();

    const ctx = new BuilderContext();

    recipes.forEach((recipe) => {
        if (recipe.type === "cva") processCVA(ctx, recipe);
        else if (recipe.type === "sva") processSVA(ctx, recipe);
    });

    ctx.recipes.forEach((recipe) => {
        writer.writeRecipe(recipe);
    });

    writer.writeTailwindPlugin(ctx);
    writer.writeTailwindMergePlugin(ctx.groups);

    inform(`Generated ${ctx.components.length} declaration(s) for ${ctx.recipes.size} recipe(s) in {time}`);
}
