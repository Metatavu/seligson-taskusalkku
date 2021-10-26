import * as React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * Interface describing component properties
 */
interface Props {
  color: string;
}

/**
 * Component for error vector graphics
 *
 * @param props component properties
 */
const Error: React.FC<Props> = ({ color }) => (
  <Svg
    width={ 200 }
    height={ 200 }
    viewBox="0 0 200 200"
  >
    <Path
      d="M99.9998 16.6665C53.9998 16.6665 16.6665 53.9998 16.6665 99.9998C16.6665 146 53.9998 183.333 99.9998 183.333C146 183.333 183.333 146 183.333 99.9998C183.333 53.9998 146 16.6665 99.9998 16.6665ZM33.3332 99.9998C33.3332 63.1665 63.1665 33.3332 99.9998 33.3332C115.417 33.3332 129.583 38.5832 140.833 47.4165L47.4165 140.833C38.5832 129.583 33.3332 115.417 33.3332 99.9998ZM99.9998 166.667C84.5832 166.667 70.4165 161.417 59.1665 152.583L152.583 59.1665C161.417 70.4165 166.667 84.5832 166.667 99.9998C166.667 136.833 136.833 166.667 99.9998 166.667Z"
      fill={ color }
    />
  </Svg>
);

export default Error;