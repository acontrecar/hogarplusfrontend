import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { globalStyles } from "../constants/styles";
import colors from "../constants/colors";

export default function Loader() {
  return (
    <View style={globalStyles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
