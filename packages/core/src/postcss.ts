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

            const configFile = await loadConfig();
            if (configFile) addDependency(configFile.resolvedPath);

            const config = resolveConfig(configFile);

            const recipeFiles = await loadRecipes(config.recipes);
            recipeFiles.forEach((file) => void addDependency(file.resolvedPath));

            const recipes = resolveRecipes(recipeFiles);

            execute({ config, recipes });
        },
    };
};

plugin.postcss = true;

export default plugin;
