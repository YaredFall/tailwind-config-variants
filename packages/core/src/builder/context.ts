import type { Recipe, SlotRecipe } from "../types";

type ComponentData = { className: string; styles: string };
type RecipeData = { name: string; definition: Recipe };
type SlotRecipeData = { name: string; definition: SlotRecipe };

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

    addRecipe(hash: string, recipe: RecipeData) {
        this.#recipes.set(hash, recipe);
    }

    addSlotRecipe(hash: string, recipe: SlotRecipeData) {
        this.#slotRecipes.set(hash, recipe);
    }

    get recipes() {
        return this.#recipes;
    }

    get slotRecipes() {
        return this.#slotRecipes;
    }
}
