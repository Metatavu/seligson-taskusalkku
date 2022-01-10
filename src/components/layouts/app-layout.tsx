import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import styles from "../../styles/layouts/app-layout";

/**
 * Component properties
 */
interface Props {
  backgroundGradient?: string[];
}

/**
 * Application layout component
 *
 * @param props component properties
 */
const AppLayout: React.FC<Props> = ({ backgroundGradient, children }) => {
  if (!backgroundGradient) {
    return (
      <View style={ styles.solidBackground }>
        { children }
      </View>
    );
  }

  return (
    <LinearGradient
      colors={ backgroundGradient }
      style={ styles.gradientBackground }
    >
      { children }
    </LinearGradient>
  );
};

export default AppLayout;