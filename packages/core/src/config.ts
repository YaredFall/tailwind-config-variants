import type { Recipe, SlotRecipe } from "./types";

export type TailwindConfigVariantsOptions = {
    /**
     * List of your component recipes
     */
    recipes?: Record<string, Recipe | SlotRecipe>;
    /**
     * Output directory for generated files
     */
    outDir?: string;
};

export function defineConfig(config: TailwindConfigVariantsOptions) {
    return config;
}
