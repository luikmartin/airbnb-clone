import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Page = () => {
  return (
    <View style={styles.inactive}>
      <Text>Background</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  inactive: {
    backgroundColor: "red",
  },
});
