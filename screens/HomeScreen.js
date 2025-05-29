import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState();
  const [recentlyplayed, setRecentlyPlayed] = useState([]);
  const [topArtist, setTopArtist] = useState([]);
  // Greeting time
  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    } else if (currentTime < 16) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const message = greetingMessage();

  // Fetch user profile from Spotify API
  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  console.log(userProfile);

  // Recently played songs
  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getRecentlyPlayedSongs();
  }, []);
  console.log(recentlyplayed);

  // Render Item
  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={{
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          flex: 1,
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: "#202020",
          borderRadius: 4,
          elevation: 3,
        }}>
        <Image
          style={{
            height: 55,
            width: 55,
            // borderRadius: 4,
          }}
          source={{ uri: item.track.album.images[0].url }}
        />
        <View
          style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
              maxWidth: "80%",
            }}>
            {item.track.name}
          </Text>
          <Text style={{ color: "#b3b3b3", fontSize: 13 }}>
            {item.track.artists[0].name}
          </Text>
        </View>
      </Pressable>
    );
  };

  // Fetch Top Artist
  useEffect(() => {
    const getTopItems = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        if (!accessToken) {
          console.log("No Access Token");
          return;
        }
        const type = "artist";
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/${type}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTopArtist(response.data.items);
      } catch (err) {
        console.log(err.message);
      }
    };

    getTopItems();
  }, []);
  console.log(topArtist);
  return (
    <LinearGradient colors={["#191414", "#191414"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 60, marginLeft: 10 }}>
        {/* <StatusBar barStyle="light-content" /> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {userProfile?.images?.length > 0 && (
              <Image
                style={{
                  height: 40,
                  width: 40,
                  resizeMode: "cover",
                  borderRadius: 20,
                }}
                source={{ uri: userProfile.images[0].url }}
              />
            )}
            <Text
              style={{
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 10,
                marginLeft: 10,
              }}>
              {message}, {userProfile?.display_name}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color="white"
          />
        </View>

        {/* Music and podcasts buttons */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginHorizontal: 0,
            marginVertical: 10,
          }}>
          <Pressable
            style={{
              backgroundColor: "#282828",
              padding: 10,
              borderRadius: 30,
            }}>
            <Text style={{ color: "white", fontSize: 15 }}>Music</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#282828",
              padding: 10,
              borderRadius: 30,
            }}>
            <Text style={{ color: "white", fontSize: 15 }}>
              Podcasts & Shows
            </Text>
          </Pressable>
        </View>

        {/* Music cards */}
        <View style={{ height: 10 }} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Pressable
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#202020",
              borderRadius: 4,
              elevation: 3,
            }}>
            <LinearGradient colors={["#33006F", "#FFFFFF"]}>
              <Pressable
                style={{
                  width: 55,
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <FontAwesome name="heart" size={24} color="white" />
              </Pressable>
            </LinearGradient>

            <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
              Liked Songs
            </Text>
          </Pressable>

          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#202020",
              borderRadius: 4,
              elevation: 3,
            }}>
            <Image
              style={{
                height: 55,
                width: 55,
              }}
              source={{ uri: "https://i.pravatar.cc/100" }}
            />
            <View style={styles.randomArtist}>
              <Text
                style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
                Hiphop Tamhiza
              </Text>
            </View>
          </View>
        </View>

        {/* Recently Played Songs */}
        <FlatList
          data={recentlyplayed}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // }
});
