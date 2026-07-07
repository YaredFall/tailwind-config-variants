import type { RecipeDefinition, SlotRecipeDefinition, StyleDeclaration } from "../recipes/types";

export type ComponentData = { className: string; group?: string; styles: StyleDeclaration };
export type GroupsData = Map<string, string[]>;
export type RecipeData =
    | { name: string; type: "cva"; definition: RecipeDefinition }
    | { name: string; type: "sva"; definition: SlotRecipeDefinition };
export type RecipesData = Map<string, RecipeData>;

export class BuilderContext {
    #components: ComponentData[] = [];
    #recipes: RecipesData = new Map();

    addComponent(component: ComponentData) {
        this.#components.push(component);
    }

    get components() {
        return this.#components;
    }

    get groups() {
        const groups: GroupsData = new Map();
        this.components.forEach((component) => {
            if (!component.group) return;

            const groupValues = groups.get(component.group) || [];
            groupValues.push(component.className);
            groups.set(component.group, groupValues);
        });
        return groups;
    }

    addRecipe(id: string, recipe: RecipeData) {
        this.#recipes.set(id, recipe);
    }

    get recipes() {
        return this.#recipes;
    }

    getRecipe(id: string) {
        return this.#recipes.get(id);
    }
}
