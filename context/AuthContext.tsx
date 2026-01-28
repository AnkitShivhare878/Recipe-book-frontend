import React, { createContext, useState, useContext, useEffect } from 'react';
import { authStorage } from '@/utils/authStorage';
import apiClient from '@/services/apiClient';
import { ENDPOINTS } from '@/config/api';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    image: string;
    bio: string;
    role: string;
    favoriteRecipes?: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateFavorites: (newFavorites: string[]) => void;
    updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await authStorage.getToken();
                if (token) {
                    // Fetch fresh user data from server
                    const response: any = await apiClient.get(ENDPOINTS.GET_ME);
                    if (response.success) {
                        const userData = response.data;
                        // Normalize favorites to IDs only
                        if (userData.favoriteRecipes) {
                            userData.favoriteRecipes = userData.favoriteRecipes.map((f: any) => typeof f === 'string' ? f : (f._id || f.id));
                        }
                        setUser(userData);
                        await authStorage.setUser(userData);
                    }
                } else {
                    const storedUser = await authStorage.getUser();
                    if (storedUser) {
                        setUser(storedUser);
                    }
                }
            } catch (error) {
                console.error('Error loading user:', error);
                // Fallback to stored user if network fails
                const storedUser = await authStorage.getUser();
                if (storedUser) setUser(storedUser);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response: any = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
            if (response.success) {
                const { token, ...userData } = response.data;
                await authStorage.setToken(token);

                // Fetch full profile to get favorites and other details
                const profileRes: any = await apiClient.get(ENDPOINTS.GET_ME);
                const fullUserData = profileRes.success ? profileRes.data : userData;

                if (fullUserData.favoriteRecipes) {
                    fullUserData.favoriteRecipes = fullUserData.favoriteRecipes.map((f: any) => typeof f === 'string' ? f : (f._id || f.id));
                }

                await authStorage.setUser(fullUserData);
                setUser(fullUserData);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authStorage.clearAll();
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const updateFavorites = async (newFavorites: any[]) => {
        if (user) {
            // Normalize to IDs
            const favoriteIds = newFavorites.map(f => typeof f === 'string' ? f : (f._id || f.id));
            const updatedUser = { ...user, favoriteRecipes: favoriteIds };
            setUser(updatedUser);
            await authStorage.setUser(updatedUser);
        }
    };

    const updateUser = async (updatedData: User) => {
        setUser(updatedData);
        await authStorage.setUser(updatedData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateFavorites, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
