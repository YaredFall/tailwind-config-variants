import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import * as path from "pathe";
import type { ResolvedConfig } from "../config/resolve";
import cnTemplate from "../templates/cn.ts";
import cvaTemplate from "../templates/cva.ts";
import recipeTemplate from "../templates/recipe.ts";
import svaTemplate from "../templates/sva.ts";
import tailwindTemplate from "../templates/tailwind-plugin.ts";
import type { ComponentData, RecipeData } from "./context";

const RECIPES_FOLDER = "recipes";

export class Writer {
    #outDir: string;
    #recipesDir: string;

    #tailwindContent: string[];

    constructor(config: ResolvedConfig) {
        this.#outDir = path.resolve(config.rootDir, config.outDir);
        this.#recipesDir = path.resolve(config.rootDir, this.#outDir, RECIPES_FOLDER);

        this.#tailwindContent = [this.#recipesDir, ...config.recipes.map((p) => `!${path.resolve(config.rootDir, p)}`)];
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

    writeCN() {
        this.write("cn.ts", cnTemplate());
    }

    writeCVA() {
        this.write("cva.ts", cvaTemplate());
    }

    writeSVA() {
        this.write("sva.ts", svaTemplate());
    }

    writeTailwindPlugin(components: ComponentData[]) {
        this.write("plugin.ts", tailwindTemplate(components, this.#tailwindContent));
    }

    writeRecipe(recipe: RecipeData) {
        this.write(path.join(RECIPES_FOLDER, `${recipe.name}.ts`), recipeTemplate(recipe));
    }
}
