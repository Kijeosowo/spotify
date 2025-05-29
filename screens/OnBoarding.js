import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import React from 'react'
import { Video } from "expo-av";
// import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const OnBoarding = () => {
  const navigation = useNavigation();
    const videoRef = React.useRef(null);

    React.useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playAsync();
      }
    }, []);

    const started = () => {
      navigation.navigate("LoginScreen");
    };
  return (
      <View style={styles.container}>
           {/* <StatusBar
          backgroundColor="#040306"
          barStyle="light-content"
        />  */}
        <Video
          ref={videoRef}
          source={require("../Image/Spotify.mp4")}
          style={styles.backgroundVideo}
          resizeMode="cover"
          shouldPlay
          isLooping
            isMuted
          rate={1.0}
          volume={1.0}
        />

        <View style={styles.overlay}>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Welcome to Spotify</Text>
            <Text style={styles.subtitle}>
              Experience music like never before
            </Text>

            <TouchableOpacity style={styles.button} onPress={started}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View> 
  )
}

export default OnBoarding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    ...Platform.select({
      android: {
        paddingTop: 0,
      },
      ios: {
        paddingTop: 0,
      },
    }),
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: "100%",
    width: "100%",
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    zIndex: 2,
  },
  bodyContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#EFEFEF",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1DB954",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "light",
  },
});
