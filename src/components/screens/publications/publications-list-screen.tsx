import React from "react";
import { PublicationsApiContext } from "../../providers/publications-api-provider";
import { Publication, PublicationType } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import strings from "../../../localization/strings";
import PublicationsListNavigator from "../../../types/navigators/publications-list";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import PublicationsList from "./publications-list";
import { View, ActivityIndicator } from "react-native";
import { useHardwareGoBack } from "../../../app/hooks";

const REVIEW_CATEGORY = "katsaus";

/**
 * Funds screen tab navigation
 */
const PublicationsListNavigation = createMaterialTopTabNavigator<PublicationsListNavigator.Routes>();

/**
 * Publications list screen component
 */
const PublicationsListScreen: React.FC = () => {
  useHardwareGoBack();
  const { colors } = useTheme();
  const publicationsApiContext = React.useContext(PublicationsApiContext);
  const errorContext = React.useContext(ErrorContext);

  const [ publications, setPublications ] = React.useState<Publication[]>([]);
  const [ loading, setLoading ] = React.useState(true);

  /**
   * Returns distributed publications for different tabs
   *
   * @param allPublications all publications
   */
  const distributePublications = (allPublications: Publication[]) => {
    const reviews: Publication[] = [];
    const topical: Publication[] = [];
    const questions: Publication[] = [];
    const phoebus: Publication[] = [];

    allPublications?.forEach(publication => {
      const subjectList = {
        [PublicationType.QUESTION]: questions,
        [PublicationType.PHOEBUS]: phoebus,
        [PublicationType.POST]: publication.category.toLowerCase() === REVIEW_CATEGORY ?
          reviews :
          topical
      }[publication.type];

      subjectList.push(publication);
    });

    return [ reviews, topical, questions, phoebus ];
  };

  const [ reviews, topical, questions, phoebus ] = distributePublications(publications);

  /**
   * Lists publications
   */
  const listPublications = async () => {
    setLoading(true);

    try {
      setPublications(await publicationsApiContext.listPublications());
    } catch (error) {
      errorContext.setError(strings.errorHandling.publications.list, error);
      setPublications([]);
    }

    setLoading(false);
  };
  /**
   * Effect for loading publications when component mounts
   */
  React.useEffect(() => { listPublications(); }, []);

  /**
   * Renders publications tab
   *
   * @param name name
   * @param publicationsList list of publications
   */
  const renderPublicationsTab = (
    name: keyof PublicationsListNavigator.Routes,
    publicationsList: Publication[]
  ) => (
    <PublicationsListNavigation.Screen
      name={ name }
      options={{ title: strings.screenTitles[name] }}
    >
      { () => <PublicationsList route={ name } publications={ publicationsList }/> }
    </PublicationsListNavigation.Screen>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ActivityIndicator
          size="large"
          color={ colors.primary }
        />
      </View>
    );
  }

  /**
   * Component render
   */
  return (
    <PublicationsListNavigation.Navigator
      initialRouteName="topical"
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: colors.surface,
        tabBarPressColor: colors.surface,
        tabBarStyle: {
          backgroundColor: colors.primary,
          elevation: 8,
          height: 60,
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5
        },
        tabBarIndicatorStyle: { backgroundColor: colors.surface },
        tabBarLabelStyle: {
          fontSize: 10,
          textTransform: "none",
          flexWrap: "nowrap",
          fontFamily: "NotoSans_400Regular"
        }
      }}
    >
      { renderPublicationsTab("topical", topical) }
      { renderPublicationsTab("reviews", reviews) }
      { renderPublicationsTab("questions", questions) }
      { renderPublicationsTab("phoebus", phoebus) }
    </PublicationsListNavigation.Navigator>
  );
};

export default PublicationsListScreen;