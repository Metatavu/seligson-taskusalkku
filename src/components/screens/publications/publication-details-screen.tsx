import React from "react";
import { ActivityIndicator, ScrollView, View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/publications/publication-details";
import { PublicationDetails } from "../../../types";
import { ErrorContext } from "../../error-handler/error-handler";
import theme from "../../../theme";
import PublicationsNavigator from "../../../types/navigators/publications";
import { PublicationsApiContext } from "../../providers/publications-api-provider";
import { LinearGradient } from "expo-linear-gradient";
import WebView from "react-native-webview";
import { Title, Button } from "react-native-paper";
import moment from "moment";
import GenericUtils from "../../../utils/generic";

/**
 * Publication details screen component
 */
const PublicationDetailsScreen: React.FC = () => {
  const { params } = useRoute<PublicationsNavigator.RouteProps<"publicationDetails">>();
  const navigation = useNavigation<PublicationsNavigator.NavigationProps>();
  const errorContext = React.useContext(ErrorContext);
  const publicationsApiContext = React.useContext(PublicationsApiContext);
  const publicationId = params?.publicationId;

  const [ loading, setLoading ] = React.useState(true);
  const [ publicationDetails, setPublicationDetails ] = React.useState<PublicationDetails>();
  const [ webviewHeight, setWebviewHeight ] = React.useState(1000);

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
            originWhitelist={[ "*" ]}
            source={{ html: content }}
            automaticallyAdjustContentInsets={ false }
            scalesPageToFit={ false }
            scrollEnabled={ false }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            style={{ height: webviewHeight }}
            onMessage={ event => setWebviewHeight(Number(event.nativeEvent.data)) }
            javaScriptEnabled
            injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight);"
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
      <View style={ styles.buttonContainer }>
        <Button
          icon="arrow-left-circle"
          onPress={ navigation.goBack }
          labelStyle={{ color: "#fff" }}
          style={ styles.backButton }
        >
          <Text style={{ color: "#fff" }}>
            { strings.generic.back }
          </Text>
        </Button>
      </View>
      { renderContent() }
    </LinearGradient>
  );
};

export default PublicationDetailsScreen;