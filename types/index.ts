export interface Recipe {
    _id: string;
    name: string;
    ingredients: string[];
    instructions: string[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    cuisine: string;
    caloriesPerServing: number;
    tags: string[];
    image: string;
    rating: number;
    reviewCount: number;
    mealType: string[];
    userId?: any;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface PaginatedRecipes {
    recipes: Recipe[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
