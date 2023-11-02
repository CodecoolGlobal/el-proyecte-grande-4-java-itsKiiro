import React, { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, Switch, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';


const CreateAccountScreen = ({ navigation }) => {

    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleSubmit = () => {

        if (!isPolicyAccepted) {
            alert('Please accept the policy before proceeding.');
            return;
        }

        if (password != confirmPassword) {
            alert('Password must equal confirmed Password!')
            return;
        }

        const bodyData = {
            alias: alias,
            password: password,
            email: email,
            name: name,
            birthdate: date
        }

        fetch("http://172.20.10.3:8080/user/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        })
        .then((res) => {
            if (res.ok) {
                navigation.navigate("Start")
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.signup}>
                
                <View>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#fff' }}>Welcome!</Text>
                    <Text style={{ fontSize: 17, color: '#fff' }}>Create new Account to Access all Features.</Text>
                </View>
                <SafeAreaView style={styles.inputs}>
                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>Alias</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="person-outline" size={20} color="#fff" />
                        <TextInput 
                            style={styles.input}
                            onChangeText={text => setAlias(text)}
                            value={alias}
                            placeholder="Type here..."
                            keyboardType="default"
                        />
                    </View>

                    <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#fff' }}>Email</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="mail-outline" size={20} color="#fff" />
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setEmail(text)}
                            value={email}
                            placeholder="Type here..."
                            keyboardType="default"
                        />
                    </View>

                    <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#fff' }}>Name</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="body-outline" size={20} color="#fff" />
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setName(text)}
                            value={name}
                            placeholder="Type here..."
                            keyboardType="default"
                        />
                    </View>

                    <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#fff' }}>Birthdate</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="calendar-outline" size={20} color="#fff" />

                        <DateTimePicker
                            style={styles.datePicker}
                            testID="dateTimePicker"
                            value={date}
                            mode={'date'}
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || date;
                                setDate(currentDate);
                            }}
                        />
                        
                        <TextInput
                            style={styles.input}
                            value={date.toLocaleDateString()}
                            placeholder="Select a date..."
                            onFocus={() => setShowDatePicker(true)}
                            editable={false}
                        />
                    </View>

                    <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#fff' }}>Password</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="lock-closed-outline" size={20} color="#fff" />
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setPassword(text)}
                            value={password}
                            placeholder="Type here..."
                            keyboardType="default"
                            secureTextEntry
                        />
                    </View>

                    <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#fff' }}>Confirm Password</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="lock-closed-outline" size={20} color="#fff" />
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setConfirmPassword(text)}
                            value={confirmPassword}
                            placeholder="Type here..."
                            keyboardType="default"
                            secureTextEntry
                        />
                    </View>
                </SafeAreaView>

                <SafeAreaView style={styles.policyContainer}>
                <Switch 
                    value={isPolicyAccepted}
                    onValueChange={(value) => setIsPolicyAccepted(value)}
                    thumbColor={isPolicyAccepted ? '#87ceeb' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
                <Text style={styles.policyText}>
                    I accept the policy.
                </Text>
                </SafeAreaView>

                <TouchableOpacity onPress={() => handleSubmit()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  
      backgroundColor: '#191970',
      alignItems: 'center',
    },
    signup: {
        backgroundColor: '#191970',
        height: '100%',
        width: '100%',
        padding: 24,
        paddingTop: 70
    },
    inputs: {
        marginTop: 70
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
        height: 40,
        color: '#fff'
    },
    buttonContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderRadius: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4, 
        width: '100%',
        marginBottom: "100%"
    },
    buttonText: {
        color: '#1a1a1a',
        fontWeight: 'bold',
        fontSize: 16
    },
    policyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    policyText: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 16
    },
    datePicker: {
        marginRight: 100,
        color: "white"
    }
    

});

export default CreateAccountScreen;