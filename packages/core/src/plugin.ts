import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import plugin from "tailwindcss/plugin";
import { cnTemplate, componentTemplate, cvaTemplate } from "./templates";
import type { Recipe, VariantsMap } from "./types";

const TIME_KEY = "\u0069 Config recipes plugin took";
const DEFAULT_OUT_DIR = ".config-variants";

export type RuntimeFunctionsConfig = {
    outDir?: string;
};
export type TailwindConfigVariantsOptions = {
    recipes?: Record<string, Recipe<VariantsMap>>;
    runtimeFunctions?: false | RuntimeFunctionsConfig;
};

export const definePlugin = (config: TailwindConfigVariantsOptions): ReturnType<typeof plugin> =>
    plugin(async (api) => {
        const SHOULD_USE_RUNTIME = !process.env.TAILWIND_MODE;

        const rootDir = process.cwd();

        if (!config) {
            console.warn("Config variants config file not found, skipping plugin");
            return;
        }

        const { recipes, runtimeFunctions = {} } = config;

        console.time(TIME_KEY);

        const { enabled: runtime, outDir } =
            SHOULD_USE_RUNTIME && runtimeFunctions
                ? { enabled: true as const, outDir: DEFAULT_OUT_DIR, ...runtimeFunctions }
                : { enabled: false as const };

        if (runtime) {
            mkdirSync(path.join(rootDir, outDir), { recursive: true });

            writeFileSync(path.join(rootDir, outDir, "cn.ts"), cnTemplate());
            writeFileSync(path.join(rootDir, outDir, "cva.ts"), cvaTemplate());
        }

        for (const name in recipes) {
            const recipe = recipes[name];
            if (!recipe) continue;

            const baseClassName = recipe.className ?? name;

            const baseStyles = recipe.base;

            api.addComponents({
                [`.${baseClassName}`]: {
                    [`@layer ${name}`]: {
                        [`@apply ${baseStyles}`]: {},
                    },
                },
            });

            const classNames: VariantsMap = {};
            if (recipe.variants) {
                for (const key in recipe.variants) {
                    for (const variant in recipe.variants[key]) {
                        const className = `${baseClassName}-${key}-${variant}`;

                        classNames[key] ??= {};
                        classNames[key][variant] = className;

                        const styles = recipe.variants[key][variant];

                        api.addComponents({
                            [`.${className}`]: {
                                [`@layer ${name}`]: {
                                    [`@apply ${styles}`]: {},
                                },
                            },
                        });
                    }
                }
            }

            if (runtime) {
                const recipePathname = path.join(rootDir, outDir, `${name}.ts`);
                writeFileSync(
                    recipePathname,
                    componentTemplate(name, {
                        base: baseClassName,
                        variants: classNames,
                        defaultVariants: recipe.defaultVariants ?? {},
                    }),
                );
            }
        }

        console.timeEnd(TIME_KEY);
    });
