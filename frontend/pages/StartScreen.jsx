import React, { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import { CommonActions } from '@react-navigation/native';

const StartScreen = ({ navigation }) => {

    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        const bodyData = {
            alias: alias,
            password: password
        }

        fetch('http://192.168.1.105:8080/user/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        })
        .then((res) => {
            return res.text();    
        })
        .then(async (data) => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data);
                await AsyncStorage.setItem('jwt', JSON.stringify(data));
                
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'Home' }
                        ],
                    })
                );
            }
        });
    }

    const navigateToCreateAccount = () => {
        navigation.navigate('CreateAccount');
    }

    return (
        <View style={styles.container}>
            <View style={styles.login}>
                <SafeAreaView>
                    <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Welcome <Text style={{ color: '#87ceeb' }}>Back!</Text></Text>
                    <Text style={{ fontSize: 17 }}>Please <Text style={{ color: '#87ceeb', fontWeight: 'bold' }}>login</Text> to Access all Features.</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.inputs}>
                    <Text style={{ fontWeight: 'bold' }}>Alias</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="person-outline" size={20} color="#4F8EF7" />
                        <TextInput 
                            style={styles.input}
                            onChangeText={text => setAlias(text)}
                            value={alias}
                            placeholder="Type here..."
                            keyboardType="default"
                        />
                    </View>

                    <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Password</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="lock-closed-outline" size={20} color="#4F8EF7" />
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setPassword(text)}
                            value={password}
                            placeholder="Type here..."
                            keyboardType="default"
                            secureTextEntry
                        />
                    </View>
                </SafeAreaView>
                <View style={{ marginTop: 14, alignItems: 'flex-end' }}>
                    <Text style={{ color: '#87ceeb' }}>Forgot Password?</Text>
                </View>
                <TouchableOpacity onPress={() => handleLogin()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={navigateToCreateAccount} style={{ marginTop: 17 }}>
                <Text style={{ color: 'white' }}>
                    Or create new Account.
                </Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  
      backgroundColor: '#191970',
      alignItems: 'center',
    },
    login: {
        backgroundColor: '#fff',
        height: '70%',
        width: '100%',
        padding: 24,
        paddingTop: 70
    },
    inputs: {
        marginTop: 100
    },
    inputIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        paddingLeft: 10,
        marginTop: 10
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        height: 40
    },
    buttonContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#87ceeb',
        alignItems: 'center',
        borderRadius: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4, 
        width: '100%'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }

});

export default StartScreen;