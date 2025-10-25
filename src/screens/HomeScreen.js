import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Flipkart Clone 🛒</Text>
            <Button title="Go to Products" onPress={() => navigation.navigate('Products')} />
            <Button title="Cart" onPress={() => navigation.navigate('Cart')} />
            <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
            <View style={{ marginTop: 20 }}>
                <Button title="Logout" onPress={logout} color="red" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
