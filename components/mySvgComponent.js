import React from "react";
import { View, StyleSheet, TouchableNativeFeedback } from "react-native";
import ProfileIcon from "../assets/svg_wrapper/profile_icon.wrapper";
import CameraIcon from "../assets/svg_wrapper/camera_icon.wrapper";
import ContactsIcon from "../assets/svg_wrapper/contacts_icon.wrapper";
import BackIcon from "../assets/svg_wrapper/back_icon.wrapper";

const iconComponents = {
 ProfileIcon:<ProfileIcon/>,
 CameraIcon:<CameraIcon/>,
 ContactsIcon:<ContactsIcon/>,
 BackIcon:<BackIcon/>,
};


function getIconComponent(icon, color, size, containerFill) {
  const iconComponent = iconComponents[icon];
    if (iconComponent  ) {
    return React.cloneElement(iconComponent, {
      fill: color,
      size: size,
      height: size,
      width: size,
      color: color,
      containerFill: containerFill,
    });
  } else {
    return (
      <Icon
        name={icon}
        size={size}
        color={color}
        containerFill={containerFill}
      />
    ); 
  }
}

const MySvgComponent = ({
makePressable = true,
  containerFill = "white",
  iconSize = 40,
  iconName = "user",
  iconColor = 'black',
  style,
  handelIconClick = () => {},
}) => {
  return (
    <TouchableNativeFeedback
      onPress={handelIconClick}
      disabled={!makePressable}
    >
      <View
        style={[styles.container, style, { width: iconSize, height: iconSize }]}
      >
        {getIconComponent(iconName, iconColor, iconSize, containerFill)}
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MySvgComponent;
