import { defineConfig } from "tsdown";

export default defineConfig([
    {
        entry: ["./src/index.ts"],
        dts: true,
    },
    {
        entry: { postcss: "./src/postcss.ts" },
        format: ["cjs", "esm"],
    },
    {
        entry: { bin: "./src/bin/index.ts" },
        format: ["esm"],
    },
]);
