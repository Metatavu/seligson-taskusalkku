import { BlurView } from "expo-blur";
import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";
import styles from "../../styles/generic/basic-modal";

/**
 * Interface describing component properties
 */
interface Props {
  visible: boolean;
  fullScreen?: boolean;
  disableTouchableWithoutFeedback?: boolean;
  close?: () => void;
}

/**
 * Component for basic modal
 *
 * @param props component properties
 */
const BasicModal: React.FC<Props> = ({
  visible,
  fullScreen,
  close,
  disableTouchableWithoutFeedback,
  children
}) => {
  /**
   * Renders content
   */
  const renderContent = () => {
    if (fullScreen) {
      return children;
    }

    if (disableTouchableWithoutFeedback) {
      return (
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
    }

    return (
      <TouchableWithoutFeedback onPress={ close }>
        <BlurView
          intensity={ 60 }
          tint="dark"
          style={ styles.overlay }
        >
          <View style={ styles.content }>
            { children }
          </View>
        </BlurView>
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