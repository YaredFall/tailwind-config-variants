import type { PluginCreator } from "postcss";
import { execute } from "./builder/index.ts";
import { loadConfig } from "./config/load.ts";
import { resolveConfig } from "./config/resolve.ts";
import { POSTCSS_PLUGIN_NAME } from "./constant.ts";
import { loadRecipes } from "./recipes/load.ts";
import { resolveRecipe } from "./recipes/resolve.ts";
import type { RecipeDefinition, SlotRecipeDefinition } from "./types.ts";

const plugin = (): ReturnType<PluginCreator<unknown>> => {
    return {
        postcssPlugin: POSTCSS_PLUGIN_NAME,

        async Once(_, { result }) {
            function addDependency(path: string) {
                result.messages.push({
                    type: "dependency",
                    plugin: POSTCSS_PLUGIN_NAME,
                    file: path,
                    parent: result.opts.from,
                });
            }

            const config = await loadConfig();
            if (config) addDependency(config.resolvedPath);

            const resolvedConfig = resolveConfig(config);

            const recipes = await loadRecipes(resolvedConfig.recipes);

            const resolvedRecipes = {} as Record<string, RecipeDefinition | SlotRecipeDefinition>;
            recipes.forEach((file) => {
                try {
                    const { name, definition } = resolveRecipe(file);
                    resolvedRecipes[name] = definition;

                    addDependency(file.resolvedPath);
                } catch {
                    // Skip unresolved
                }
            });

            execute(resolvedRecipes, resolvedConfig);
        },
    };
};

plugin.postcss = true;

export default plugin;
