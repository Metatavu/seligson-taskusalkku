import React from "react";
import { ActivityIndicator, ScrollView, View, Text, Platform, Linking } from "react-native";
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
import { Title } from "react-native-paper";
import moment from "moment";
import GenericUtils from "../../../utils/generic";
import Injectables from "../../../utils/injectables";
import BackButton from "../../generic/back-button";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";

/**
 * Publication details screen component
 */
const PublicationDetailsScreen: React.FC = () => {
  const { params } = useRoute<PublicationsNavigator.RouteProps<"publicationDetails">>();
  const errorContext = React.useContext(ErrorContext);
  const publicationsApiContext = React.useContext(PublicationsApiContext);
  const publicationId = params?.publicationId;

  const [ loading, setLoading ] = React.useState(true);
  const [ publicationDetails, setPublicationDetails ] = React.useState<PublicationDetails>();
  const [ webviewHeight, setWebviewHeight ] = React.useState(1000);

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
   * Opens file in Android platform
   *
   * @param url download url
   */
  const openFileAndroid = async (url: string) => {
    const fileDir = `${FileSystem.cacheDirectory}/temp.pdf`;
    const file = await FileSystem.downloadAsync(url, fileDir);

    await FileSystem.getContentUriAsync(file.uri).then(cUri => {
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
        type: "application/pdf"
      });
    });
  };

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
      openFileAndroid(url);
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

    const { title, date, content } = publicationDetails;

    return (
      <ScrollView contentContainerStyle={ styles.publicationContainer }>
        <View style={ styles.publicationCard }>
          <Title style={ styles.title }>
            { title }
          </Title>
          <View style={ styles.publicationInfo }>
            <Text>
              { GenericUtils.getPublicationAuthor(publicationDetails) }
            </Text>
            <Text>
              { moment(date).format("DD.MM.YYYY") }
            </Text>
          </View>
          <WebView
            ref={ webViewRef }
            originWhitelist={[ "*" ]}
            source={{ html: Injectables.getPublicationDetailsHtml(content) }}
            automaticallyAdjustContentInsets={ false }
            scalesPageToFit={ Platform.select({ android: false }) }
            scrollEnabled={ false }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            style={{ height: webviewHeight }}
            onMessage={ event => setWebviewHeight(Number(event.nativeEvent.data)) }
            javaScriptEnabled
            injectedJavaScript={ Injectables.getPublicationsScript() }
            onShouldStartLoadWithRequest={ onLinkPress }
          />
        </View>
      </ScrollView>
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