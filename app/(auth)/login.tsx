import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DEFAULT_USER } from '@/config/api';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState(DEFAULT_USER.email);
    const [password, setPassword] = useState(DEFAULT_USER.password);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            alert('Login Failed: ' + error.message + '\nCheck if backend is running at http://127.0.0.1:5001');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Icon name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Icon name="restaurant" size={40} color="#fff" />
                        </View>
                        <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
                        <ThemedText style={styles.subtitle}>TasteBuds - Discover, Cook, Share</ThemedText>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.label}>Email Address</ThemedText>
                            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
                                <Icon name="mail-outline" size={20} color="#FF6B6B" />
                                <TextInput
                                    style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                                    placeholder="your@email.com"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.label}>Password</ThemedText>
                            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
                                <Icon name="lock-closed-outline" size={20} color="#FF6B6B" />
                                <TextInput
                                    style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                                    placeholder="••••••••"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Icon
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#ccc"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={() => router.push('/(auth)/forgot-password')}
                        >
                            <ThemedText style={styles.forgotText}>Forgot Password?</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
                            )}
                        </TouchableOpacity>

                        <View style={styles.socialHeader}>
                            <View style={styles.socialLine} />
                            <ThemedText style={styles.socialText}>Or login with</ThemedText>
                            <View style={styles.socialLine} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
                                <Icon name="logo-google" size={24} color="#DB4437" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
                                <Icon name="logo-apple" size={24} color={isDark ? '#fff' : '#000'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
                                <Icon name="logo-facebook" size={24} color="#4267B2" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 25,
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 10,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    title: {
        fontSize: 32,
        marginBottom: 8,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 4,
        color: '#888',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderRadius: 18,
        paddingHorizontal: 20,
    },
    input: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotText: {
        color: '#FF6B6B',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loginButton: {
        height: 60,
        backgroundColor: '#FF6B6B',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    socialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 40,
    },
    socialLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    socialText: {
        marginHorizontal: 15,
        color: '#999',
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
