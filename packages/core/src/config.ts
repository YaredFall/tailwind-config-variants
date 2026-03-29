import type { Recipe, VariantsMap } from "./types";

export type TailwindConfigVariantsOptions = {
    /**
     * List of your component recipes
     */
    recipes?: Record<string, Recipe<VariantsMap>>;
    /**
     * Output directory for generated files
     */
    outDir?: string;
};

export function defineConfig(config: TailwindConfigVariantsOptions) {
    return config;
}
