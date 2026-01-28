import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { recipeService } from '@/services/recipeService';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SecurityScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            const response: any = await recipeService.updatePassword({
                currentPassword,
                newPassword
            });

            if (response.success) {
                alert("Password updated successfully!");
                router.back();
            }
        } catch (error: any) {
            alert(error.message || "Failed to update password");
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
                <ThemedText type="subtitle">Security</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={[styles.infoCard, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' }]}>
                    <Icon name="shield-lock-outline" size={30} color="#FF6B6B" style={{ marginBottom: 10 }} />
                    <ThemedText style={styles.infoText}>
                        Keep your account secure by using a strong password.
                    </ThemedText>
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Current Password</ThemedText>
                    <TextInput
                        style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="••••••••"
                        placeholderTextColor="#888"
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>New Password</ThemedText>
                    <TextInput
                        style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="••••••••"
                        placeholderTextColor="#888"
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Confirm New Password</ThemedText>
                    <TextInput
                        style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="••••••••"
                        placeholderTextColor="#888"
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdatePassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <ThemedText style={styles.updateButtonText}>Update Password</ThemedText>
                    )}
                </TouchableOpacity>
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
    content: {
        flex: 1,
        padding: 20,
    },
    infoCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        alignItems: 'center',
    },
    infoText: {
        textAlign: 'center',
        color: '#888',
        lineHeight: 20,
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
    updateButton: {
        backgroundColor: '#FF6B6B',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 2,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
