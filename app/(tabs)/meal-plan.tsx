import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { recipeService } from '@/services/recipeService';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanScreen() {
    const [mealPlans, setMealPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const fetchMealPlans = async (showLoading = true) => {
        if (!user) return;
        try {
            if (showLoading) setLoading(true);
            const response: any = await recipeService.getMealPlans();
            if (response.success) {
                // Ensure we handle pagination structure if present
                const data = response.data.mealPlans || response.data;
                setMealPlans(data);
            }
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMealPlans(mealPlans.length === 0);
        }, [user])
    );

    const activePlan = mealPlans.find(p => p.isActive) || mealPlans[0];

    const getMealsForDay = (dayName: string) => {
        if (!activePlan) return [];
        // This is a simplification: in reality, we'd match dates
        // For the demo, we'll try to match the day name or index
        return activePlan.meals?.filter((m: any) => {
            const date = new Date(m.day);
            const dayIdx = date.getDay(); // 0 is Sunday, 1 is Monday...
            const targetIdx = DAYS.indexOf(dayName) + 1; // Adjusting to match JS getDay (1-7 for Mon-Sun, with Sun being 0)
            const adjustedTarget = targetIdx === 8 ? 1 : targetIdx; // Handle Monday
            const jsDay = date.getDay();
            // Simple mapping for demo purposes
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return dayNames[jsDay] === dayName;
        }) || [];
    };

    const handleAddMeal = async (day: string) => {
        // Automatically create a plan if one doesn't exist
        if (mealPlans.length === 0) {
            await handleCreatePlan();
        }

        router.push({
            pathname: '/',
            params: { action: 'add_to_meal_plan', day: day }
        });
    };

    const handleCreatePlan = async () => {
        try {
            setLoading(true);
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);

            const response: any = await recipeService.createMealPlan({
                name: "My Weekly Plan",
                startDate: today.toISOString().split('T')[0],
                endDate: nextWeek.toISOString().split('T')[0],
                isActive: true,
                meals: []
            });

            if (response.success) {
                fetchMealPlans();
                Alert.alert("Success", "New meal plan created!");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to create meal plan");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.centerContent}>
                    <Icon name="calendar-outline" size={80} color="#FF6B6B" />
                    <ThemedText type="subtitle" style={styles.title}>Weekly Meal Plan</ThemedText>
                    <ThemedText style={styles.subtitle}>Plan your culinary week efficiently. Login to get started!</ThemedText>
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

    if (loading && mealPlans.length === 0) {
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
                <View>
                    <ThemedText type="title">Meal Plan</ThemedText>
                    {activePlan ? (
                        <ThemedText style={styles.subtitle}>{activePlan.name}</ThemedText>
                    ) : (
                        <ThemedText style={styles.subtitle}>Your healthy week starts here</ThemedText>
                    )}
                </View>
                {!activePlan && (
                    <TouchableOpacity style={styles.addButton} onPress={handleCreatePlan}>
                        <Icon name="add" size={30} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {DAYS.map((day) => {
                    const mealsForDay = getMealsForDay(day);
                    return (
                        <View key={day} style={styles.daySection}>
                            <View style={styles.dayTopRow}>
                                <ThemedText style={styles.dayName}>{day}</ThemedText>
                                <TouchableOpacity onPress={() => handleAddMeal(day)}>
                                    <Icon name="add-circle-outline" size={24} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>

                            {mealsForDay.length > 0 ? (
                                mealsForDay.map((meal: any) => (
                                    meal.items.map((item: any, idx: number) => (
                                        <TouchableOpacity
                                            key={`${meal._id}-${idx}`}
                                            style={[styles.mealCardActive, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
                                            onPress={() => router.push(`/recipe/${item.recipe._id}`)}
                                        >
                                            <Image source={{ uri: item.recipe.image }} style={styles.mealImage} />
                                            <View style={styles.mealInfo}>
                                                <ThemedText style={styles.mealTypeLabel}>{item.mealType}</ThemedText>
                                                <ThemedText style={styles.mealTitle} numberOfLines={1}>{item.recipe.name}</ThemedText>
                                            </View>
                                            <Icon name="chevron-forward" size={20} color="#ccc" />
                                        </TouchableOpacity>
                                    ))
                                ))
                            ) : (
                                <TouchableOpacity
                                    style={[styles.mealCard, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' }]}
                                    onPress={() => handleAddMeal(day)}
                                >
                                    <View style={styles.addMealCircle}>
                                        <Icon name="restaurant-outline" size={20} color="#FF6B6B" />
                                    </View>
                                    <ThemedText style={styles.addMealText}>Add a meal for {day}</ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
    },
    addButton: {
        backgroundColor: '#FF6B6B',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    daySection: {
        marginBottom: 25,
    },
    dayTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dayName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    mealCard: {
        height: 70,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#FF6B6B40',
    },
    mealCardActive: {
        height: 80,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    mealImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    mealInfo: {
        flex: 1,
    },
    mealTypeLabel: {
        fontSize: 10,
        color: '#FF6B6B',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    addMealCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    addMealText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
