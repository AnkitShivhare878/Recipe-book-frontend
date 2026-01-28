import apiClient from './apiClient';
import { ENDPOINTS } from '../config/api';

// Recipe Service - handles all recipe-related API calls
// All endpoints follow the API_DOCUMENTATION.md

export const recipeService = {
    /**
     * Get all recipes with pagination and filters
     * API Doc: GET /api/recipes (lines 490-565)
     * @param params - page, limit, cuisine, difficulty, mealType, search, sortBy
     */
    async getRecipes(params = {}) {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_RECIPES, { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get single recipe by ID
     * API Doc: GET /api/recipes/:id (lines 569-631)
     */
    async getRecipeById(id) {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_RECIPE_BY_ID(id));
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get recipes by cuisine
     * API Doc: GET /api/recipes/cuisine/:cuisine (lines 634-646)
     */
    async getRecipesByCuisine(cuisine, params = {}) {
        try {
            const response = await apiClient.get(
                ENDPOINTS.GET_RECIPES_BY_CUISINE(cuisine),
                { params },
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get recipes by meal type
     * API Doc: GET /api/recipes/meal/:mealType (lines 649-663)
     */
    async getRecipesByMealType(mealType, params = {}) {
        try {
            const response = await apiClient.get(
                ENDPOINTS.GET_RECIPES_BY_MEAL_TYPE(mealType),
                { params },
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Search recipes
     * API Doc: GET /api/recipes/search?q=<query> (lines 666-688)
     */
    async searchRecipes(query, params = {}) {
        try {
            const response = await apiClient.get(ENDPOINTS.SEARCH_RECIPES, {
                params: { q: query, ...params },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all cuisines
     * API Doc: GET /api/recipes/cuisines (lines 691-717)
     */
    async getCuisines() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_CUISINES);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all tags
     * API Doc: GET /api/recipes/tags (lines 721-747)
     */
    async getTags() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_TAGS);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create a recipe (authenticated)
     * API Doc: POST /api/recipes (lines 751-849)
     */
    async createRecipe(recipeData) {
        try {
            const response = await apiClient.post(ENDPOINTS.CREATE_RECIPE, recipeData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update a recipe (authenticated, owner only)
     * API Doc: PUT /api/recipes/:id
     */
    async updateRecipe(id, recipeData) {
        try {
            const response = await apiClient.put(
                ENDPOINTS.UPDATE_RECIPE(id),
                recipeData,
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete a recipe (authenticated, owner only)
     * API Doc: DELETE /api/recipes/:id
     */
    async deleteRecipe(id) {
        try {
            const response = await apiClient.delete(ENDPOINTS.DELETE_RECIPE(id));
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user's favorite recipes (authenticated)
     */
    async getFavorites() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_FAVORITES);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user's meal plans (authenticated)
     */
    async getMealPlans() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_MEAL_PLANS);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create a new meal plan (authenticated)
     */
    async createMealPlan(data) {
        try {
            const response = await apiClient.post(ENDPOINTS.CREATE_MEAL_PLAN, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Add a recipe to an existing meal plan (authenticated)
     */
    async addRecipeToMealPlan(planId, data) {
        try {
            const response = await apiClient.post(
                ENDPOINTS.ADD_RECIPE_TO_MEAL_PLAN(planId),
                data
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete a meal plan (authenticated)
     */
    async deleteMealPlan(id) {
        try {
            const response = await apiClient.delete(ENDPOINTS.DELETE_MEAL_PLAN(id));
            return response;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Add recipe to favorites (authenticated)
     */
    async addToFavorites(recipeId) {
        try {
            const response = await apiClient.post(ENDPOINTS.ADD_FAVORITE(recipeId));
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Remove recipe from favorites (authenticated)
     */
    async removeFromFavorites(recipeId) {
        try {
            const response = await apiClient.delete(ENDPOINTS.REMOVE_FAVORITE(recipeId));
            return response;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Update user profile (authenticated)
     */
    async updateProfile(data) {
        try {
            const response = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    /**
     * Update user password (authenticated)
     */
    async updatePassword(data) {
        try {
            const response = await apiClient.put(ENDPOINTS.UPDATE_PASSWORD, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
};
