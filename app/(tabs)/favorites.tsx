import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { recipeService } from '@/services/recipeService';
import { useAuth } from '@/context/AuthContext';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/types';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const fetchFavorites = async (showLoading = true) => {
        if (!user) return;
        try {
            if (showLoading) setLoading(true);
            const response: any = await recipeService.getFavorites();
            if (response.success) {
                const data = response.data.recipes || response.data;
                setFavorites(data);
            }
        } catch (error) {
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites(false);
        }, [user])
    );

    if (!user) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.centerContent}>
                    <Icon name="heart-dislike-outline" size={80} color="#FF6B6B" />
                    <ThemedText type="subtitle" style={styles.title}>Your Favorites</ThemedText>
                    <ThemedText style={styles.subtitle}>Sign in to save your favorite recipes!</ThemedText>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <ThemedText style={styles.loginButtonText}>Go to Login</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    if (loading && favorites.length === 0) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#FF6B6B" />
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">My Favorites</ThemedText>
                <ThemedText style={styles.countText}>{favorites.length} recipes saved</ThemedText>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="heart-outline" size={60} color="#ccc" />
                        <ThemedText style={styles.emptyText}>You haven't saved any recipes yet.</ThemedText>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => router.push('/(tabs)')}
                        >
                            <ThemedText style={styles.exploreButtonText}>Discover Recipes</ThemedText>
                        </TouchableOpacity>
                    </View>
                }
                onRefresh={() => fetchFavorites(false)}
                refreshing={loading}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 30,
    },
    countText: {
        fontSize: 14,
        color: '#FF6B6B',
        fontWeight: 'bold',
        marginTop: 5,
    },
    listContent: {
        paddingBottom: 100,
    },
    loginButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginVertical: 20,
        fontSize: 16,
    },
    exploreButton: {
        borderWidth: 1,
        borderColor: '#FF6B6B',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    exploreButtonText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
    },
});
