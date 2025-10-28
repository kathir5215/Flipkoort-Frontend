// src/navigation/MainRoute.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import OtpVerifyOtpScreen from '../screens/OtpVerificationScreen';

const Stack = createNativeStackNavigator();

const MainRoute = () => {
    const { userToken } = useContext(AuthContext);

    return (


        <Stack.Navigator>
            {userToken == null ? (
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Signup"
                        component={SignupScreen}
                        options={{ title: 'Create Account' }}
                    />
                    <Stack.Screen name="VerifyOtp" component={OtpVerifyOtpScreen} options={{ title: 'Verify OTP' }} />

                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Products" component={ProductListScreen} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                    <Stack.Screen name="Cart" component={CartScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />

                </>
            )}
        </Stack.Navigator>
    );
};

export default MainRoute;
