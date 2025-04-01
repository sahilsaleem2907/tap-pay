import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    Extrapolate,
    withSequence,
    withDelay,
} from "react-native-reanimated";

const ShimmeringText = ({
    text,
    style,
    baseColor = '#000000',
    highlightColor = '#4A86E8',
    duration = 2000
}) => {
    // Animation progress
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = 0;
        progress.value = withRepeat(
            withSequence(
                // Run the wave animation
                withTiming(1, {
                    duration: duration,
                    easing: Easing.linear
                }),
                // Pause at the end with delay
                withDelay(
                    1000,
                    withTiming(1, { duration: 0 }) // Instantly reset to 0 after delay
                )
            ),
            -1, // Infinite repeat
            false // Don't reverse
        );
    }, []);

    // Container for all characters
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {text.split('').map((char, index) => (
                <AnimatedChar
                    key={index}
                    char={char}
                    index={index}
                    style={style}
                    progress={progress}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                    totalChars={text.length}
                />
            ))}
        </View>
    );
};

// Separate component for each character to prevent re-renders
const AnimatedChar = ({
    char,
    index,
    style,
    progress,
    baseColor,
    highlightColor,
    totalChars
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        // Offset based on character position for wave effect
        const charOffset = totalChars - 1 - index / totalChars;

        // Position in the wave (0 to 1)
        const position = ((progress.value + charOffset) % 1);

        // Calculate intensity with a smoother wave pattern
        const intensity = interpolate(
            position,
            [0, 0.2, 0.5, 0.8, 1],
            [0, 0.5, 1, 0.5, 0],
            Extrapolate.CLAMP
        );

        // Converting hex to RGB for interpolation
        const r1 = parseInt(baseColor.slice(1, 3), 16);
        const g1 = parseInt(baseColor.slice(3, 5), 16);
        const b1 = parseInt(baseColor.slice(5, 7), 16);

        const r2 = parseInt(highlightColor.slice(1, 3), 16);
        const g2 = parseInt(highlightColor.slice(3, 5), 16);
        const b2 = parseInt(highlightColor.slice(5, 7), 16);

        // Interpolate between the colors
        const r = Math.round(r1 + (r2 - r1) * intensity);
        const g = Math.round(g1 + (g2 - g1) * intensity);
        const b = Math.round(b1 + (b2 - b1) * intensity);

        return {
            color: `rgb(${r}, ${g}, ${b})`,
        };
    });

    // Handle space character correctly
    const displayChar = char === ' ' ? '\u00A0' : char;

    return (
        <Animated.Text style={[style, animatedStyle]}>
            {displayChar}
        </Animated.Text>
    );
};

export default ShimmeringText;