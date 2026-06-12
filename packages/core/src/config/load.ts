import * as path from "pathe";
import { CONFIG_FILENAME } from "../constant.ts";
import { loadFile } from "../loader.ts";
import * as logger from "../logger.ts";
import type { TailwindConfigVariantsOptions } from "./define";

export async function loadConfig() {
    try {
        return await loadFile<TailwindConfigVariantsOptions>(path.resolve(CONFIG_FILENAME));
    } catch (error: any) {
        if (error.code !== "MODULE_NOT_FOUND") {
            logger.log(`Unable to load config file at ${path}`);
            console.error(error);
        }
        return undefined;
    }
}
