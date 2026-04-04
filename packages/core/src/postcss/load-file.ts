import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

export async function loadFile<T>(path: string): Promise<{ module: T; resolvedPath: string }> {
    // A new jiti instance per load = no stale cache.
    const jiti = createJiti(import.meta.url, {
        requireCache: false, // disable internal cache → always re-evaluates
        interopDefault: true, // unwrap default export automatically
    });

    const fileUrl = jiti.esmResolve(path);

    const module = await jiti.import<T>(fileUrl, { default: true });

    return { module, resolvedPath: fileURLToPath(fileUrl) };
}
