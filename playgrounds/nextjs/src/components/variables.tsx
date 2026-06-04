import variables, { type VariablesVariants } from "@recipes/variables";
import type { ComponentProps } from "react";

export default function Variables({ children, className, ...props }: ComponentProps<"div"> & VariablesVariants) {
    return (
        <div className={variables(0, className)} {...props}>
            {children}
        </div>
    );
}
