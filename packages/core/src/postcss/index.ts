import path from "node:path";
import glob from "fast-glob";
import type { PluginCreator } from "postcss";
import type { TailwindConfigVariantsOptions } from "../config.ts";
import type { Recipe, SlotRecipe } from "../types.ts";
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

            const recipePaths = await glob("**/*.recipe.{ts,js}", { ignore: ["**/node_modules"], absolute: true });

            const loadedRecipes = await Promise.all(recipePaths.map((path) => loadFile<Recipe | SlotRecipe>(path)));

            const recipes = {} as Record<string, Recipe | SlotRecipe>;
            loadedRecipes.forEach((recipe) => {
                if (isCVA(recipe.module) || isSVA(recipe.module)) {
                    const name = path.basename(recipe.resolvedPath, `.recipe${path.extname(recipe.resolvedPath)}`);
                    recipes[name] = recipe.module;

                    result.messages.push({
                        type: "dependency",
                        plugin: PLUGIN_NAME,
                        file: recipe.resolvedPath,
                        parent: result.opts.from,
                    });
                }
            });

            apply(root, recipes, config?.module);
        },
    };
};

plugin.postcss = true;

export default plugin;
