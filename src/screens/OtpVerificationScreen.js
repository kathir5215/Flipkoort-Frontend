import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';
import CustomToast from '../Service/Hook/Toast/CustomToast';

export default function OtpVerificationScreen({ route, navigation }) {
    const { destination } = route?.params; // Can be phone or email
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const inputs = useRef([]);

    // Countdown logic
    useEffect(() => {
        let interval;
        if (isResendDisabled && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer, isResendDisabled]);

    // Handle OTP input change
    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < otp.length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    // // Verify OTP
    // const verifyOtp = async () => {
    //     try {
    //         const enteredOtp = otp.join('');
    //         console.log(enteredOtp, "ddd");
    //         console.log(destination, "eee");
    //         const res = await api.post('/auth/verify-otp',
    //             { destination, otp: enteredOtp });
    //         console.log(res, "res");

    //         if (res.status === 200) {
    //             CustomToast('OTP Verified Successfully');
    //             navigation.navigate('Login');
    //         } else {
    //             CustomToast('Invalid OTP');
    //         }
    //     } catch (error) {
    //         console.log(error?.response?.data || error?.response?.message);
    //         CustomToast('Verification failed');
    //     }
    // };

    const verifyOtp = async () => {
        try {
            const enteredOtp = otp.join('');
            const payload = {
                destination,
                otp: enteredOtp,
                username: signupPayload?.username,  // ensure signupPayload passed to this screen
                password: signupPayload?.password,
            };

            const res = await api.post('/auth/verify-otp', payload);
            // expected response: { token: "...", username: "..." }
            const token = res?.data?.token;
            if (token) {
                // save token to AsyncStorage and context
                await AsyncStorage.setItem('userToken', token);
                if (typeof login === 'function') login(token);
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                CustomToast('OTP verified but no token returned');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.log('verify err', error?.response?.data || error?.message);
            CustomToast(String(error?.response?.data || 'Verification failed'));
        }
    };
    // Resend OTP
    const resendOtp = async () => {
        try {
            setIsResendDisabled(true);
            setTimer(30);
            await api.post('/auth/resend-otp', { destination });
            CustomToast('OTP resent successfully');
        } catch (error) {
            CustomToast('Failed to resend OTP');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Sent to {destination}</Text>

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => (inputs.current[index] = el)}
                        style={styles.otpBox}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp}>
                <Text style={styles.btnText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.resendBtn, isResendDisabled && styles.disabledResend]}
                onPress={resendOtp}
                disabled={isResendDisabled}
            >
                <Text style={styles.resendText}>
                    {isResendDisabled ? `Resend in ${timer}s` : 'Resend OTP'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
        marginBottom: 30,
    },
    otpBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: 50,
        height: 50,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
    },
    verifyBtn: {
        backgroundColor: '#2874F0',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    resendBtn: {
        marginTop: 15,
    },
    resendText: {
        color: '#2874F0',
        fontSize: 16,
    },
    disabledResend: {
        opacity: 0.5,
    },
});
