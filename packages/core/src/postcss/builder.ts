import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Root } from "postcss";
import { camelCase, kebabCase } from "scule";
import type { ResolvedConfig } from "../config/resolve-config.ts";
import cnTemplate from "../templates/cn.ts";
import cvaTemplate from "../templates/cva.ts";
import recipeTemplate from "../templates/recipe.ts";
import slotRecipeTemplate from "../templates/slot-recipe.ts";
import svaTemplate from "../templates/sva.ts";
import tailwindTemplate from "../templates/tailwind.ts";
import type { Recipe, SlotRecipe, SlotVariantMap, VariantsMap } from "../types.ts";
import { PLUGIN_NAME } from "./constant.ts";
import { isCVA, isSVA } from "./misc.ts";

type ComponentData = { className: string; styles: string };

/**
 * Build and inject all PostCSS nodes derived from the config into `root`.
 */
export function apply(root: Root, recipes: Record<string, Recipe | SlotRecipe>, config: ResolvedConfig) {
    const start = performance.now();

    const outDir = path.resolve(config.rootDir, config.outDir);
    const recipesDir = path.resolve(config.rootDir, outDir, "recipes");

    try {
        rmSync(outDir, { recursive: true });
    } catch {
        // Directory doesn't exist, ignore
    }
    mkdirSync(recipesDir, { recursive: true });

    writeFileSync(path.join(outDir, "cn.ts"), cnTemplate());
    writeFileSync(path.join(outDir, "cva.ts"), cvaTemplate());
    writeFileSync(path.join(outDir, "sva.ts"), svaTemplate());

    let recipesCount = 0;
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
        recipesCount++;
    }

    const twContent = [recipesDir, ...config.recipes.map((p) => `!${path.posix.resolve(p)}`)];
    writeFileSync(path.join(outDir, "plugin.ts"), tailwindTemplate(components, twContent));

    const end = performance.now();
    console.log(
        `[${PLUGIN_NAME}] Generated ${components.length} declaration(s) for ${recipesCount} recipe(s) in ${(end - start).toFixed(2)}ms`,
    );
}

function processCVA(key: string, recipe: Recipe) {
    const components: ComponentData[] = [];

    const baseStyles = recipe.base;
    const baseClassName = kebabCase(recipe.className ?? key);

    if (baseStyles) components.push({ className: baseClassName, styles: baseStyles });

    const variants: VariantsMap = {};
    if (recipe.variants) {
        for (const key in recipe.variants) {
            for (const variant in recipe.variants[key]) {
                const className = `${baseClassName}-${key}-${variant}`;
                const styles = recipe.variants[key][variant];

                variants[key] ??= {};
                variants[key][variant] = styles ? className : "";

                if (styles) components.push({ className, styles });
            }
        }
    }

    return {
        name: camelCase(baseClassName),
        base: baseStyles ? baseClassName : undefined,
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
        const baseStyles = recipe.base[slot];
        const baseClassName = `${kebabCase(recipe.className ?? key)}-${slot}`;

        base[slot] = baseStyles ? baseClassName : "";
        if (baseStyles) components.push({ className: baseClassName, styles: baseStyles });

        if (recipe.variants) {
            for (const key in recipe.variants) {
                for (const variant in recipe.variants[key]) {
                    const className = `${baseClassName}-${key}-${variant}`;
                    const styles = recipe.variants[key][variant]?.[slot];

                    variants[key] ??= {};
                    variants[key][variant] ??= {};
                    variants[key][variant][slot] = styles ? className : undefined;

                    if (styles) components.push({ className, styles });
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
