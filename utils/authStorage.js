import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@recipe_book_token';
const USER_KEY = '@recipe_book_user';

// Auth storage helper functions
export const authStorage = {
    // Get token from storage
    async getToken() {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    // Save token to storage
    async setToken(token) {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    // Remove token from storage
    async removeToken() {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    },

    // Get user data from storage
    async getUser() {
        try {
            const userJson = await AsyncStorage.getItem(USER_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    // Save user data to storage
    async setUser(user) {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user:', error);
        }
    },

    // Remove user data from storage
    async removeUser() {
        try {
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    },

    // Clear all auth data
    async clearAll() {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },

    // Check if user is logged in
    async isLoggedIn() {
        const token = await this.getToken();
        return !!token;
    },
};
