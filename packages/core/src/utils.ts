import type { RecipeVariant, SlotVariantsDefinition, VariantKeys, VariantMap, VariantsDefinition } from "./types";

export function getVariantKeys<V extends VariantsDefinition | SlotVariantsDefinition>(variants: V): VariantKeys<V> {
    return Object.keys(variants);
}

export function getVariantMap<V extends VariantsDefinition | SlotVariantsDefinition>(variants: V): VariantMap<V> {
    const map = {} as VariantMap<V>;
    for (const key in variants) map[key] = Object.keys(variants[key] ?? {});
    return map;
}

export function createSplitProps<V extends VariantsDefinition | SlotVariantsDefinition>(
    variants: V,
): <P extends RecipeVariant<V>>(props: P) => [Pick<P, keyof V>, Omit<P, keyof V>] {
    return (props) => {
        const variantProps = {} as typeof props;
        const otherProps = {} as typeof props;
        for (const key in props) {
            if (variants.hasOwnProperty(key)) variantProps[key] = props[key];
            else otherProps[key] = props[key];
        }
        return [variantProps, otherProps];
    };
}
