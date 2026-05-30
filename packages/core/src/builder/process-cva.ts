import { kebabCase } from "scule";
import type { RecipeDefinition, VariantsDefinition } from "../types";
import type { BuilderContext } from "./context";

export function processCVA(ctx: BuilderContext, recipeKey: string, recipe: RecipeDefinition) {
    const baseStyles = recipe.base;
    const baseClassName = recipe.className ?? kebabCase(recipeKey);

    if (baseStyles) ctx.addComponent({ className: baseClassName, styles: baseStyles });

    const variants: VariantsDefinition = {};
    if (recipe.variants) {
        for (const key in recipe.variants) {
            for (const variant in recipe.variants[key]) {
                const className = `${baseClassName}-${key}-${variant}`;
                const styles = recipe.variants[key][variant];

                variants[key] ??= {};
                variants[key][variant] = styles ? className : "";

                if (styles) ctx.addComponent({ className, styles });
            }
        }
    }

    ctx.addRecipe(recipeKey, {
        base: baseStyles ? baseClassName : "",
        variants: variants,
        defaultVariants: recipe.defaultVariants ?? {},
    });
}
