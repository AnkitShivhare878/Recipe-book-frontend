import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { recipeService } from '@/services/recipeService';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EditProfileScreen() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!firstName || !lastName || !username) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            const response: any = await recipeService.updateProfile({
                firstName,
                lastName,
                username,
                bio
            });

            if (response.success) {
                updateUser(response.data);
                alert("Profile updated successfully!");
                router.back();
            }
        } catch (error: any) {
            alert(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <ThemedText type="subtitle">Edit Profile</ThemedText>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#FF6B6B" />
                    ) : (
                        <ThemedText style={styles.saveText}>Save</ThemedText>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>First Name</ThemedText>
                    <TextInput
                        style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Last Name</ThemedText>
                    <TextInput
                        style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Username</ThemedText>
                    <TextInput
                        style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Bio</ThemedText>
                    <TextInput
                        style={[styles.input, styles.textArea, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself..."
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={4}
                    />
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    saveText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        paddingTop: 15,
        textAlignVertical: 'top',
    },
});
