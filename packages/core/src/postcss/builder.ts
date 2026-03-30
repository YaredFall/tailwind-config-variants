import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { AtRule, type Root } from "postcss";
import { camelCase, kebabCase } from "scule";
import type { TailwindConfigVariantsOptions } from "../config.ts";
import cnTemplate from "../templates/cn.ts";
import cvaTemplate from "../templates/cva.ts";
import componentTemplate from "../templates/recipe.ts";
import tailwindTemplate from "../templates/tailwind.ts";
import type { VariantsMap } from "../types.ts";
import { DEFAULT_OUT_DIR, PLUGIN_NAME } from "./constant.ts";

/**
 * Build and inject all PostCSS nodes derived from the config into `root`.
 */
export function apply(root: Root, config: TailwindConfigVariantsOptions, configPath: string) {
    const { recipes = {}, outDir = DEFAULT_OUT_DIR } = config;

    const rootDir = process.cwd();
    const mainDir = path.join(rootDir, outDir);
    const recipesDir = path.join(rootDir, outDir, "recipes");

    const tailwindImport = root.nodes.find(
        (node) => node.type === "atrule" && node.name === "import" && node.params.includes("tailwindcss"),
    );

    if (tailwindImport) {
        console.log(`[${PLUGIN_NAME}] Detected tailwind v4. Adding source directives...`);

        tailwindImport?.after(
            new AtRule({
                name: "source",
                params: `not "${configPath}"`,
            }),
        );
        tailwindImport?.after(
            new AtRule({
                name: "source",
                params: `"${recipesDir}"`,
            }),
        );
    }

    try {
        rmSync(mainDir, { recursive: true });
    } catch {
        // Directory doesn't exist, ignore
    }
    mkdirSync(recipesDir, { recursive: true });

    writeFileSync(path.join(mainDir, "cn.ts"), cnTemplate());
    writeFileSync(path.join(mainDir, "cva.ts"), cvaTemplate());

    // const layer = new AtRule({
    //     name: "layer",
    //     params: "components",
    // });

    const components: Array<{ className: string; styles: string }> = [];

    for (const name in recipes) {
        const recipe = recipes[name];
        if (!recipe) continue;

        const baseStyles = recipe.base ?? "";
        const baseClassName = kebabCase(recipe.className ?? name);

        components.push({ className: baseClassName, styles: baseStyles });
        // layer.append(
        //     new Rule({
        //         selector: `.${baseClassName}`,
        //         nodes: [new AtRule({ name: "apply", params: baseStyles })],
        //     }),
        // );

        const variants: VariantsMap = {};
        if (recipe.variants) {
            for (const key in recipe.variants) {
                for (const variant in recipe.variants[key]) {
                    const className = `${baseClassName}-${key}-${variant}`;
                    const styles = recipe.variants[key][variant] ?? "";
                    variants[key] ??= {};
                    variants[key][variant] = className;

                    components.push({ className, styles });
                    // layer.append(
                    //     new Rule({
                    //         selector: `.${className}`,
                    //         nodes: [new AtRule({ name: "apply", params: styles })],
                    //     }),
                    // );
                }
            }
        }

        writeFileSync(
            path.join(recipesDir, `${name}.ts`),
            componentTemplate(camelCase(baseClassName), {
                base: baseClassName,
                variants: variants,
                defaultVariants: recipe.defaultVariants ?? {},
            }),
        );
    }

    // root.append(layer);

    writeFileSync(path.join(mainDir, "plugin.ts"), tailwindTemplate(components));

    console.log(`[${PLUGIN_NAME}] Generated ${components.length} declaration(s)`);
}
