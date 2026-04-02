"use client";

import card, { type CardVariants } from "@recipes/card";
import { type ComponentProps, createContext, use } from "react";

const CardContext = createContext<ReturnType<typeof card>>(null!);

export function Root({ children, className, variant, ...props }: ComponentProps<"div"> & CardVariants) {
    const slots = card({ variant });
    return (
        <CardContext value={slots}>
            <div className={slots.root(className)} {...props}>
                {children}
            </div>
        </CardContext>
    );
}
export function Title({ children, className, ...props }: ComponentProps<"div">) {
    const slots = use(CardContext);
    return (
        <div className={slots.title(className)} {...props}>
            {children}
        </div>
    );
}
export function Description({ children, className, ...props }: ComponentProps<"div">) {
    const slots = use(CardContext);
    return (
        <div className={slots.description(className)} {...props}>
            {children}
        </div>
    );
}
