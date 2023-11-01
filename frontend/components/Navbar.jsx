import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, Text, Animated, Easing, Image, Button, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import profilePlaceholderImage from '../assets/profilePlaceholder.png';

import * as Location from 'expo-location';


const Navbar = ({ user }) => {

    const [nearbyUsers, setNearbyUsers] = useState([]);
    const navigation = useNavigation();
    const animationValue = useState(new Animated.Value(0))[0];
    const [iconLoading, setIconLoading] = useState(false);
    const rotateValue = useState(new Animated.Value(0))[0];


    const searchContainerStyle = {
        ...styles.searchContainer,
        bottom: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['-70%', '0%']
        })
    };

    const updateUserLocation = async () => {
        try {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
    
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
    
            await fetch('http://192.168.1.105:8080/user/update-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAlias: user.alias,
                    latitude,
                    longitude,
                }),
            })

        } catch (error) {
            console.error(error)
        }

    };

    const startIconRotation = () => {
        rotateValue.setValue(0);
        Animated.sequence([
            Animated.timing(rotateValue, {
                toValue: 0.25,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }),
            Animated.timing(rotateValue, {
                toValue: 2,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear
            })
        ]).start(() => {
            if (iconLoading) {
                startIconRotation();
            }
        });
    };
    
    
    const rotateInterpolation = rotateValue.interpolate({
        inputRange: [0, 2],
        outputRange: ['0deg', '720deg']
    });
    
    const iconStyle = {
        transform: [{ rotate: rotateInterpolation }]
    };    

    const startSearch = async () => {
        setIconLoading(true);
        startIconRotation();
        updateUserLocation();
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const response = await fetch('http://192.168.1.105:8080/user/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude,
                longitude,
            }),
        });

        const nearbyUsersData = await response.json();
        setNearbyUsers(nearbyUsersData);
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false
        }).start(() => {
            
        }); 
        setIconLoading(false);
    };

    useEffect(() => {
        
        updateUserLocation();
    }, [updateUserLocation]);
    

    const closeSearch = () => {
        Animated.timing(animationValue, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.quad),
            useNativeDriver: false
        }).start();        
    }

    const handleAddUser = async (add) => {
        await fetch('http://192.168.1.105:8080/user/friend/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userToAdd: add, userAlias: user.alias })
        })
        .then((res) => {
            if (res.ok) {
                alert("User added")
            } else {
                alert("error while adding user")
            }
        })
    }
    

    return (
        <>
        <View style={styles.container}>
            <Icon onPress={() => navigation.navigate('Favorites')} style={styles.icon} name="star-outline" size={50} color="white" />
            <Animated.View style={iconStyle}>
                <Icon 
                    onPress={startSearch} 
                    style={[styles.icon, iconLoading ? styles.searchIcon : ""]} 
                    name="at-outline" 
                    size={50} 
                    color="white" 
                />
            </Animated.View>
            <Icon onPress={() => navigation.navigate('Settings')} style={styles.icon} name="settings-outline" size={50} color="white" />
        </View>

        <Animated.View style={searchContainerStyle}>
        <Icon onPress={closeSearch} style={styles.closeIcon} name="close-outline" size={50} color="white" />
        <ScrollView>
            {nearbyUsers.map((foundUser, i) => (
                <View style={styles.foundUserCard} key={i}>
                    <Image 
                        source={foundUser.profilePicture ? { uri: `http://192.168.1.105:8080/user/${foundUser.alias}/profilePicture` } : profilePlaceholderImage}
                        style={{ width: 100, height: 100 }}
                    />
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 27 }}>@{foundUser.alias}</Text>
                        <Text style={{ color: "black", fontWeight: "400", fontSize: 27 }}>{foundUser.name}</Text>
                    </View>
                    <View>
                        <Button 
                            title="Add User"
                            onPress={() => handleAddUser(foundUser)}
                        />
                    </View>
                </View>
                
            ))}
        </ScrollView>
        </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "black",
        position: "absolute",
        bottom: 0,
        padding: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    invisible: {
        display: "none"
    },
    searchContainer: {
        display: "flex",
        backgroundColor: "black",
        width: "100%",
        height: "70%",
        position: "absolute",
        bottom: 0
    },
    closeIcon: {
        position: "absolute",
        right: 0,
        marginRight: "1.7%",
        marginTop: "1.7%",
        zIndex: 1,
    },
    searchIcon: {
        color: "green"
    },
    foundUserCard: {
        backgroundColor: "white",
        width: "100%",
        padding: "7%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 70,
        borderRadius: "10%"
    }

})



export default Navbar;