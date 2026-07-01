import { kebabCase } from "scule";
import type { ResolvedSlotRecipe } from "../recipes/resolve.ts";
import type { SlotVariantsDefinition } from "../recipes/types.ts";
import type { BuilderContext } from "./context.ts";
import { getBaseClassName, getVariantClassName } from "./get-class-name.ts";

export function processSVA(ctx: BuilderContext, { id, name, type, definition }: ResolvedSlotRecipe) {
    const rootClassName = definition.className ?? kebabCase(name);

    const base = {} as Record<string, string>;
    const variants: SlotVariantsDefinition = {};
    const defaultVariants = definition.defaultVariants ?? {};

    for (const slot in definition.base) {
        const baseStyles = definition.base[slot];
        const baseClassName = getBaseClassName(rootClassName, slot);

        base[slot] = baseStyles ? baseClassName : "";
        if (baseStyles) ctx.addComponent({ className: baseClassName, styles: baseStyles });

        if (definition.variants) {
            for (const key in definition.variants) {
                for (const variant in definition.variants[key]) {
                    const className = getVariantClassName(baseClassName, key, variant);
                    const styles = definition.variants[key][variant]?.[slot];

                    variants[key] ??= {};
                    variants[key][variant] ??= {};
                    variants[key][variant][slot] = styles ? className : "";

                    if (styles) ctx.addComponent({ className, styles });
                    ctx.addGroupValue(`${baseClassName}-${key}`, className);
                }
            }
        }
    }

    ctx.addRecipe(id, {
        name,
        type,
        definition: {
            base,
            variants,
            defaultVariants,
        },
    });
}
