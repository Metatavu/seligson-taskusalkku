import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../../styles/screens/publications/publications-list";
import { Publication } from "../../../types";
import PublicationsNavigator from "../../../types/navigators/publications";
import { Avatar, Divider } from "react-native-paper";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import GenericUtils from "../../../utils/generic";

/**
 * Component properties
 */
interface Props {
  publications: Publication[];
}

/**
 * Publications list component
 *
 * @param props component properties
 */
const PublicationsList: React.FC<Props> = ({ publications }) => {
  const navigation = useNavigation<PublicationsNavigator.NavigationProps>();

  /**
   * Renders publication
   *
   * @param publication publication
   */
  const renderPublication = (publication: Publication) => {
    const { id, date, title } = publication;

    return (
      <View
        key={ id.toString() }
        style={ styles.publicationCard }
      >
        <Pressable
          onPress={ () => navigation.navigate("publicationDetails", { publicationId: publication.id }) }
          key={ publication.id }
          style={ ({ pressed }) => [
            styles.publicationTouchable,
            { backgroundColor: pressed ? "rgba(0,0,0,0.1)" : "transparent" }
          ]}
        >
          <View style={{ width: "25%" }}>
            <Avatar.Icon icon="account-outline" color="white"/>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={ styles.author }>
              { GenericUtils.getPublicationAuthor(publication) }
            </Text>
            <Divider style={ styles.divider }/>
            <Text>
              { title }
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
                { moment(date).format("DD.MM.YYYY") }
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