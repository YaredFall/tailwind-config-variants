import * as path from "pathe";
import { CONFIG_FILENAME } from "../constant.ts";
import { loadFile } from "../loader.ts";
import type { TailwindConfigVariantsOptions } from "./define";

export async function loadConfig() {
    try {
        return await loadFile<TailwindConfigVariantsOptions>(path.resolve(CONFIG_FILENAME));
    } catch {
        return undefined;
    }
}
