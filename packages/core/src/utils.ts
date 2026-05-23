import type { SlotVariantsDefinition, VariantKeys, VariantMap, VariantsDefinition } from "./types";

export function getVariantKeys<V extends VariantsDefinition | SlotVariantsDefinition>(variants: V): VariantKeys<V> {
    return Object.keys(variants);
}

export function getVariantMap<V extends VariantsDefinition | SlotVariantsDefinition>(variants: V): VariantMap<V> {
    const map = {} as VariantMap<V>;
    for (const key in variants) map[key] = Object.keys(variants[key] ?? {});
    return map;
}
