import path from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import type { TailwindConfigVariantsOptions } from "../config.ts";
import { PLUGIN_NAME } from "./constant.ts";

export async function loadConfig(): Promise<{ config: TailwindConfigVariantsOptions; configPath: string }> {
    // A new jiti instance per load = no stale cache.
    const jiti = createJiti(import.meta.url, {
        requireCache: false, // disable internal cache → always re-evaluates
        interopDefault: true, // unwrap default export automatically
    });

    const fileUrl = jiti.esmResolve(path.resolve("config-variants"));

    try {
        const config = await jiti.import(fileUrl, { default: true });
        if (!config || typeof config !== "object") {
            throw new Error(`[${PLUGIN_NAME}] Config at "${fileUrl}" must export a plain object.`);
        }
        return { config, configPath: fileURLToPath(fileUrl) };
    } catch (err) {
        throw new Error(
            `[${PLUGIN_NAME}] Failed to load config at "${fileUrl}":\n${
                err instanceof Error ? err.message : String(err)
            }`,
        );
    }
}
