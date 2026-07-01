export function getBaseClassName(recipe: string, slot?: string) {
    return slot && slot !== "root" ? `${recipe}_${slot}` : recipe;
}

export function getVariantClassName(baseClassName: string, variantKey: string, variantValue: string) {
    if (variantValue === "true") return `${baseClassName}--${variantKey}`;
    if (variantValue === "false") return `${baseClassName}--not-${variantKey}`;
    return `${baseClassName}--${variantKey}-${variantValue}`;
}
