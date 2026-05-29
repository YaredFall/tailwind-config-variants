import { globby } from "globby";
import * as path from "pathe";
import type { PluginCreator } from "postcss";
import { execute } from "./builder/index.ts";
import { resolveConfig } from "./config/resolve.ts";
import { CONFIG_FILENAME, POSTCSS_PLUGIN_NAME } from "./constant.ts";
import { loadFile } from "./loader.ts";
import { isCVA, isSVA } from "./recipes/predicate.ts";
import type { Recipe, SlotRecipe, TailwindConfigVariantsOptions } from "./types.ts";

const plugin = (): ReturnType<PluginCreator<unknown>> => {
    return {
        postcssPlugin: POSTCSS_PLUGIN_NAME,

        async Once(_, { result }) {
            const config = await loadFile<TailwindConfigVariantsOptions>(path.resolve(CONFIG_FILENAME)).catch(() => {});

            if (config) {
                result.messages.push({
                    type: "dependency",
                    plugin: POSTCSS_PLUGIN_NAME,
                    file: config.resolvedPath,
                    parent: result.opts.from,
                });
            }

            const resolvedConfig = resolveConfig(config?.module);

            const recipePaths = await globby(resolvedConfig.recipes, {
                absolute: true,
                onlyFiles: true,
                gitignore: true,
            });

            if (recipePaths.length === 0) {
                execute({}, resolvedConfig);
                return;
            }

            const loadedRecipes = await Promise.all(recipePaths.map((path) => loadFile<Recipe | SlotRecipe>(path)));

            const recipes = {} as Record<string, Recipe | SlotRecipe>;
            loadedRecipes.forEach((recipe) => {
                if (isCVA(recipe.module) || isSVA(recipe.module)) {
                    const name = path.basename(recipe.resolvedPath).split(".")[0] ?? path.basename(recipe.resolvedPath);
                    recipes[name] = recipe.module;

                    result.messages.push({
                        type: "dependency",
                        plugin: POSTCSS_PLUGIN_NAME,
                        file: recipe.resolvedPath,
                        parent: result.opts.from,
                    });
                }
            });

            execute(recipes, resolvedConfig);
        },
    };
};

plugin.postcss = true;

export default plugin;
