export type TailwindConfigVariantsOptions = {
    rootDir?: string;
    /**
     * Output directory for generated files
     */
    outDir?: string;
    /**
     * Recipe files glob pattern
     */
    recipes?: string[];
};

export function defineConfig(config: TailwindConfigVariantsOptions) {
    return config;
}
