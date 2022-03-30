import React, { DependencyList } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import type { RootState, AppDispatch } from "./store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { NavigationProp, ParamListBase, useFocusEffect, useNavigation } from "@react-navigation/native";
import strings from "../localization/strings";

/**
 * Custom hook for accessing dispatch function for Redux state
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook for accessing selector function for redux state
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Custom hook for creating saved timeout.
 * Resets timeout when called before callback execution.
 */
export const useTimeout = () => {
  const timer = React.useRef<NodeJS.Timeout>();

  /**
   * Clears current timer and sets a new one with given callback
   *
   * @param callback callback
   */
  const setTimer = (callback: (() => any) | undefined) => {
    timer.current && clearTimeout(timer.current);
    timer.current = callback ? setTimeout(callback, 1000) : undefined;
  };

  /**
   * Clears timer if one exists
   */
  const clearTimer = () => timer.current && clearTimeout(timer.current);

  return {
    setTimer: setTimer,
    clearTimer: clearTimer
  };
};

/**
 * Custom hook for running given callback function in intervals
 *
 * @param callback callback function
 * @param delay delay as milliseconds
 * @returns function that clears interval when called
 */
export const useInterval = (callback: () => any, delay: number) => {
  const savedCallback = React.useRef<typeof callback>();
  const stopInterval = React.useRef<() => void>();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    const timeout = setInterval(() => savedCallback.current && savedCallback.current(), delay);

    stopInterval.current = () => clearInterval(timeout);

    return () => {
      clearInterval(timeout);
      stopInterval.current = undefined;
    };
  }, [ delay ]);

  return stopInterval.current;
};

/**
 * Custom hook for calculating delayed component mount changes
 *
 * @param isMounted proposed mounted state
 * @param delayTime delay to change actual mount state when proposed mount state has been changed
 * @returns true if component should be rendered, otherwise false
 */
export const useDelayUnmount = (isMounted: boolean, delayTime: number) => {
  const [ shouldRender, setShouldRender ] = React.useState(false);

  React.useEffect(() => {
    let delay: NodeJS.Timeout;

    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      delay = setTimeout(() => setShouldRender(false), delayTime);
    }

    return () => clearTimeout(delay);
  }, [ isMounted, delayTime, shouldRender ]);

  return shouldRender;
};

/**
 * React hook that enables handling all device back button events and back gestures
 *
 * @param onGoBackCallback event handler callback
 * @param dependencies hook dependencies
 */
export const useGoBackHandler = <ParamList extends ParamListBase, RouteName extends keyof ParamList & string>(
  onGoBackCallback: (navigation: NavigationProp<ParamList, RouteName>) => boolean | null | undefined,
  dependencies?: DependencyList
) => {
  const navigation = useNavigation<NavigationProp<ParamList, RouteName>>();

  useFocusEffect(
    React.useCallback(() => {
      const hardwareBackPressSubscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => onGoBackCallback(navigation)
      );

      return hardwareBackPressSubscription.remove;
    }, [ navigation, onGoBackCallback, dependencies ])
  );
};

/**
 * Check whether previous screen exists in navigation stack
 *
 * @param navigation navigation
 */
export const previousScreenExists = (navigation: NavigationProp<ParamListBase>): boolean => {
  if (navigation.canGoBack()) {
    return true;
  }

  const parentNavigation = navigation.getParent();

  return !!parentNavigation && previousScreenExists(parentNavigation);
};

/**
 * React hook that dispatches navigation.goBack if possible when hardware back button is pressed
 */
export const useHardwareGoBack = () => useGoBackHandler(navigation => {
  if (!previousScreenExists(navigation)) {
    return false;
  }

  navigation.goBack();
  return true;
});

/**
 * React hook that handles exiting the app when hardware back button is pressed
 */
export const useExitAppHandler = () => {
  const [ exitingTimeout, setExitingTimeout ] = React.useState<NodeJS.Timeout>();
  const [ exiting, setExiting ] = React.useState(false);

  React.useEffect(() => {
    const exitListener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (exitingTimeout) {
        clearTimeout(exitingTimeout);
        setExitingTimeout(undefined);
      }

      if (exiting) {
        setExiting(false);
        BackHandler.exitApp();
      } else {
        setExiting(true);
        setExitingTimeout(setTimeout(() => setExiting(false), 2000));
        ToastAndroid.show(strings.generic.pressAgainToExit, ToastAndroid.SHORT);
      }

      return true;
    });

    return () => exitListener.remove();
  });
};