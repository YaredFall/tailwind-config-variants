import type { Recipe, SlotRecipe } from "../types";

export type ComponentData = { className: string; styles: string };
export type RecipeData = Omit<Required<Recipe>, "className">;
export type SlotRecipeData = Omit<Required<SlotRecipe>, "className">;

export class BuilderContext {
    #components: ComponentData[] = [];
    #recipes = new Map<string, RecipeData>();
    #slotRecipes = new Map<string, SlotRecipeData>();

    addComponent(component: ComponentData) {
        this.#components.push(component);
    }

    get components() {
        return this.#components;
    }

    addRecipe(recipeKey: string, recipe: RecipeData) {
        this.#recipes.set(recipeKey, recipe);
    }

    addSlotRecipe(recipeKey: string, recipe: SlotRecipeData) {
        this.#slotRecipes.set(recipeKey, recipe);
    }

    get recipes() {
        return this.#recipes;
    }

    get slotRecipes() {
        return this.#slotRecipes;
    }
}
