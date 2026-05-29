import type { TailwindConfigVariantsOptions } from "../types";

const DEFAULT_OUT_DIR = ".config-variants";
const DEFAULT_RECIPES_GLOB = ["**/*.recipe.{ts,js}"];

export type ResolvedConfig = Required<TailwindConfigVariantsOptions>;

export function resolveConfig(userConfig?: TailwindConfigVariantsOptions): ResolvedConfig {
    return {
        rootDir: userConfig?.rootDir || process.cwd(),
        outDir: userConfig?.outDir || DEFAULT_OUT_DIR,
        recipes: userConfig?.recipes || DEFAULT_RECIPES_GLOB,
    };
}
