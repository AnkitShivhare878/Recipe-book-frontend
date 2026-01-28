import { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { recipeService } from '@/services/recipeService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import RecipeCard from '@/components/RecipeCard';
import { Recipe, ApiResponse, PaginatedRecipes } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/config/api';

const { width } = Dimensions.get('window');

const MEAL_TYPES = [
  { id: '1', name: 'Breakfast', icon: 'sunny-outline' },
  { id: '2', name: 'Lunch', icon: 'restaurant-outline' },
  { id: '3', name: 'Dinner', icon: 'moon-outline' },
  { id: '4', name: 'Snack', icon: 'cafe-outline' },
  { id: '5', name: 'Dessert', icon: 'ice-cream-outline' },
];

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('All');
  const { user } = useAuth();
  const { cuisine, mealType, action, day } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const navParams = { action, day };

  const handleProfilePress = () => {
    if (user) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/(auth)/login');
    }
  };

  const fetchRecipes = async (query = '', mealType = 'All', cuisineFilter = '') => {
    try {
      console.log('Fetching recipes...', { query, mealType, cuisineFilter });
      setLoading(true);
      let response: ApiResponse<PaginatedRecipes>;

      const params: any = {};
      if (mealType !== 'All') params.mealType = mealType;
      if (cuisineFilter) params.cuisine = cuisineFilter;

      if (query) {
        response = await recipeService.searchRecipes(query, params) as any;
      } else {
        response = await recipeService.getRecipes(params) as any;
      }

      console.log('API Response:', response);

      if (response && response.success) {
        console.log('Successfully fetched recipes:', response.data.recipes.length);
        setRecipes(response.data.recipes);
      } else {
        console.warn('API Success False:', response);
        alert('API error: ' + (response?.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      alert('Network Error: ' + error.message + '\nURL: ' + API_BASE_URL);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (cuisine) {
      console.log('Received cuisine filter:', cuisine);
      fetchRecipes('', 'All', cuisine as string);
    } else if (mealType) {
      setSelectedMealType(mealType as string);
    } else {
      fetchRecipes(searchQuery, selectedMealType);
    }
  }, [cuisine, mealType]);

  useEffect(() => {
    if (!cuisine) {
      fetchRecipes(searchQuery, selectedMealType);
    }
  }, [selectedMealType]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes(searchQuery, selectedMealType, cuisine as string);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleQuickAdd = async (recipe: Recipe) => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    try {
      setLoading(true);
      const planRes: any = await recipeService.getMealPlans();
      const plan = planRes.data.mealPlans?.find((p: any) => p.isActive) || planRes.data?.[0];

      const today = new Date();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayIdx = dayNames.indexOf(day as string);
      const currentDayIdx = today.getDay();
      const diff = targetDayIdx - currentDayIdx;
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + (diff >= 0 ? diff : diff + 7));

      const res: any = await recipeService.addRecipeToMealPlan(plan._id, {
        day: targetDate.toISOString().split('T')[0],
        recipeId: recipe._id,
        mealType: 'Lunch', // Default
        servings: recipe.servings || 1
      });

      if (res.success) {
        alert(`Successfully added ${recipe.name} to ${day}!`);
        router.push('/(tabs)/meal-plan');
      }
    } catch (error: any) {
      alert(error.message || "Failed to add to meal plan");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {action === 'add_to_meal_plan' && (
        <View style={styles.selectionBanner}>
          <Icon name="calendar" size={20} color="#fff" style={{ marginRight: 10 }} />
          <ThemedText style={styles.selectionText}>Pick a recipe for {day}</ThemedText>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Icon name="close-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.titleRow}>
        <View>
          <ThemedText type="title" style={styles.brandTitle}>TasteBuds</ThemedText>
          <ThemedText style={styles.subtitle}>What would you like to cook?</ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.profileButton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
          onPress={handleProfilePress}
        >
          {user ? (
            <Image source={{ uri: user.image }} style={styles.profileImg} />
          ) : (
            <Icon name="person-outline" size={24} color={isDark ? '#fff' : '#000'} />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
        <Icon name="search-outline" size={20} color="#999" />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
          placeholder="Search recipes, ingredients..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={() => fetchRecipes(searchQuery, selectedMealType)}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => { setSearchQuery(''); fetchRecipes('', selectedMealType); }}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedMealType === 'All' && styles.categoryItemActive,
              { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }
            ]}
            onPress={() => setSelectedMealType('All')}
          >
            <ThemedText style={[styles.categoryText, selectedMealType === 'All' && styles.categoryTextActive]}>All</ThemedText>
          </TouchableOpacity>

          {MEAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.categoryItem,
                selectedMealType === type.name && styles.categoryItemActive,
                { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }
              ]}
              onPress={() => setSelectedMealType(type.name)}
            >
              <Icon
                name={type.icon as any}
                size={16}
                color={selectedMealType === type.name ? '#fff' : '#888'}
                style={{ marginRight: 6 }}
              />
              <ThemedText style={[styles.categoryText, selectedMealType === type.name && styles.categoryTextActive]}>{type.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {selectedMealType === 'All' ? 'Featured Recipes' : `${selectedMealType} Recipes`}
        </ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.seeAllText}>See All</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {loading && !refreshing && recipes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              params={navParams}
              onAddPress={action === 'add_to_meal_plan' ? () => handleQuickAdd(item) : undefined}
            />
          )}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B6B" />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="restaurant-outline" size={60} color="#ccc" />
              <ThemedText style={styles.emptyText}>No recipes found</ThemedText>
              <TouchableOpacity style={styles.resetButton} onPress={() => { setSelectedMealType('All'); setSearchQuery(''); }}>
                <ThemedText style={styles.resetButtonText}>View All Recipes</ThemedText>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  brandTitle: {
    fontSize: 32,
    color: '#FF6B6B',
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 2,
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoriesScroll: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  categoryItemActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
  },
  resetButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FF6B6B20',
  },
  resetButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  selectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  selectionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
});
