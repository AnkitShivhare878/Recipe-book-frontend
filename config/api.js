// API Configuration based on API_DOCUMENTATION.md

// Base URL - For Android Emulator use 10.0.2.2
// For iOS Simulator use localhost
// For physical device, replace with your computer's IP address
export const API_BASE_URL = 'http://127.0.0.1:5001/api';

// API Endpoints from documentation
export const ENDPOINTS = {
    // Auth endpoints (lines 96-246 in documentation)
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh',

    // User endpoints (lines 250-485 in documentation)
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPDATE_PASSWORD: '/users/password',
    GET_FAVORITES: '/users/favorites',
    ADD_FAVORITE: (recipeId) => `/users/favorites/${recipeId}`,
    REMOVE_FAVORITE: (recipeId) => `/users/favorites/${recipeId}`,
    DELETE_ACCOUNT: '/users/profile',

    // Recipe endpoints (lines 488-849 in documentation)
    GET_RECIPES: '/recipes',
    GET_RECIPE_BY_ID: (id) => `/recipes/${id}`,
    GET_RECIPES_BY_CUISINE: (cuisine) => `/recipes/cuisine/${cuisine}`,
    GET_RECIPES_BY_MEAL_TYPE: (mealType) => `/recipes/meal/${mealType}`,
    SEARCH_RECIPES: '/recipes/search',
    GET_CUISINES: '/recipes/cuisines',
    GET_TAGS: '/recipes/tags',
    CREATE_RECIPE: '/recipes',
    UPDATE_RECIPE: (id) => `/recipes/${id}`,
    DELETE_RECIPE: (id) => `/recipes/${id}`,

    // Meal Plan endpoints (lines 851+ in documentation)
    GET_MEAL_PLANS: '/meal-plans',
    CREATE_MEAL_PLAN: '/meal-plans',
    GET_MEAL_PLAN_BY_ID: (id) => `/meal-plans/${id}`,
    UPDATE_MEAL_PLAN: (id) => `/meal-plans/${id}`,
    DELETE_MEAL_PLAN: (id) => `/meal-plans/${id}`,
    ADD_RECIPE_TO_MEAL_PLAN: (id) => `/meal-plans/${id}/recipes`,
};

// Default test user credentials from documentation (line 9-12)
export const DEFAULT_USER = {
    email: 'emily.johnson@example.com',
    password: 'password123',
    username: 'emilycooks',
};
