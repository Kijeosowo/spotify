import React from "react";
import { StyleSheet, Platform } from "react-native";
import Navigation from "./StackNavigator";

export default function App() {
  return (
    <>
      <Navigation />
    </>
  );
}

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
});
