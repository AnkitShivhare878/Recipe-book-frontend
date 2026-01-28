import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Recipe } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { recipeService } from '@/services/recipeService';

const { width } = Dimensions.get('window');

interface RecipeCardProps {
    recipe: Recipe;
    params?: any;
    onAddPress?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, params, onAddPress }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'hard': return '#F44336';
            default: return '#888';
        }
    };

    const router = useRouter();
    const { user, updateFavorites } = useAuth();
    const isFavorite = user?.favoriteRecipes?.includes(recipe._id);

    const handleFavorite = async (e: any) => {
        e.stopPropagation();
        if (!user) {
            router.push('/(auth)/login');
            return;
        }

        try {
            if (isFavorite) {
                const res: any = await recipeService.removeFromFavorites(recipe._id);
                if (res.success) {
                    updateFavorites(res.data.favoriteRecipes);
                }
            } else {
                const res: any = await recipeService.addToFavorites(recipe._id);
                if (res.success) {
                    updateFavorites(res.data.favoriteRecipes);
                }
            }
        } catch (error: any) {
            console.error('Favorite toggle error:', error);
            alert(error.message || 'Failed to update favorites');
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.container}
            onPress={() => {
                console.log('Navigating to recipe:', recipe._id);
                router.push({
                    pathname: `/recipe/${recipe._id}`,
                    params: params
                });
            }}
        >
            <ThemedView style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: recipe.image }}
                        style={styles.image}
                        contentFit="cover"
                        transition={500}
                    />
                    <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
                        <Icon name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? "#FF6B6B" : "#fff"} />
                    </TouchableOpacity>
                    <View style={styles.ratingBadge}>
                        <Icon name="star" size={14} color="#FFD700" />
                        <ThemedText style={styles.ratingText}>{recipe.rating}</ThemedText>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <ThemedText style={styles.cuisineText}>{recipe.cuisine}</ThemedText>
                        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) + '20' }]}>
                            <ThemedText style={[styles.difficultyText, { color: getDifficultyColor(recipe.difficulty) }]}>
                                {recipe.difficulty}
                            </ThemedText>
                        </View>
                    </View>

                    <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={1}>
                        {recipe.name}
                    </ThemedText>

                    <View style={styles.footerRow}>
                        <View style={styles.metaItem}>
                            <Icon name="time-outline" size={16} color="#888" />
                            <ThemedText style={styles.metaText}>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</ThemedText>
                        </View>
                        {onAddPress ? (
                            <TouchableOpacity style={styles.quickAddButton} onPress={(e) => { e.stopPropagation(); onAddPress(); }}>
                                <Icon name="add" size={16} color="#fff" />
                                <ThemedText style={styles.quickAddText}>ADD</ThemedText>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <View style={styles.metaItem}>
                                    <Icon name="flame-outline" size={16} color="#888" />
                                    <ThemedText style={styles.metaText}>{recipe.caloriesPerServing} kcal</ThemedText>
                                </View>
                                <View style={styles.metaItem}>
                                    <Icon name="people-outline" size={16} color="#888" />
                                    <ThemedText style={styles.metaText}>{recipe.servings} ser</ThemedText>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 8,
        borderRadius: 20,
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    ratingText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoContainer: {
        padding: 15,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cuisineText: {
        color: '#FF6B6B',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#888',
    },
    quickAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    quickAddText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default RecipeCard;
