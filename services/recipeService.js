import apiClient from './apiClient';
import { ENDPOINTS } from '../config/api';

export const recipeService = {
    async getRecipes(params = {}) {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_RECIPES, { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getRecipeById(id) {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_RECIPE_BY_ID(id));
            return response;
        } catch (error) {
            throw error;
        }
    },

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

    async getCuisines() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_CUISINES);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTags() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_TAGS);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createRecipe(recipeData) {
        try {
            const response = await apiClient.post(ENDPOINTS.CREATE_RECIPE, recipeData);
            return response;
        } catch (error) {
            throw error;
        }
    },

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

    async deleteRecipe(id) {
        try {
            const response = await apiClient.delete(ENDPOINTS.DELETE_RECIPE(id));
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getFavorites() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_FAVORITES);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getMealPlans() {
        try {
            const response = await apiClient.get(ENDPOINTS.GET_MEAL_PLANS);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createMealPlan(data) {
        try {
            const response = await apiClient.post(ENDPOINTS.CREATE_MEAL_PLAN, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

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

    async deleteMealPlan(id) {
        try {
            const response = await apiClient.delete(ENDPOINTS.DELETE_MEAL_PLAN(id));
            return response;
        } catch (error) {
            throw error;
        }
    },
    async addToFavorites(recipeId) {
        try {
            const response = await apiClient.post(ENDPOINTS.ADD_FAVORITE(recipeId));
            return response;
        } catch (error) {
            throw error;
        }
    },

    async removeFromFavorites(recipeId) {
        try {
            const response = await apiClient.delete(ENDPOINTS.REMOVE_FAVORITE(recipeId));
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateProfile(data) {
        try {
            const response = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updatePassword(data) {
        try {
            const response = await apiClient.put(ENDPOINTS.UPDATE_PASSWORD, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
};
