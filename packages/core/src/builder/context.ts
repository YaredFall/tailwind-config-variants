import type { Recipe, SlotRecipe } from "../types";

type ComponentData = { className: string; styles: string };
type RecipeData =
    | { name: string; type: "cva"; definition: Recipe }
    | { name: string; type: "sva"; definition: SlotRecipe };

export class BuilderContext {
    #components: ComponentData[] = [];
    #recipes = new Map<string, RecipeData>();

    addComponent(component: ComponentData) {
        this.#components.push(component);
    }

    get components() {
        return this.#components;
    }

    addRecipe(hash: string, recipe: RecipeData) {
        this.#recipes.set(hash, recipe);
    }

    get recipes() {
        return this.#recipes;
    }

    getRecipe(hash: string) {
        return this.#recipes.get(hash);
    }
}
