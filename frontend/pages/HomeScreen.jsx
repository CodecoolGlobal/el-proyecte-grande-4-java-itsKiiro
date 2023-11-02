import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import profilePlaceholderImage from '../assets/profilePlaceholder.png';
import Navbar from '../components/Navbar';
import { Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [addedUsers, setAddedUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [openCards, setOpenCards] = useState({});
  const [token, setToken] = useState("");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        
        const fetchAddedUsers = async (id) => {
            const storedUsers = await fetch(`http://172.20.10.3:8080/user/${id}/addedUsers`)
            .then((res) => res.json())
    
            setAddedUsers(storedUsers);
        }
        if (user && user.id) {
            fetchAddedUsers(user.id)
        } else {
            return;
        }


    } catch (error) {
        console.error("Error while refreshing:", error);
    } finally {
        setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        setToken(JSON.parse(token))
      } else {
        return;
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchAddedUsers = async (id) => {
        const storedUsers = await fetch(`http://172.20.10.3:8080/user/${id}/addedUsers`)
        .then((res) => res.json())

        setAddedUsers(storedUsers);
    }
    if (user && user.id) {
        fetchAddedUsers(user.id)
    } else {
        return;
    }

  })

  const handlePress = (userId) => {
    setOpenCards(prevState => {
      return {...prevState, [userId]: !prevState[userId]};
    });
  };

  const addToFavorites = async (alias) => {
    await fetch(`http://172.20.10.3:8080/user/add/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ favoriteAlias: alias, userAlias: user.alias })
    }).then((res) => {
        if (res.ok) {
            alert("User added to Favorites")
        } else {
            alert("Error while adding User to Favorites")
        }
    })
  }

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
    } else {
        return;
    }
  }, [token])


  return (
    <View style={styles.container}>
        <View style={styles.profileCard}>
            <View style={styles.topCard}>
                <View style={styles.imageContainer}>
                    <Image
                        source={user.profilePicture ? { uri: `http://172.20.10.3:8080/user/${user.alias}/profilePicture` } : profilePlaceholderImage}
                        style={{ width: '100%', height: '100%' }}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Name:
                    </Text>
                    <Text style={styles.infoText}>
                        Alias:
                    </Text>
                    <Text style={styles.infoText}>
                        Birthdate:
                    </Text>
                    <Text style={styles.infoText}>
                        Email:
                    </Text>
                </View>

                <View style={styles.infoContainerInfo}>
                    <Text style={styles.infoText}>
                        {user ? user.name : 'Loading...'}
                    </Text>
                    <Text style={styles.infoText}>
                        @{user ? user.alias : 'Loading...'}
                    </Text>
                    <Text style={styles.infoText}>
                        {user ? user.birthdate : 'Loading...'}
                    </Text>
                    <Text style={styles.infoText}>
                        {user ? user.email : 'Loading...'}
                    </Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.statContainer}>
              <View>
                <Text style={{ fontSize: 24 }}>Friends</Text>
                <Text style={{ fontWeight: "bold" }}>{addedUsers.length}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 24 }}>Favorites</Text>
                <Text style={{ fontWeight: "bold" }}>0</Text>
              </View>
              <View>
                <Text style={{ fontSize: 24 }}>Msgs</Text>
                <Text style={{ fontWeight: "bold" }}>0</Text>
              </View>
            </View>
        </View>
      {addedUsers.length > 0 ? (
        <ScrollView 
            style={styles.addContainer} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />
            }
        >   
          {addedUsers.map((user, index) => (
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
                        <Icon onPress={() => addToFavorites(user.alias)} style={styles.icon} name="star-outline" size={30} color="black" />
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
      ) : <ScrollView 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />
            }
          >
          <Text style={{ color: "white", marginTop: "10%" }}>Add people to see other profile cards!</Text>
        </ScrollView> }

      { user && <Navbar user={user} /> }
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    width: '94%',
    height: '27%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#191970',
    alignItems: 'center',
    paddingTop: '17%',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
  },
  infoContainer: {
    alignItems: "flex-start",
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
  divider: {
    height: 2,  
    backgroundColor: 'black',
    width: '100%',
    marginVertical: 10, 
  },
  topCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
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
  statContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  infoContainerInfo: {
    alignItems: "flex-end",
    gap: 7
  },

  
});

export default HomeScreen;
