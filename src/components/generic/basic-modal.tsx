import React from "react";
import { BlurView } from "expo-blur";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import styles from "../../styles/generic/basic-modal";

/**
 * Interface describing component properties
 */
interface Props {
  close?: () => void;
  disableTouchableWithoutFeedback?: boolean;
  fullScreen?: boolean;
  visible: boolean;
}

/**
 * Basic modal component
 *
 * @param props component properties
 */
const BasicModal: React.FC<Props> = ({
  children,
  close,
  disableTouchableWithoutFeedback,
  fullScreen,
  visible
}) => {
  /**
   * Renders content
   */
  const renderContent = () => {
    const content = (
      <BlurView
        intensity={ 60 }
        tint="dark"
        style={ styles.overlay }
      >
        <View style={ styles.content }>
          { children }
        </View>
      </BlurView>
    );

    if (fullScreen || disableTouchableWithoutFeedback) {
      return content;
    }

    return (
      <TouchableWithoutFeedback onPress={ close }>
        { content }
      </TouchableWithoutFeedback>
    );
  };

  /**
   * Component render
   */
  return (
    <Modal
      visible={ visible }
      animationType="fade"
      transparent={ !fullScreen }
      onRequestClose={ close }
    >
      { renderContent() }
    </Modal>
  );
};

export default BasicModal;