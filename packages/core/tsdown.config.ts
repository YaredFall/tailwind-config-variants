import { defineConfig } from "tsdown";

export default defineConfig([
    {
        entry: ["./src/index.ts"],
        dts: true,
    },
    {
        entry: { postcss: "./src/postcss/index.ts" },
        format: ["cjs", "esm"],
    },
]);
