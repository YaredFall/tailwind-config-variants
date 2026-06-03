#!/usr/bin/env node
import { execute } from "../builder";
import { loadConfig } from "../config/load";
import { resolveConfig } from "../config/resolve";
import * as logger from "../logger";
import { loadRecipes } from "../recipes/load";
import { resolveRecipes } from "../recipes/resolve";

const inform = logger.measure();

const configFile = await loadConfig();
const config = resolveConfig(configFile);

const recipeFiles = await loadRecipes(config.recipes);
const recipes = resolveRecipes(recipeFiles);

inform(`Resolved ${recipes.size} recipes in {time}`);

execute({ config, recipes });
