import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import styles from "../../styles/layouts/app-layout";

/**
 * Interface describing component properties
 */
interface Props {
  backgroundGradient?: string[];
}

/**
 * Component for application layout
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