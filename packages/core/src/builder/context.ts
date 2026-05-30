import type { Recipe, SlotRecipe } from "../types";

export type ComponentData = { className: string; styles: string };

export class BuilderContext {
    #components: ComponentData[] = [];
    #recipes = new Map<string, Recipe>();
    #slotRecipes = new Map<string, SlotRecipe>();

    addComponent(component: ComponentData) {
        this.#components.push(component);
    }

    get components() {
        return this.#components;
    }

    addRecipe(recipeKey: string, recipe: Recipe) {
        this.#recipes.set(recipeKey, recipe);
    }

    addSlotRecipe(recipeKey: string, recipe: SlotRecipe) {
        this.#slotRecipes.set(recipeKey, recipe);
    }

    get recipes() {
        return this.#recipes;
    }

    get slotRecipes() {
        return this.#slotRecipes;
    }
}
