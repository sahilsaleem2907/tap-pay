import React from "react";
import { Text, StyleSheet } from "react-native";
import fontMap from "./index.js";

const StyledText = ({
    variant = "regular",
    language = "ltr",
    style,
    children,
    ...restProps
}) => {
    const fontFamily = fontMap[language][variant];

    return (
        <Text style={[{ fontFamily }, styles.defaultStyle, style]} {...restProps}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    defaultStyle: {
        color: '#fff'
    },
});

export default StyledText;
