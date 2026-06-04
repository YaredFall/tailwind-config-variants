import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import * as path from "pathe";
import type { ResolvedConfig } from "../config/resolve";
import cvaTemplate from "../templates/cva.ts";
import cxTemplate from "../templates/cx.ts";
import recipeTemplate from "../templates/recipe.ts";
import svaTemplate from "../templates/sva.ts";
import { tailwindContentTemplate } from "../templates/tailwind-content.ts";
import tailwindMergeTemplate from "../templates/tailwind-merge.ts";
import tailwindTemplate from "../templates/tailwind-plugin.ts";
import type { BuilderContext, GroupsData, RecipeData } from "./context";

const RECIPES_FOLDER = "recipes";

export class Writer {
    #outDir: string;
    #recipesDir: string;

    #tailwindContent: string[];

    constructor(config: ResolvedConfig) {
        this.#outDir = path.resolve(config.rootDir, config.outDir);
        this.#recipesDir = path.resolve(config.rootDir, this.#outDir, RECIPES_FOLDER);

        this.#tailwindContent = [
            path.join(this.#outDir, "tailwind-content.json"),
            ...config.recipes.map((p) => `!${path.resolve(config.rootDir, p)}`),
        ];
    }

    setup() {
        try {
            rmSync(this.#outDir, { recursive: true });
        } catch {
            // Directory doesn't exist, ignore
        }
        mkdirSync(this.#recipesDir, { recursive: true });
    }

    private write(pathname: string, content: string) {
        writeFileSync(path.join(this.#outDir, pathname), content);
    }

    writeCX() {
        this.write("cx.ts", cxTemplate());
    }

    writeCVA() {
        this.write("cva.ts", cvaTemplate());
    }

    writeSVA() {
        this.write("sva.ts", svaTemplate());
    }

    writeTailwindPlugin(ctx: BuilderContext) {
        this.write(
            "tailwind-content.json",
            tailwindContentTemplate({ components: ctx.components, recipes: ctx.recipes }),
        );
        this.write("tailwind-plugin.js", tailwindTemplate(ctx.components, this.#tailwindContent));
    }

    writeTailwindMergePlugin(groups: GroupsData) {
        this.write("tailwind-merge.ts", tailwindMergeTemplate(groups));
    }

    writeRecipe(recipe: RecipeData) {
        this.write(path.join(RECIPES_FOLDER, `${recipe.name}.ts`), recipeTemplate(recipe));
    }
}
