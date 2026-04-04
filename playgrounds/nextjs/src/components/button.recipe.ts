import { defineRecipe } from "@tailwind-config-variants/core";

export default defineRecipe({
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
});
