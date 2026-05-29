import { kebabCase } from "scule";
import type { SlotRecipe, SlotVariantsDefinition } from "../types";
import type { BuilderContext } from "./context";

export function processSVA(ctx: BuilderContext, recipeKey: string, recipe: SlotRecipe) {
    const rootClassName = recipe.className ?? kebabCase(recipeKey);
    const base = {} as Record<string, string>;
    const variants: SlotVariantsDefinition = {};

    for (const slot in recipe.base) {
        const baseStyles = recipe.base[slot];
        const baseClassName = `${rootClassName}-${slot}`;

        base[slot] = baseStyles ? baseClassName : "";
        if (baseStyles) ctx.addComponent({ className: baseClassName, styles: baseStyles });

        if (recipe.variants) {
            for (const key in recipe.variants) {
                for (const variant in recipe.variants[key]) {
                    const className = `${baseClassName}-${key}-${variant}`;
                    const styles = recipe.variants[key][variant]?.[slot];

                    variants[key] ??= {};
                    variants[key][variant] ??= {};
                    variants[key][variant][slot] = styles ? className : undefined;

                    if (styles) ctx.addComponent({ className, styles });
                }
            }
        }
    }

    ctx.addSlotRecipe(recipeKey, {
        base: base,
        variants: variants,
        defaultVariants: recipe.defaultVariants ?? {},
    });
}
