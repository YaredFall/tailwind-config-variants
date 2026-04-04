import { defineSlotRecipe } from "@tailwind-config-variants/core";

export default defineSlotRecipe({
    base: {
        root: "p-6 rounded-xl flex flex-col gap-3 transition-colors",
        title: "font-bold text-xl",
        description: "text-sm",
    },
    variants: {
        variant: {
            primary: {
                root: "bg-violet-100 text-zinc-900",
                title: "text-zinc-900",
                description: "text-zinc-600",
            },
            secondary: {
                root: "bg-blue-100 text-zinc-900",
                title: "text-zinc-900",
                description: "text-zinc-600",
            },
        },
    },
    defaultVariants: {
        variant: "primary",
    },
});
