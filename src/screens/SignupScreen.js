// src/screens/SignupScreen.js
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import api from '../services/api'; // your axios instance

export default function SignupScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const err = {};

        if (!username || username.trim().length < 3) {
            err.username = 'Username must be at least 3 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            err.email = 'Enter a valid email address';
        }

        // require 10-digit phone (you can relax if needed)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone || !phoneRegex.test(phone)) {
            err.phone = 'Enter a valid 10-digit phone number';
        }

        if (!password || password.length < 6) {
            err.password = 'Password must be at least 6 characters long';
        }

        if (!confirmPassword) {
            err.confirmPassword = 'Confirm password is required';
        } else if (password !== confirmPassword) {
            err.confirmPassword = 'Passwords do not match';
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleRequestOtp = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // request OTP for the phone (backend expects { phone })
            await api.post('/auth/request-otp', { destination: email });

            // navigate to VerifyOtp screen and pass signup data
            navigation.navigate('VerifyOtp', { destination: email, signupPayload: { username, password } });

        } catch (err) {
            console.log('request-otp err', err?.response?.data || err?.message);
            Alert.alert('Error', (err?.response?.data && String(err.response.data)) || 'Failed to request OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding' })}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Create an account</Text>

                <TextInput
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                {errors.username && <Text style={styles.errTxt}>{errors.username}</Text>}

                <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errTxt}>{errors.email}</Text>}

                <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="Phone (10 digits)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                {errors.phone && <Text style={styles.errTxt}>{errors.phone}</Text>}

                <View style={[styles.passwordRow, errors.password && styles.inputError]}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeBtn}>
                        <Text style={{ fontSize: 14 }}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errTxt}>{errors.password}</Text>}

                <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="Confirm password"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                />
                {errors.confirmPassword && <Text style={styles.errTxt}>{errors.confirmPassword}</Text>}

                <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleRequestOtp} disabled={loading}>
                    <Text style={styles.btnText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 80 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 48,
        alignItems: 'center',
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    inputError: { borderColor: '#E53935' },
    errTxt: { color: '#E53935', alignSelf: 'flex-start', marginBottom: 8 },
    passwordRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    eyeBtn: { padding: 8, marginLeft: 8 },
    btn: {
        width: '100%',
        backgroundColor: '#FF6F00',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 6,
    },
    btnDisabled: { opacity: 0.7 },
    btnText: { color: '#fff', fontWeight: '700' },
    row: { flexDirection: 'row', marginTop: 16 },
    link: { color: '#0a74da', fontWeight: '600' }
});
