import type { ResolvedFile } from "../loader";
import type { TailwindConfigVariantsOptions } from "./define";

const DEFAULT_OUT_DIR = ".config-variants";
const DEFAULT_RECIPES_GLOB = ["**/*.recipe.{ts,js}"];

export type ResolvedConfig = Required<TailwindConfigVariantsOptions>;

export function resolveConfig(file: ResolvedFile<TailwindConfigVariantsOptions> | undefined): ResolvedConfig {
    const { module } = file ?? {};

    return {
        rootDir: module?.rootDir || process.cwd(),
        outDir: module?.outDir || DEFAULT_OUT_DIR,
        recipes: module?.recipes || DEFAULT_RECIPES_GLOB,
    };
}
