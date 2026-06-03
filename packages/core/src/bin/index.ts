#!/usr/bin/env node
import { execute } from "../builder";
import { loadConfig } from "../config/load";
import { resolveConfig } from "../config/resolve";
import { loadRecipes } from "../recipes/load";
import { resolveRecipes } from "../recipes/resolve";

const configFile = await loadConfig();
const config = resolveConfig(configFile);

const recipeFiles = await loadRecipes(config.recipes);
const recipes = resolveRecipes(recipeFiles);

execute({ config, recipes });
