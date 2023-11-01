import React, { useState, useEffect, useCallback } from "react";
import { Button, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import profilePlaceholderImage from '../assets/profilePlaceholder.png';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';



const SettingScreen = () => {
    const [user, setUser] = useState({});
    const [profilePicture, setProfilePicture] = useState("");
    const [updateAlias, setUpdateAlias] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updatePassword, setUpdatePassword] = useState("");
    const [updateEmail, setUpdateEmail] = useState("");
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
          const token = await AsyncStorage.getItem('jwt');
          if (token) {
            setToken(JSON.parse(token))
          }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetch("http://192.168.1.105:8080/user/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                }
            }).then((res) => res.json())
            .then((data) => {
                setUser(data);
            })
        }
    })

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.0001,
        });
      
        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
            uploadImage(result.assets[0].uri)
        }
    };
      

    const uploadImage = (uri) => {
        const data = new FormData();
        data.append('profilePicture', {
          uri: uri,
          type: 'image/jpeg',
          name: 'profilePic.jpg',
        });
        
        fetch(`http://192.168.1.105:8080/user/upload/${user.alias}`, {
          method: 'POST',
          headers: {
            "Content-Type": "multipart/form-data"
          },
          body: data,
        }).then((response) => {
          if (response.ok) {
    
            alert("picture uploaded")
            return response.text();
          } else {
            alert("error while uploading")
          }
        });
    };

    const navigateBack = () => {
        navigation.goBack();
    }

    const handleLogout = () => {
        AsyncStorage.removeItem('jwt');
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Start' }
                ],
            })
        );
    }

    const handleEdit = async (alias) => {
        await fetch(`http://192.168.1.105:8080/user/update/profile/${alias}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                alias: updateAlias ? updateAlias : user.alias,
                name: updateName ? updateName : user.name,
                password: updatePassword ? updatePassword : user.password,
                email: updateEmail ? updateEmail : user.email
            })
        })
        .then((res) => {
            if (res.ok) {
                alert("Settings saved")
                navigateBack();
            } else {
                alert("Something went wrong")
            }
        })
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
    
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            
            if (token) {
                fetch("http://192.168.1.105:8080/user/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`,
                    }
                }).then((res) => res.json())
                .then((data) => {
                    setUser(data);
                })
            }
    
        } catch (error) {
            console.error("Error while refreshing:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);
      

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ zIndex: 1 }} onPress={navigateBack}>
                <Icon style={styles.backIcon} name="chevron-back-outline" size={20} color="#4F8EF7" />
            </TouchableOpacity>

            <ScrollView 
                style={styles.inputsContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />
                }
            >
                <View style={styles.imageContainer}>
                    <Image 
                        source={user.profilePicture ? { uri: `http://192.168.1.105:8080/user/${user.alias}/profilePicture` } : profilePlaceholderImage}
                        style={{ width: 100, height: 100, borderRadius: 100 }}
                    />
                    <Button title="Choose Picture" onPress={() => pickImage()} />
                </View>
      
                <View style={styles.inputContainer}>
                    <Text style={{ color: "white" }}>Alias</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="person-outline" size={20} color="#4F8EF7" />
                        <TextInput 
                            style={styles.input}
                            onChangeText={text => setUpdateAlias(text)}
                            value={updateAlias}
                            keyboardType="default"
                            placeholder={user.alias || ""}
                            placeholderTextColor={"white"}
                        >
                        </TextInput>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={{ color: "white" }}>Name</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="body-outline" size={20} color="#4F8EF7" />
                        <TextInput 
                            style={styles.input}
                            onChangeText={text => setUpdateName(text)}
                            value={updateName}
                            keyboardType="default"
                            placeholder={user.name || ""}
                            placeholderTextColor={"white"}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={{ color: "white" }}>Email</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="mail-outline" size={20} color="#4F8EF7" />
                        <TextInput 
                            style={styles.input}
                            onChangeText={text => setUpdateEmail(text)}
                            value={updateEmail}
                            keyboardType="default"
                            placeholder={user.email || ""}
                            placeholderTextColor={"white"}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={{ color: "white" }}>Password</Text>
                    <View style={styles.inputIconContainer}>
                        <Icon style={styles.icon} name="lock-closed-outline" size={20} color="#4F8EF7" />
                        <TextInput 
                            style={styles.input}
                            onChangeText={text => setUpdatePassword(text)}
                            value={updatePassword}
                            keyboardType="default"
                            placeholder={user.password || ""}
                            placeholderTextColor={"white"}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={() => handleEdit(user.alias)} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Save changes</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleLogout()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#191970',
        flex: 1
    },
    imageContainer: {
        marginTop: "25%",
        display: "flex",
        alignItems: "center",
    },
    input: {
        flex: 1,
        height: 40,
        color: "white"
    },
    inputIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        paddingLeft: 10,
        marginTop: 10
    },
    inputContainer: {
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: 10
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
        width: '80%',
        alignSelf: "center"
    },
    backIcon: {
        position: "absolute",
        top: 0,
        left: 0,
        color: "white",
        marginTop: 80,
        marginLeft: 40,
        fontSize: 40,
        zIndex: 1,
    }
    

})


export default SettingScreen;