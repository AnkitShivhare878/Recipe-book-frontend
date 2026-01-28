import { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { recipeService } from '@/services/recipeService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Recipe, ApiResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen() {
    const { id, action, day } = useLocalSearchParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [scheduling, setScheduling] = useState(false);
    const { user, updateFavorites } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const isFavorite = user?.favoriteRecipes?.includes(id as string);

    const handleFavorite = async () => {
        if (!user) {
            router.push('/(auth)/login');
            return;
        }

        try {
            if (isFavorite) {
                const res: any = await recipeService.removeFromFavorites(id as string);
                if (res.success) {
                    updateFavorites(res.data.favoriteRecipes);
                }
            } else {
                const res: any = await recipeService.addToFavorites(id as string);
                if (res.success) {
                    updateFavorites(res.data.favoriteRecipes);
                }
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update favorites');
        }
    };

    const handleAddToMealPlan = async (selectedDay: string, mealType: string = 'Lunch') => {
        if (!user) {
            router.push('/(auth)/login');
            return;
        }

        try {
            setScheduling(true);
            const planRes: any = await recipeService.getMealPlans();
            const plan = planRes.data.mealPlans?.find((p: any) => p.isActive) || planRes.data.mealPlans?.[0] || planRes.data?.[0];

            if (!plan) {
                Alert.alert("No active plan", "Please create a meal plan in the Meal Plan tab first.");
                return;
            }

            const today = new Date();
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const targetDayIdx = dayNames.indexOf(selectedDay);
            const currentDayIdx = today.getDay();
            const diff = targetDayIdx - currentDayIdx;
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + (diff >= 0 ? diff : diff + 7));

            const res: any = await recipeService.addRecipeToMealPlan(plan._id, {
                day: targetDate.toISOString().split('T')[0],
                recipeId: id as string,
                mealType: mealType,
                servings: recipe?.servings || 1
            });

            if (res.success) {
                Alert.alert("Success", `Added ${recipe?.name} to ${selectedDay}'s ${mealType}!`, [
                    { text: "View Meal Plan", onPress: () => router.push('/(tabs)/meal-plan') },
                    { text: "OK" }
                ]);
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to add to meal plan");
        } finally {
            setScheduling(false);
        }
    };

    const showMealPicker = () => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        Alert.alert(
            "Schedule Meal",
            "Which day would you like to add this to?",
            days.map(d => ({ text: d, onPress: () => handleAddToMealPlan(d) }))
                .concat([{ text: "Cancel", style: "cancel" }]) as any
        );
    };

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response: ApiResponse<Recipe> = await recipeService.getRecipeById(id as string) as any;
                if (response.success) {
                    setRecipe(response.data);
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecipeDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </ThemedView>
        );
    }

    if (!recipe) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedText>Recipe not found</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Image source={{ uri: recipe.image }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favButton} onPress={handleFavorite}>
                        <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#FF6B6B" : "#fff"} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.contentContainer, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
                    <View style={styles.infoRow}>
                        <ThemedText style={styles.cuisineText}>{recipe.cuisine}</ThemedText>
                        <View style={styles.ratingRow}>
                            <Icon name="star" size={16} color="#FFD700" />
                            <ThemedText style={styles.ratingText}>{recipe.rating} ({recipe.reviewCount} reviews)</ThemedText>
                        </View>
                    </View>

                    <ThemedText type="title" style={styles.title}>{recipe.name}</ThemedText>

                    <View style={styles.metaContainer}>
                        <View style={[styles.metaBox, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                            <Icon name="time-outline" size={20} color="#FF6B6B" />
                            <ThemedText style={styles.metaValue}>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}</ThemedText>
                            <ThemedText style={styles.metaLabel}>Mins</ThemedText>
                        </View>
                        <View style={[styles.metaBox, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                            <Icon name="flame-outline" size={20} color="#FF6B6B" />
                            <ThemedText style={styles.metaValue}>{recipe.caloriesPerServing}</ThemedText>
                            <ThemedText style={styles.metaLabel}>Kcal</ThemedText>
                        </View>
                        <View style={[styles.metaBox, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                            <Icon name="people-outline" size={20} color="#FF6B6B" />
                            <ThemedText style={styles.metaValue}>{recipe.servings}</ThemedText>
                            <ThemedText style={styles.metaLabel}>Servings</ThemedText>
                        </View>
                        <View style={[styles.metaBox, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                            <Icon name="cellular-outline" size={20} color="#FF6B6B" />
                            <ThemedText style={styles.metaValue}>{recipe.difficulty}</ThemedText>
                            <ThemedText style={styles.metaLabel}>Level</ThemedText>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>Ingredients</ThemedText>
                        {recipe.ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientRow}>
                                <Icon name="checkmark-circle" size={20} color="#FF6B6B" />
                                <ThemedText style={styles.ingredientText}>{ingredient}</ThemedText>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>Instructions</ThemedText>
                        {recipe.instructions.map((step, index) => (
                            <View key={index} style={styles.instructionRow}>
                                <View style={styles.stepBadge}>
                                    <ThemedText style={styles.stepText}>{index + 1}</ThemedText>
                                </View>
                                <ThemedText style={styles.instructionText}>{step}</ThemedText>
                            </View>
                        ))}
                    </View>

                    <View style={styles.tagContainer}>
                        {recipe.tags.map((tag, index) => (
                            <View key={index} style={[styles.tag, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
                                <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.mainButton, { opacity: scheduling ? 0.7 : 1 }]}
                        onPress={day ? () => handleAddToMealPlan(day as string) : showMealPicker}
                        disabled={scheduling}
                    >
                        <Icon name="calendar" size={20} color="#fff" />
                        <ThemedText style={styles.mainButtonText}>
                            {scheduling ? "Scheduling..." : day ? `Add to ${day}` : "Add to Meal Plan"}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        position: 'relative',
        height: 350,
        width: width,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 25,
    },
    favButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 25,
    },
    contentContainer: {
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        minHeight: 500,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cuisineText: {
        color: '#FF6B6B',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    ratingText: {
        fontSize: 14,
        color: '#888',
    },
    title: {
        fontSize: 28,
        lineHeight: 34,
        marginBottom: 25,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    metaBox: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 15,
        width: (width - 70) / 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    metaValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    metaLabel: {
        fontSize: 10,
        color: '#888',
        marginTop: 2,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 15,
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    ingredientText: {
        fontSize: 16,
        color: '#555',
        flex: 1,
    },
    instructionRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    stepBadge: {
        backgroundColor: '#FF6B6B',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    stepText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 16,
        color: '#555',
        flex: 1,
        lineHeight: 24,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 50,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 12,
        color: '#888',
    },
    mainButton: {
        backgroundColor: '#FF6B6B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
        marginBottom: 40,
        elevation: 4,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    mainButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
