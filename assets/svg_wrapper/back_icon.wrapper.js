import React from "react";
import { TouchableOpacity } from "react-native";
import { Svg, Path } from "react-native-svg";

const BackIcon = ({ height = 50, width = 50, fill = "#E53828", onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg
        width={`${width}`}
        height={`${height}`}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path fill={fill} d="M32 256a224 224 0 1 1 448 0A224 224 0 1 1 32 256zm480 0A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM228.7 148.7l-96 96c-6.2 6.2-6.2 16.4 0 22.6l96 96c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L182.6 272 368 272c8.8 0 16-7.2 16-16s-7.2-16-16-16l-185.4 0 68.7-68.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0z"/>
      </Svg>
    </TouchableOpacity>
  );
};

export default BackIcon;
