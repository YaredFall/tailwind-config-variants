export function getClassName({
    baseName,
    slotName,
    variantKey,
    variantValue,
}: {
    baseName: string;
    slotName?: string;
    variantKey: string;
    variantValue: string;
}) {
    const baseClassName = slotName ? `${baseName}_${slotName}` : baseName;
    if (variantValue === "true") return `${baseClassName}-${variantKey}`;
    return `${baseClassName}--${variantKey}-${variantValue}`;
}
