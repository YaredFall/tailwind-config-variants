import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";

export type ResolvedFile<T> = { module: T; resolvedPath: string };

export async function loadFile<T>(path: string): Promise<ResolvedFile<T>> {
    // A new jiti instance per load = no stale cache.
    const jiti = createJiti(import.meta.url, {
        requireCache: false, // disable internal cache → always re-evaluates
        interopDefault: true, // unwrap default export automatically
    });

    const fileUrl = jiti.esmResolve(path);

    const module = await jiti.import<T>(fileUrl, { default: true });

    return { module, resolvedPath: fileURLToPath(fileUrl) };
}
