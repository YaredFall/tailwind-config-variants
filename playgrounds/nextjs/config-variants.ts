import { defineConfig, defineRecipe, defineSlotRecipe } from "@tailwind-config-variants/core";

export default defineConfig({
    recipes: {
        button: defineRecipe({
            base: "px-4 py-2 rounded-full cursor-pointer font-medium transition-colors",
            variants: {
                variant: {
                    primary: "bg-violet-500 text-white hover:bg-violet-600",
                    secondary: "bg-blue-500 text-white hover:bg-blue-600",
                },
                disabled: {
                    true: "opacity-50 cursor-not-allowed",
                },
            },
            defaultVariants: {
                variant: "primary",
            },
        }),
        card: defineSlotRecipe({
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
        }),
    },
});
