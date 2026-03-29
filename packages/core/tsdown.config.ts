import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["./src/index.ts", "./src/postcss/index.ts"],
    platform: "node",
    unbundle: true,
    minify: true,
});
