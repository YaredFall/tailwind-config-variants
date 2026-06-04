import { defineRecipe } from "@tailwind-config-variants/core";

export default defineRecipe({
    base: {
        isolation: "isolate",
        "--example-variable": "8px",
        "--theme-reference": "--color-red-600",
    },
});
