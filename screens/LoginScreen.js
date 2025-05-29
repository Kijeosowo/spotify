import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, SafeAreaView, StatusBar, Text, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Use useFocusEffect instead of useEffect to avoid issues with navigation
  useFocusEffect(
    useCallback(() => {
      const checkTokenValidity = async () => {
        try {
          const accessToken = await AsyncStorage.getItem("token");
          const expirationDate = await AsyncStorage.getItem("expirationDate");

          console.log("access token", accessToken);
          console.log("expiration date", expirationDate);

          if (accessToken && expirationDate) {
            const currentTime = Date.now();
            const expirationTime = parseInt(expirationDate);

            if (currentTime < expirationTime) {
              // Token is valid, navigate to main screen
              console.log("Token is valid, navigating to Main");
              navigation.replace("Main");
              return;
            } else {
              // Token is expired, remove it
              console.log("Token expired, removing from storage");
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("expirationDate");
            }
          }
        } catch (error) {
          console.error("Error checking token validity:", error);
        } finally {
          setIsCheckingToken(false);
        }
      };

      checkTokenValidity();
    }, [navigation])
  );

  async function authenticate() {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "exp",
        path: "spotify-auth-callback",
      });

      console.log("Redirect URI:", redirectUri);

      const config = {
        clientId: "61a99dd64b5f4b8490435f963ec40652",
        scopes: [
          "user-read-email",
          "user-library-read",
          "user-read-recently-played",
          "user-top-read",
          "playlist-read-private",
          "playlist-read-collaborative",
          "playlist-modify-public",
        ],
        redirectUri: redirectUri,
        responseType: AuthSession.ResponseType.Code,
        additionalParameters: {},
        extraParams: {
          show_dialog: "true",
        },
      };

      const discovery = {
        authorizationEndpoint: "https://accounts.spotify.com/authorize",
        tokenEndpoint: "https://accounts.spotify.com/api/token",
      };

      const request = new AuthSession.AuthRequest(config);

      const result = await request.promptAsync(discovery);
      console.log("Auth result:", result);

      if (result.type === "success" && result.params.code) {
        // Exchange authorization code for access token
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: config.clientId,
            code: result.params.code,
            redirectUri: config.redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discovery
        );

        console.log("Token response:", tokenResponse);

        if (tokenResponse.accessToken) {
          const expirationDate = Date.now() + tokenResponse.expiresIn * 1000;

          // Store token and expiration
          await AsyncStorage.setItem("token", tokenResponse.accessToken);
          await AsyncStorage.setItem(
            "expirationDate",
            expirationDate.toString()
          );

          if (tokenResponse.refreshToken) {
            await AsyncStorage.setItem(
              "refreshToken",
              tokenResponse.refreshToken
            );
          }

          console.log("Token stored successfully, navigating to Main");

          // Add a small delay to ensure storage is complete
          setTimeout(() => {
            navigation.replace("Main");
          }, 100);
        }
      } else if (result.type === "error") {
        console.error("Authentication error:", result.error);
      } else {
        console.log("Authentication cancelled");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }

  // Show loading state while checking token
  if (isCheckingToken) {
    return (
      <LinearGradient colors={["#191414", "#191414"]} style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>Loading...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#191414", "#191414"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 100 }} />
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={80}
          color="white"
        />
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          }}>
          Millions of Songs. Free on Spotify
        </Text>
        <View style={{ height: 80 }} />

        <Pressable
          onPress={authenticate}
          style={{
            backgroundColor: "#1DB954",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
            flexDirection: "row",
            gap: 10,
          }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Sign In with Spotify
          </Text>
          <MaterialIcons name="phone-android" size={24} color="white" />
        </Pressable>

        {/* Continue with number */}
        <Pressable
          style={{
            backgroundColor: "#191414",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
          }}>
          <MaterialIcons name="phone-android" size={24} color="#C0C0C0" />
          <Text
            style={{
              color: "#C0C0C0",
              fontWeight: "500",
              textAlign: "center",
              flex: 1,
            }}>
            Continue with phone number
          </Text>
        </Pressable>

        {/* Continue with Google */}
        <Pressable
          style={{
            backgroundColor: "#191414",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
          }}>
          <AntDesign name="google" size={24} color="yellow" />
          <Text
            style={{
              color: "#C0C0C0",
              fontWeight: "500",
              textAlign: "center",
              flex: 1,
            }}>
            Continue with Google
          </Text>
        </Pressable>

        {/* Continue with Facebook */}
        <Pressable
          style={{
            backgroundColor: "#191414",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
          }}>
          <Entypo
            style={{ textAlign: "center" }}
            name="facebook-with-circle"
            size={24}
            color="blue"
          />
          <Text
            style={{
              color: "#C0C0C0",
              fontWeight: "500",
              textAlign: "center",
              flex: 1,
            }}>
            Sign up with Facebook
          </Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;