import type { PluginCreator } from "postcss";
import { apply } from "./builder.ts";
import { PLUGIN_NAME } from "./constant.ts";
import { loadConfig } from "./load-config.ts";

const plugin = (): ReturnType<PluginCreator<unknown>> => {
    return {
        postcssPlugin: PLUGIN_NAME,

        // OnceExit runs after all other plugins, once per CSS document.
        async Once(root, { result }) {
            const { config, configPath } = await loadConfig();
            if (!config) return;

            result.messages.push({
                type: "dependency",
                plugin: PLUGIN_NAME,
                file: configPath,
                parent: result.opts.from,
            });

            apply(root, config);
        },
    };
};

plugin.postcss = true;

export default plugin;
