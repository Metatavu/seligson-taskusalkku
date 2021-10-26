import React from "react";
import { Paragraph } from "react-native-paper";
import strings from "../../../localization/strings";
import AppLayout from "../../layouts/app-layout";

/**
 * Home screen
 */
const HomeScreen: React.FC = () => {
  return (
    <AppLayout>
      <Paragraph>
        { strings.generic.notImplemented }
      </Paragraph>
    </AppLayout>
  );
};

export default HomeScreen;