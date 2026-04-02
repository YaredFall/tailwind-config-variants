import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { AtRule, type Root } from "postcss";
import { camelCase, kebabCase } from "scule";
import type { TailwindConfigVariantsOptions } from "../config.ts";
import cnTemplate from "../templates/cn.ts";
import cvaTemplate from "../templates/cva.ts";
import recipeTemplate from "../templates/recipe.ts";
import slotRecipeTemplate from "../templates/slot-recipe.ts";
import svaTemplate from "../templates/sva.ts";
import tailwindTemplate from "../templates/tailwind.ts";
import typesTemplate from "../templates/types.ts";
import type { Recipe, SlotRecipe, SlotVariantMap, VariantsMap } from "../types.ts";
import { DEFAULT_OUT_DIR, PLUGIN_NAME } from "./constant.ts";

type ComponentData = { className: string; styles: string };

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

    writeFileSync(path.join(mainDir, "types.ts"), typesTemplate());
    writeFileSync(path.join(mainDir, "cn.ts"), cnTemplate());
    writeFileSync(path.join(mainDir, "cva.ts"), cvaTemplate());
    writeFileSync(path.join(mainDir, "sva.ts"), svaTemplate());

    const components: ComponentData[] = [];

    for (const name in recipes) {
        const recipe = recipes[name];
        if (!recipe) continue;

        if (isCVA(recipe)) {
            const result = processCVA(name, recipe);

            components.push(...result.components);
            writeFileSync(
                path.join(recipesDir, `${result.name}.ts`),
                recipeTemplate(result.name, {
                    base: result.base,
                    variants: result.variants,
                    defaultVariants: result.defaultVariants,
                }),
            );
        } else if (isSVA(recipe)) {
            const result = processSVA(name, recipe);

            components.push(...result.components);
            writeFileSync(
                path.join(recipesDir, `${result.name}.ts`),
                slotRecipeTemplate(result.name, {
                    base: result.base,
                    variants: result.variants,
                    defaultVariants: result.defaultVariants,
                }),
            );
        }
    }

    writeFileSync(path.join(mainDir, "plugin.ts"), tailwindTemplate(components, [path.join(recipesDir, "*.ts")]));

    console.log(`[${PLUGIN_NAME}] Generated ${components.length} declaration(s)`);
}

function isCVA(recipe: Recipe | SlotRecipe): recipe is Recipe {
    return "__type" in recipe && recipe.__type === "cva";
}
function isSVA(recipe: Recipe | SlotRecipe): recipe is SlotRecipe {
    return "__type" in recipe && recipe.__type === "sva";
}

function processCVA(key: string, recipe: Recipe) {
    const components: ComponentData[] = [];

    const baseStyles = recipe.base ?? "";
    const baseClassName = kebabCase(recipe.className ?? key);

    components.push({ className: baseClassName, styles: baseStyles });

    const variants: VariantsMap = {};
    if (recipe.variants) {
        for (const key in recipe.variants) {
            for (const variant in recipe.variants[key]) {
                const className = `${baseClassName}-${key}-${variant}`;
                const styles = recipe.variants[key][variant] ?? "";
                variants[key] ??= {};
                variants[key][variant] = className;

                components.push({ className, styles });
            }
        }
    }

    return {
        name: camelCase(baseClassName),
        base: baseClassName,
        variants: variants,
        defaultVariants: recipe.defaultVariants ?? {},
        components,
    };
}

function processSVA(key: string, recipe: SlotRecipe) {
    const components: ComponentData[] = [];

    const base = {} as Record<string, string>;
    const variants: SlotVariantMap = {};

    for (const slot in recipe.base) {
        const baseStyles = recipe.base[slot] ?? "";
        const baseClassName = `${kebabCase(recipe.className ?? key)}-${slot}`;

        base[slot] = baseClassName;

        components.push({ className: baseClassName, styles: baseStyles });

        if (recipe.variants) {
            for (const key in recipe.variants) {
                for (const variant in recipe.variants[key]) {
                    const className = `${baseClassName}-${key}-${variant}`;
                    const styles = recipe.variants[key][variant]?.[slot] ?? "";
                    variants[key] ??= {};
                    variants[key][variant] ??= {};
                    variants[key][variant][slot] = className;

                    components.push({ className, styles });
                }
            }
        }
    }

    return {
        name: camelCase(key),
        base: base,
        variants: variants,
        defaultVariants: recipe.defaultVariants ?? {},
        components,
    };
}
