import { kebabCase } from "scule";
import type { ResolvedRecipe } from "../recipes/resolve.ts";
import type { VariantsDefinition } from "../recipes/types.ts";
import type { BuilderContext } from "./context.ts";

export function processCVA(ctx: BuilderContext, { id, name, type, definition }: ResolvedRecipe) {
    const baseClassName = definition.className ?? kebabCase(name);

    const base = definition.base ? baseClassName : "";
    const variants: VariantsDefinition = {};
    const defaultVariants = definition.defaultVariants ?? {};

    if (definition.base) ctx.addComponent({ className: baseClassName, styles: definition.base });

    if (definition.variants) {
        for (const key in definition.variants) {
            for (const variant in definition.variants[key]) {
                const groupName = `${baseClassName}-${key}`;
                const className = variant === "true" ? groupName : `${groupName}-${variant}`;
                const styles = definition.variants[key][variant];

                variants[key] ??= {};
                variants[key][variant] = styles ? className : "";

                if (styles) ctx.addComponent({ className, styles });
                ctx.addGroupValue(groupName, className);
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
