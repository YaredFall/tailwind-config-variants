import { kebabCase } from "scule";
import type { ResolvedRecipe } from "../recipes/resolve.ts";
import type { VariantsDefinition } from "../types.ts";
import type { BuilderContext } from "./context.ts";

export function processCVA(ctx: BuilderContext, { id, name, type, definition }: ResolvedRecipe) {
    const baseStyles = definition.base;
    const baseClassName = definition.className ?? kebabCase(name);

    if (baseStyles) ctx.addComponent({ className: baseClassName, styles: baseStyles });

    const variants: VariantsDefinition = {};
    if (definition.variants) {
        for (const key in definition.variants) {
            for (const variant in definition.variants[key]) {
                const groupName = `${baseClassName}-${key}`;
                const className = `${groupName}-${variant}`;
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
            base: baseStyles ? baseClassName : "",
            variants: variants,
            defaultVariants: definition.defaultVariants ?? {},
        },
    });
}
