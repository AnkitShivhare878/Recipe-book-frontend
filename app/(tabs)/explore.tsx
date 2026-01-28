import { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { recipeService } from '@/services/recipeService';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

export default function ExploreScreen() {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response: any = await recipeService.getCuisines();
        if (response.success) {
          setCuisines(response.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  const getCuisineIcon = (cuisine: string) => {
    switch (cuisine.toLowerCase()) {
      case 'italian': return 'pizza-outline';
      case 'indian': return 'flame-outline';
      case 'mexican': return 'restaurant-outline';
      case 'thai': return 'leaf-outline';
      case 'japanese': return 'fish-outline';
      case 'american': return 'fast-food-outline';
      case 'french': return 'cafe-outline';
      default: return 'restaurant-outline';
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Explore Cuisines</ThemedText>
        <ThemedText style={styles.subtitle}>Find your favorite flavors from around the world</ThemedText>
      </ThemedView>

      <FlatList
        data={cuisines}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.cuisineCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
            onPress={() => {
              router.push({
                pathname: '/',
                params: { cuisine: item }
              });
            }}
          >
            <View style={styles.iconContainer}>
              <Icon name={getCuisineIcon(item)} size={32} color="#FF6B6B" />
            </View>
            <ThemedText style={styles.cuisineName}>{item}</ThemedText>
          </TouchableOpacity>
        )}
      />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cuisineCard: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    margin: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cuisineName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
