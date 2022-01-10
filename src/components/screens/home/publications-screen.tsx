import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PublicationsNavigator from "../../../types/navigators/publications";
import PublicationsListScreen from "../publications/publications-list-screen";
import PublicationDetailsScreen from "../publications/publication-details-screen";

/**
 * Publications screen stack navigation
 */
const PublicationsNavigation = createNativeStackNavigator<PublicationsNavigator.Routes>();

/**
 * Publications screen component
 */
const PublicationsScreen: React.FC = () => {
  /**
   * Component render
   */
  return (
    <PublicationsNavigation.Navigator
      initialRouteName="publicationsList"
      screenOptions={{ headerShown: false }}
    >
      <PublicationsNavigation.Screen
        name="publicationsList"
        component={ PublicationsListScreen }
      />
      <PublicationsNavigation.Screen
        name="publicationDetails"
        component={ PublicationDetailsScreen }
      />
    </PublicationsNavigation.Navigator>
  );
};

export default PublicationsScreen;