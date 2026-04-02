import button, { type ButtonVariants } from "@recipes/button";
import type { ComponentProps } from "react";

export default function Button({ children, className, variant, ...props }: ComponentProps<"button"> & ButtonVariants) {
    return (
        <button type="button" className={button({ variant, disabled: props.disabled }, className)} {...props}>
            {children}
        </button>
    );
}
