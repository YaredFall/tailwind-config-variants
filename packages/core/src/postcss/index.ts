import path from "node:path";
import { globby } from "globby";
import type { PluginCreator } from "postcss";
import { resolveConfig } from "../config/resolve-config.ts";
import type { Recipe, SlotRecipe, TailwindConfigVariantsOptions } from "../types.ts";
import { apply } from "./builder.ts";
import { CONFIG_FILENAME, PLUGIN_NAME } from "./constant.ts";
import { loadFile } from "./load-file.ts";
import { isCVA, isSVA } from "./misc.ts";

const plugin = (): ReturnType<PluginCreator<unknown>> => {
    return {
        postcssPlugin: PLUGIN_NAME,

        // OnceExit runs after all other plugins, once per CSS document.
        async Once(root, { result }) {
            const config = await loadFile<TailwindConfigVariantsOptions>(path.resolve(CONFIG_FILENAME)).catch(() => {});

            if (config) {
                result.messages.push({
                    type: "dependency",
                    plugin: PLUGIN_NAME,
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
                apply(root, {}, resolvedConfig);
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
                        plugin: PLUGIN_NAME,
                        file: recipe.resolvedPath,
                        parent: result.opts.from,
                    });
                }
            });

            apply(root, recipes, resolvedConfig);
        },
    };
};

plugin.postcss = true;

export default plugin;
