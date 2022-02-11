import React from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../../styles/screens/publications/publications-list";
import { Publication } from "../../../types";
import PublicationsNavigator from "../../../types/navigators/publications";
import { Divider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import GenericUtils from "../../../utils/generic";
import { unescape } from "html-escaper";
import DateUtils from "../../../utils/date-utils";
import PublicationsListNavigator from "../../../types/navigators/publications-list";

/**
 * Component properties
 */
interface Props {
  route: keyof PublicationsListNavigator.Routes;
  publications: Publication[];
}

/**
 * Publications list component
 *
 * @param props component properties
 */
const PublicationsList: React.FC<Props> = ({ route, publications }) => {
  const navigation = useNavigation<PublicationsNavigator.NavigationProps>();

  /**
   * Renders publication
   *
   * @param publication publication
   */
  const renderPublication = (publication: Publication) => {
    const { id, date, title, author } = publication;

    return (
      <View
        key={ id.toString() }
        style={ styles.publicationCard }
      >
        <Pressable
          onPress={ () =>
            navigation.navigate("publicationDetails", {
              publicationId: publication.id,
              subject: route
            })
          }
          key={ publication.id }
          style={ ({ pressed }) => [
            styles.publicationTouchable,
            { opacity: pressed ? 0.25 : 1 }
          ]}
        >
          <View style={{ width: "25%" }}>
            <Image
              source={{ uri: "https://cdn.metatavu.io/assets/seligson/blog_logo.png" }}
              style={{ width: 80, height: 80 }}
              height={ 80 }
              width={ 80 }
              resizeMode="contain"
            />
          </View>
          <View style={{ width: "50%" }}>
            <Text style={ styles.author }>
              { GenericUtils.getPublicationAuthor(author) }
            </Text>
            <Divider style={ styles.divider }/>
            <Text>
              { unescape(title) }
            </Text>
          </View>
          <View style={{ width: "25%" }}>
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="calendar-range"
                size={ styles.dateIcon.fontSize }
                color={ styles.dateIcon.color }
              />
              <Text style={ styles.date }>
                { DateUtils.formatToFinnishDate(date) }
              </Text>
            </View>
          </View>
        </Pressable>
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
      <FlatList
        data={ publications }
        renderItem={ ({ item }) => renderPublication(item) }
        keyExtractor={ item => item.id.toString() }
        contentContainerStyle={ styles.listContainer }
        style={ styles.cardShadow }
      />
    </LinearGradient>
  );
};

export default PublicationsList;