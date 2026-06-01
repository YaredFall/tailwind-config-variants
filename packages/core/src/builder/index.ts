import type { ResolvedConfig } from "../config/resolve.ts";
import { LIBRARY_NAME } from "../constant.ts";
import type { ResolvedRecipe, ResolvedSlotRecipe } from "../recipes/resolve.ts";
import { BuilderContext } from "./context.ts";
import { processCVA } from "./process-cva.ts";
import { processSVA } from "./process-sva.ts";
import { Writer } from "./writer.ts";

type BuilderParams = {
    recipes: (ResolvedRecipe | ResolvedSlotRecipe)[];
    config: ResolvedConfig;
};

export function execute({ config, recipes }: BuilderParams) {
    const start = performance.now();

    const writer = new Writer(config);

    writer.setup();

    writer.writeCN();
    writer.writeCVA();
    writer.writeSVA();

    const ctx = new BuilderContext();

    for (const recipe of recipes) {
        if (recipe.type === "cva") processCVA(ctx, recipe);
        else if (recipe.type === "sva") processSVA(ctx, recipe);
    }

    ctx.recipes.forEach((recipe) => {
        writer.writeRecipe(recipe);
    });

    writer.writeTailwindPlugin(ctx.components);

    const end = performance.now();
    console.log(
        `[${LIBRARY_NAME}] Generated ${ctx.components.length} declaration(s) for ${ctx.recipes.size} recipe(s) in ${(end - start).toFixed(2)}ms`,
    );
}
