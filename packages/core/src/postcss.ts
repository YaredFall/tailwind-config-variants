import type { PluginCreator } from "postcss";
import { execute } from "./builder/index.ts";
import { loadConfig } from "./config/load.ts";
import { resolveConfig } from "./config/resolve.ts";
import { POSTCSS_PLUGIN_NAME } from "./constant.ts";
import { loadRecipes } from "./recipes/load.ts";
import { resolveRecipes } from "./recipes/resolve.ts";

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
            recipes.forEach((file) => void addDependency(file.resolvedPath));

            const resolvedRecipes = resolveRecipes(recipes);

            execute(resolvedRecipes, resolvedConfig);
        },
    };
};

plugin.postcss = true;

export default plugin;
