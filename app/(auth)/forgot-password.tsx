import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleReset = async () => {
        if (!email) {
            alert('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitted(true);
        } catch (error) {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.successContent}>
                    <View style={styles.successIconOuter}>
                        <View style={styles.successIconInner}>
                            <Icon name="mail-unread-outline" size={40} color="#fff" />
                        </View>
                    </View>
                    <ThemedText type="subtitle" style={styles.successTitle}>Check Your Email</ThemedText>
                    <ThemedText style={styles.successSubtitle}>
                        We've sent a password reset link to {email}.
                    </ThemedText>
                    <TouchableOpacity
                        style={styles.backToLoginBtn}
                        onPress={() => router.replace('/(auth)/login')}
                    >
                        <ThemedText style={styles.backToLoginText}>Back to Login</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Icon name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <ThemedText type="title" style={styles.title}>Forgot Password?</ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Enter your email address and we'll send you a link to reset your password.
                        </ThemedText>
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

                        <TouchableOpacity
                            style={[styles.resetButton, loading && styles.disabledButton]}
                            onPress={handleReset}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <ThemedText style={styles.resetButtonText}>Send Reset Link</ThemedText>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.footer}
                            onPress={() => router.back()}
                        >
                            <ThemedText style={styles.footerText}>Wait, I remember my password!</ThemedText>
                        </TouchableOpacity>
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
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        marginBottom: 12,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 30,
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
    resetButton: {
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
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
    },
    footerText: {
        color: '#FF6B6B',
        fontSize: 14,
        fontWeight: 'bold',
    },
    successContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    successIconOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FF6B6B20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    successIconInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    successTitle: {
        fontSize: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    successSubtitle: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 40,
    },
    backToLoginBtn: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: '#FF6B6B',
        borderRadius: 15,
    },
    backToLoginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
