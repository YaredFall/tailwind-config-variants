import type { ComponentData, RecipesData } from "../builder/context";

export function tailwindContentTemplate({ components }: { components: ComponentData[]; recipes: RecipesData }) {
    const result: Array<string | object> = [];

    components.forEach((component) => {
        result.push(component.className);
        if (typeof component.styles === "object") result.push(component.styles);
    });

    return JSON.stringify(result, null, 4);
}
