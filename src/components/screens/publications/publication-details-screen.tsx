import React from "react";
import { ActivityIndicator, View, Platform, Linking } from "react-native";
import { useRoute } from "@react-navigation/native";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/publications/publication-details";
import { PublicationDetails } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import theme from "../../../theme";
import PublicationsNavigator from "../../../types/navigators/publications";
import { PublicationsApiContext } from "../../providers/publications-api-provider";
import { LinearGradient } from "expo-linear-gradient";
import WebView from "react-native-webview";
import GenericUtils from "../../../utils/generic";
import Injectables from "../../../utils/injectables";
import BackButton from "../../generic/back-button";
import { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";

/**
 * Publication details screen component
 */
const PublicationDetailsScreen: React.FC = () => {
  const { params } = useRoute<PublicationsNavigator.RouteProps<"publicationDetails">>();
  const errorContext = React.useContext(ErrorContext);
  const publicationsApiContext = React.useContext(PublicationsApiContext);
  const publicationId = params?.publicationId;
  const subject = params?.subject;

  const [ loading, setLoading ] = React.useState(true);
  const [ publicationDetails, setPublicationDetails ] = React.useState<PublicationDetails>();

  const webViewRef = React.useRef<WebView>(null);

  /**
   * Loads publication details
   */
  const loadPublicationDetails = async () => {
    if (!publicationId) {
      return;
    }

    setLoading(true);
    setPublicationDetails(undefined);

    try {
      setPublicationDetails(await publicationsApiContext.findPublicationDetails(publicationId));
    } catch (error) {
      errorContext.setError(strings.errorHandling.fundHistory.list, error);
    }

    setLoading(false);
  };

  /**
   * Effect for loading publication details when selected publication changes
   */
  React.useEffect(() => { loadPublicationDetails(); }, [ publicationId ]);

  /**
   * Event handler for link press
   *
   * @param event should start load request
   */
  const onLinkPress = (event: ShouldStartLoadRequest) => {
    const { url } = event;

    if (url === "about:blank") {
      return true;
    }

    if (url.endsWith(".pdf") && Platform.OS === "android") {
      GenericUtils.openFileAndroid(url);
      return false;
    }

    Linking.openURL(event.url);
    return false;
  };

  /**
   * Renders content
   */
  const renderContent = () => {
    if (loading || !publicationDetails) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={ theme.colors.primary }/>
        </View>
      );
    }

    return (
      <View style={ styles.publicationCard }>
        <View style={{ height: "100%" }}>
          <WebView
            ref={ webViewRef }
            originWhitelist={[ "*" ]}
            source={{
              html: Injectables.getPublicationDetailsHtml(
                publicationDetails,
                strings.screenTitles[subject],
                theme
              )
            }}
            automaticallyAdjustContentInsets={ false }
            scalesPageToFit={ Platform.select({ android: false }) }
            scrollEnabled
            showsVerticalScrollIndicator
            onShouldStartLoadWithRequest={ onLinkPress }
          />
        </View>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <LinearGradient
      colors={[ "transparent", "rgba(0,0,0,0.1)" ]}
      style={{ flex: 1 }}
    >
      <BackButton/>
      { renderContent() }
    </LinearGradient>
  );
};

export default PublicationDetailsScreen;