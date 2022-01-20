import React from "react";
import { useNavigation } from "@react-navigation/native";
import RootNavigator from "../../../types/navigators/root";
import Config from "../../../app/config";
import { Language } from "../../../types/config";
import { View } from "react-native";
import SeligsonLogo from "../../../../assets/seligson-logo";
import theme from "../../../theme";
import { Button, ProgressBar, Text } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/registration/language-selection-screen";
import RadioButtonOptionItem from "../../generic/radio-button-option-item";
import TranslationUtils from "../../../utils/translations";
import { useAppDispatch } from "../../../app/hooks";
import { setLanguage } from "../../../features/locale/locale-slice";

/**
 * Language selection screen component
 */
const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigator.NavigationProps>();
  const dispatch = useAppDispatch();

  const [ loading, setLoading ] = React.useState(true);
  const [ selectedLanguage, setSelectedLanguage ] = React.useState<Language>();

  /**
   * Checks if language is set
   */
  const checkLanguage = async () => {
    const language = await Config.getLocalValue("@language");
    if (language) {
      dispatch(setLanguage(language));
      navigation.replace("authentication", { screen: "welcome" });
      return;
    }

    setLoading(false);
  };

  /**
   * Effect for checking if user has set language
   */
  React.useEffect(() => { checkLanguage(); }, []);

  /**
   * Event handler for language change
   *
   * @param language selected language
   */
  const onLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    dispatch(setLanguage(language));
  };

  /**
   * Event handler for on proceed click
   */
  const onProceed = async () => {
    if (!selectedLanguage) {
      return;
    }

    await Config.setLocalValue("@language", selectedLanguage);
    navigation.replace("authentication", { screen: "welcome" });
  };

  /**
   * Renders language select
   */
  const renderLanguageSelect = () => {
    if (loading) {
      return (
        <View style={ styles.progressContainer }>
          <ProgressBar indeterminate color={ theme.colors.primary }/>
        </View>
      );
    }

    return (
      <View style={ styles.card }>
        <Text style={ styles.cardTitle }>
          { strings.settingsScreen.language }
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          {
            Object.values(Language).map(language => (
              <RadioButtonOptionItem
                key={ language }
                label={ TranslationUtils.getLanguageDisplayText(language) }
                checked={ selectedLanguage === language }
                value={ language }
                onPress={ () => onLanguageChange(language) }
              />
            ))
          }
        </View>
        <Button
          uppercase={ false }
          onPress={ onProceed }
        >
          { strings.generic.saveAndProceed }
        </Button>
      </View>
    );
  };

  /**
   * Component render
   */
  return (
    <View style={ styles.container }>
      <SeligsonLogo/>
      { renderLanguageSelect() }
    </View>
  );
};

export default LanguageSelectionScreen;