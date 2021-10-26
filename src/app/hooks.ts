import React, { DependencyList } from "react";
import { BackHandler } from "react-native";
import type { RootState, AppDispatch } from "./store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ParamListBase, useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

/**
 * Custom hook for accessing dispatch function for Redux state
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook for accessing selector function for redux state
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

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
  onGoBackCallback: () => boolean | null | undefined,
  dependencies?: DependencyList
) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList, RouteName>>();

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", onGoBackCallback);
      navigation.addListener("beforeRemove", onGoBackCallback);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onGoBackCallback);
        navigation.removeListener("beforeRemove", onGoBackCallback);
      };
    }, [ navigation, onGoBackCallback, dependencies ])
  );
};