import React from "react";
import { useNavigation } from "@react-navigation/native";
import RootNavigator from "../../../types/navigators/root";
import Config from "../../../app/config";
import { Language } from "../../../types/config";
import { View, Text, ImageBackground } from "react-native";
import { SeligsonLogo } from "../../../../assets/seligson-logo";
import theme from "../../../theme";
import { Button, ProgressBar } from "react-native-paper";
import strings from "../../../localization/strings";
import styles from "../../../styles/screens/registration/language-selection-screen";
import RadioButtonOptionItem from "../../generic/radio-button-option-item";
import TranslationUtils from "../../../utils/translations";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectSelectedLanguage, setLanguage } from "../../../features/locale/locale-slice";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Language selection screen component
 */
const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigator.NavigationProps>();
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);

  const [ loading, setLoading ] = React.useState(true);

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
  const onLanguageChange = (language: Language) => dispatch(setLanguage(language));

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
      <>
        <View style={ styles.card }>
          <Text style={[ theme.fonts.medium, styles.cardTitle ]}>
            { strings.settingsScreen.language }
          </Text>
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
        <View style={ styles.buttonContainer }>
          <Button
            uppercase={ false }
            onPress={ onProceed }
            style={ styles.button }
          >
            <Text style={ styles.buttonText }>
              { strings.generic.saveAndProceed }
            </Text>
          </Button>
        </View>
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <ImageBackground
      style={ styles.container }
      // eslint-disable-next-line global-require
      source={ require("../../../../assets/background.png") }
      resizeMode="cover"
    >
      <LinearGradient
        colors={[ "rgba(0,0,0,0.2)", "rgba(0,0,0,0)" ]}
        style={{ ...styles.container, paddingHorizontal: theme.spacing(2) }}
      >
        <View style={ styles.logoContainer }>
          <LinearGradient
            colors={[ "rgba(255,255,255,0.2)", "rgba(255,255,255,0)" ]}
            style={ styles.circularGradient }
          >
            <View style={ styles.logo }>
              <SeligsonLogo/>
            </View>
          </LinearGradient>
        </View>
        { renderLanguageSelect() }
      </LinearGradient>
    </ImageBackground>
  );
};

export default LanguageSelectionScreen;