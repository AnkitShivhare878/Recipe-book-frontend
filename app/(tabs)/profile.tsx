import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleLogout = async () => {
        const confirmLogout = window.confirm ? window.confirm("Are you sure you want to logout?") : true;
        if (confirmLogout) {
            await logout();
            router.replace('/(auth)/login');
        }
    };

    const handleMenuPress = (title: string) => {
        alert(`${title} feature coming soon!`);
    };

    if (!user) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.loginPrompt}>
                    <Icon name="person-circle-outline" size={80} color="#FF6B6B" />
                    <ThemedText type="subtitle" style={styles.promptTitle}>Not logged in</ThemedText>
                    <ThemedText style={styles.promptSubtitle}>Join TasteBuds to save recipes and more!</ThemedText>
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

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.profileImageContainer}>
                        <Image source={{ uri: user.image }} style={styles.profileImage} />
                        <TouchableOpacity style={styles.editImageButton} onPress={() => handleMenuPress("Change Photo")}>
                            <Icon name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <ThemedText type="title" style={styles.userName}>{user.firstName} {user.lastName}</ThemedText>
                    <ThemedText style={styles.userHandle}>@{user.username}</ThemedText>
                    <ThemedText style={styles.bio}>{user.bio}</ThemedText>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <ThemedText style={styles.statValue}>{user.favoriteRecipes?.length || 0}</ThemedText>
                        <ThemedText style={styles.statLabel}>Favorites</ThemedText>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statBox}>
                        <ThemedText style={styles.statValue}>2.4k</ThemedText>
                        <ThemedText style={styles.statLabel}>Followers</ThemedText>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statBox}>
                        <ThemedText style={styles.statValue}>48</ThemedText>
                        <ThemedText style={styles.statLabel}>Following</ThemedText>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>

                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' }]}
                        onPress={() => router.push('/profile/edit')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Icon name="person-outline" size={22} color="#FF6B6B" />
                        </View>
                        <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
                        <Icon name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' }]}
                        onPress={() => handleMenuPress("Notifications")}
                    >
                        <View style={styles.menuIconContainer}>
                            <Icon name="notifications-outline" size={22} color="#FF6B6B" />
                        </View>
                        <ThemedText style={styles.menuText}>Notifications</ThemedText>
                        <Icon name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' }]}
                        onPress={() => router.push('/profile/security')}
                    >
                        <View style={styles.menuIconContainer}>
                            <Icon name="shield-checkmark-outline" size={22} color="#FF6B6B" />
                        </View>
                        <ThemedText style={styles.menuText}>Security</ThemedText>
                        <Icon name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: isDark ? '#1e1e1e' : '#fff0f0' }]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.menuIconContainer, { backgroundColor: '#FF6B6B20' }]}>
                            <Icon name="log-out-outline" size={22} color="#FF6B6B" />
                        </View>
                        <ThemedText style={[styles.menuText, { color: '#FF6B6B' }]}>Logout</ThemedText>
                        <Icon name="chevron-forward" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <ThemedText style={styles.versionText}>TasteBuds v1.0.0</ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loginPrompt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    promptTitle: {
        marginTop: 20,
        marginBottom: 10,
    },
    promptSubtitle: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 30,
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
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FF6B6B20',
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF6B6B',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        marginBottom: 4,
    },
    userHandle: {
        fontSize: 14,
        color: '#FF6B6B',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    bio: {
        textAlign: 'center',
        paddingHorizontal: 40,
        color: '#888',
        lineHeight: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 30,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#eee',
    },
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        marginLeft: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    versionText: {
        color: '#ccc',
        fontSize: 12,
    },
});
