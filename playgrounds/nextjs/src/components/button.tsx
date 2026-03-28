import button, { type ButtonVariants } from "@cv/button";
import type { ComponentProps } from "react";

export default function Button({ children, className, variant, ...props }: ComponentProps<"button"> & ButtonVariants) {
    return (
        <button type="button" className={button({ variant }, className)} {...props}>
            {children}
        </button>
    );
}
