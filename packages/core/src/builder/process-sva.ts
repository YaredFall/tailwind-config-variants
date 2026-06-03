import { kebabCase } from "scule";
import type { ResolvedSlotRecipe } from "../recipes/resolve.ts";
import type { SlotVariantsDefinition } from "../types.ts";
import type { BuilderContext } from "./context.ts";

export function processSVA(ctx: BuilderContext, { id, name, type, definition }: ResolvedSlotRecipe) {
    const rootClassName = definition.className ?? kebabCase(name);
    const base = {} as Record<string, string>;
    const variants: SlotVariantsDefinition = {};

    for (const slot in definition.base) {
        const baseStyles = definition.base[slot];
        const baseClassName = `${rootClassName}_${slot}`;

        base[slot] = baseStyles ? baseClassName : "";
        if (baseStyles) ctx.addComponent({ className: baseClassName, styles: baseStyles });

        if (definition.variants) {
            for (const key in definition.variants) {
                for (const variant in definition.variants[key]) {
                    const groupName = `${baseClassName}-${key}`;
                    const className = variant === "true" ? groupName : `${groupName}-${variant}`;
                    const styles = definition.variants[key][variant]?.[slot];

                    variants[key] ??= {};
                    variants[key][variant] ??= {};
                    variants[key][variant][slot] = styles ? className : "";

                    if (styles) ctx.addComponent({ className, styles });
                    ctx.addGroupValue(groupName, className);
                }
            }
        }
    }

    ctx.addRecipe(id, {
        name,
        type,
        definition: {
            base: base,
            variants: variants,
            defaultVariants: definition.defaultVariants ?? {},
        },
    });
}
