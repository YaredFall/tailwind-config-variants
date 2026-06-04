import type { RecipeDefinition, SlotRecipeDefinition, StyleDeclaration } from "../recipes/types";

export type ComponentData = { className: string; styles: StyleDeclaration };
export type GroupsData = Map<string, string[]>;
export type RecipeData =
    | { name: string; type: "cva"; definition: RecipeDefinition }
    | { name: string; type: "sva"; definition: SlotRecipeDefinition };

export class BuilderContext {
    #components: ComponentData[] = [];
    #groups: GroupsData = new Map();
    #recipes = new Map<string, RecipeData>();

    addComponent(component: ComponentData) {
        this.#components.push(component);
    }

    get components() {
        return this.#components;
    }

    addGroupValue(group: string, value: string) {
        const values = this.#groups.get(group) || [];
        values.push(value);
        this.#groups.set(group, values);
    }

    get groups() {
        return this.#groups;
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
