import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, Image, Button, TouchableOpacity } from "react-native";
import { View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import profilePlaceholderImage from '../assets/profilePlaceholder.png';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

const FavoriteScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState({});
    const [openCards, setOpenCards] = useState({});
    const navigation = useNavigation();
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
            fetch("http://172.20.10.3:8080/user/profile", {
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

    useEffect(() => {
        const fetchFavorites = async (id) => {
            const storedUsers = await fetch(`http://172.20.10.3:8080/user/${id}/favorites`)
            .then((res) => res.json())

            setFavorites(storedUsers);
        }
        if (user && user.id) {
            fetchFavorites(user.id)
        }

    })

    const navigateBack = () => {
        navigation.goBack();
    }

    const handleDelete = (alias) => {
        fetch(`http://172.20.10.3:8080/user/delete/favorite`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                favoriteAlias: alias,
                userAlias: user.alias
            })
        })
        .then((res) => {
            if (res.ok) {
                alert("User removed from favorites");
            }
        })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ zIndex: 1 }} onPress={navigateBack}>
                <Icon style={styles.backIcon} name="chevron-back-outline" size={20} color="#4F8EF7" />
            </TouchableOpacity>
            <View style={{ marginTop: 140 }}>
                {favorites.length > 0 ? (  
                <ScrollView
                    style={styles.addContainer} 
                    showsVerticalScrollIndicator={false}
                >
                    {favorites.map((user, index) => (
                        <View key={index} style={styles.cardContainer}>
                            <View style={[styles.profileCardFriend, styles.scrollCard]}>
                                <View style={styles.friendImageContainer}>
                                <Image
                                    source={user.profilePicture ? { uri: `http://172.20.10.3:8080/user/${user.alias}/profilePicture` } : profilePlaceholderImage}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode='cover'
                                />
                                </View>
                                <View style={[styles.infoContainer, styles.friendNameContainer]}>
                                <Text style={styles.infoText}>
                                    {user.name ? user.name : "loading..."}
                                </Text>
                                </View>
                                <View style={styles.infoContainer}>
                                    <Icon onPress={() => handleDelete(user.alias)} style={styles.icon} name="star-half-outline" size={30} color="black" />
                                </View>
                                <View style={styles.infoContainer}>
                                    <Button 
                                        title={openCards[user.id] ? "Close" : "Open"}
                                        onPress={() => handlePress(user.id)}
                                    />
                                </View>
                                <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>
                                    @{user.alias ? user.alias : "loading..."}
                                </Text>
                                </View>
                            </View>
                            <View style={styles.infoContainer}>
                                {openCards[user.id] ? (
                                <Text style={styles.infoText}>chat</Text>
                                ) : null}
                            </View>
                        </View>
                    ))}
                </ScrollView>
                ) : (
                    <Text style={{ color: "white", margin: "10%", fontSize: 30 }}>No Favorites :d</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#191970',
        flex: 1
    },
    infoContainer: {
        alignItems: "center",
        gap: 7
    },
    infoText: {
        fontWeight: 'bold',
    },
    addContainer: {
        width: '100%',
        marginTop: 20,
        paddingTop: 15
    },
    cardContainer: {
        alignItems: 'center',
        width: "100%",
        padding: 10,
        display: "flex",
        justifyContent: "space-between"
    },
    scrollCard: {
        transform: [{ translateY: -10 }, { scale: 0.95 }],
    },
    friendImageContainer: {
        width: 30,
        height: 30,
        borderRadius: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    profileCardFriend: {
        backgroundColor: "white",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 10
    },
    friendNameContainer: {
        paddingRight: 70
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


export default FavoriteScreen;