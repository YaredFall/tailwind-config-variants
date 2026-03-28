export type VariantsMap = Record<string, Record<string, string>>;
export type Variant<V extends VariantsMap> = { [K in keyof V]?: keyof V[K] };

export type Recipe<V extends VariantsMap> = {
    className?: string;
    base?: string;
    variants?: V;
    defaultVariants?: Variant<V>;
};
