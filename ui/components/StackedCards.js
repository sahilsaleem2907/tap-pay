import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, ImageBackground, Image, TouchableOpacity } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    Extrapolate,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Visa from "../../assets/payment/Visa.svg";
import DinerClub from "../../assets/payment/DinersClub.svg";
import Amex from "../../assets/payment/Amex.svg";
import Mastercard from "../../assets/payment/Mastercard.svg";
import ButtonBackground from "../../assets/background_button.svg";
import StyledText from "../typography/StyledText";
import { BlurView } from "@react-native-community/blur";
import { DiamondGradient } from "./DiamondGradient";
import ShimmeringText from "./ShimmeringText";
import { SvgFromXml } from "react-native-svg";



const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const CARD_WIDTH = width * 0.6;
const SCALE_FACTOR = 0.06;
const TAP_ANIMATION_DISTANCE = 50;

export const StackedCards = ({ items }) => {
    const [tapped, setTapped] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [blurIntensity, setBlurIntensity] = useState(0);
    const [cardsIsAnimating, setCardsIsAnimating] = useState(false);


    const tapProgress = useSharedValue(0);
    const tapCardProgress = useSharedValue(0);
    const paymentsOpacity = useSharedValue(1);


    const totalCards = items.length;

    const handleTap = () => {

        setTapped((prev) => !prev);
        tapProgress.value = withTiming(tapped ? 0 : 1, { duration: 800 });
        // Animate payment icons
        paymentsOpacity.value = withTiming(tapped ? 1 : 0, { duration: 400 });

    };

    const handleCardTap = (index) => {
        if (tapped) {
            if (selectedCard === index) {
                // Same card tapped again - animate back to original state
                console.log("Resetting selected card");
                tapCardProgress.value = withTiming(0, { duration: 1200 }, () => {
                    runOnJS(setSelectedCard)(null);
                    runOnJS(setBlurIntensity)(0);
                    runOnJS(setCardsIsAnimating)(false)
                });
            } else {
                if (!cardsIsAnimating) {
                    // New card tapped - animate to flipped state
                    console.log("Selecting card:", index);
                    runOnJS(setBlurIntensity)(50);
                    // If there was a previously selected card, reset it first
                    if (selectedCard !== null) {
                        tapCardProgress.value = withTiming(0, { duration: 1200 }, () => {
                            runOnJS(setCardsIsAnimating)(true)
                            runOnJS(setSelectedCard)(index);
                            tapCardProgress.value = withTiming(1, { duration: 1200 });
                        });
                    } else {
                        // No previously selected card, just animate this one
                        setSelectedCard(index);
                        tapCardProgress.value = withTiming(1, { duration: 1200 }, () => {
                            runOnJS(setCardsIsAnimating)(true)
                        });
                    }
                }
            }
        }
    };

    const smallContainerTap = Gesture.Tap().onEnd(() => {
        runOnJS(handleTap)();
    });

    const largeContainerTap = Gesture.Tap().onEnd(() => {
        runOnJS(handleTap)();
    });


    const smallContainerStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(
            tapProgress.value,
            [0, 1],
            [0, -15],
            Extrapolate.CLAMP
        );

        const opacity = interpolate(
            tapProgress.value,
            [0, 1],
            [1, 0], // Reduce opacity on tap
            Extrapolate.CLAMP
        );

        const translateY = interpolate(
            tapProgress.value,
            [0, 1],
            [0, 450],
            Extrapolate.CLAMP
        );


        return {
            transform: [{ rotateY: `${rotateY}deg` }, { translateY }],
            // opacity,
            zIndex: -99
        };
    });

    const largeContainerStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(
            tapProgress.value,
            [0, 1],
            [0, -15], // Rotate inward on tap
            Extrapolate.CLAMP
        );

        const opacity = interpolate(
            tapProgress.value,
            [0, 1],
            [1, 0], // Reduce opacity on tap
            Extrapolate.CLAMP
        );

        const translateY = interpolate(
            tapProgress.value,
            [0, 1],
            [0, 450],
            Extrapolate.CLAMP
        );

        return {
            transform: [{ rotateY: `${rotateY}deg` }, { translateY }],
            // opacity,
            zIndex: 99
        };
    });

    const paymentsAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: paymentsOpacity.value,
        };
    });

    return (
        <GestureHandlerRootView style={styles.rootContainer}>
            <Animated.View style={[styles.titleContainer, paymentsAnimatedStyle]}>
                <StyledText variant="semi" style={styles.semiText}>
                    Total Outstanding
                </StyledText>
                <ShimmeringText
                    text="₹ 88, 279.47"
                    style={styles.totalAmountText}
                    baseColor="#565656"
                    highlightColor="#ffffff"
                    duration={3000}
                />
                {/* <StyledText variant="bold" style={styles.totalAmountText}>
                    ₹ 88, 279.47
                </StyledText> */}
            </Animated.View>
            {/* <TouchableWithoutFeedback onPress={handleTap}> */}
            <View style={styles.outerContainer}>
                {/* Small Container - Tappable */}
                <GestureDetector gesture={smallContainerTap}>
                    <Animated.View style={[styles.smallContainer, smallContainerStyle]}>
                        <Image
                            source={require("../../assets/purse_back.png")}
                            style={styles.backgroundImage}
                            resizeMode="stretch"
                        />
                    </Animated.View>
                </GestureDetector>
                <View style={[styles.container, { height: CARD_HEIGHT + (totalCards - 1) * 20 }]}>

                    {items.map((card, index) => {
                        // console.log("index ", index)
                        const animatedStyle = useAnimatedStyle(() => {
                            const stackTranslateY = interpolate(
                                tapProgress.value,
                                [0, 1],
                                [-TAP_ANIMATION_DISTANCE * 0.4 * (index), -TAP_ANIMATION_DISTANCE * (index)],
                                Extrapolate.CLAMP
                            );

                            const scale = interpolate(
                                tapProgress.value,
                                [0, 1],
                                [1 - index * SCALE_FACTOR, 1 - (index + 1) * SCALE_FACTOR],
                                Extrapolate.CLAMP
                            );

                            const rotateX = interpolate(
                                tapProgress.value,
                                [0, 1],
                                [0, -10], // Adjusted for outward protruding effect
                                Extrapolate.CLAMP
                            );

                            return {
                                transform: [
                                    { translateY: stackTranslateY },
                                    { scale },
                                    { rotateX: `${rotateX}deg` },
                                    { perspective: 1000 }
                                ],
                                zIndex: (totalCards - index),
                            };
                        });

                        const cardStyle = (index) => useAnimatedStyle(() => {
                            if (selectedCard === index) {
                                const rotateY = interpolate(
                                    tapCardProgress.value,
                                    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // More granular steps
                                    [0, 45, 80, 120, 160, 180, 200, 240, 280, 320, 360], // More fluid rotation steps
                                    Extrapolate.CLAMP
                                );

                                const rotateZ = interpolate(
                                    tapCardProgress.value,
                                    [0, 1],
                                    [0, 90],
                                    Extrapolate.CLAMP
                                );
                                const scale = interpolate(
                                    tapCardProgress.value,
                                    [0, 1],
                                    [1 - (index + 1) * SCALE_FACTOR, 1.05],
                                    Extrapolate.CLAMP
                                );
                                const stackTranslateY = interpolate(
                                    tapCardProgress.value,
                                    [0, 1],
                                    [-TAP_ANIMATION_DISTANCE * (index), -TAP_ANIMATION_DISTANCE * (index)],
                                    Extrapolate.CLAMP
                                );
                                const rotateX = interpolate(
                                    tapCardProgress.value,
                                    [0, 1],
                                    [-10, 0], // Adjusted for outward protruding effect
                                    Extrapolate.CLAMP
                                );
                                return {
                                    transform: [
                                        { translateY: stackTranslateY },
                                        { rotateY: `${rotateY}deg` },
                                        { rotateX: `${rotateX}deg` },
                                        { rotateZ: `${rotateZ}deg` },
                                        { scale: scale },
                                        { perspective: 1000 }
                                    ],
                                    zIndex: interpolate(
                                        tapCardProgress.value,
                                        [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],  // Finer input steps
                                        [(totalCards - index), 70, 80, 90, 50, 60, 70, 75, 80, 85, 90, 99],  // Jumps to 20 early
                                        Extrapolate.CLAMP
                                    )

                                };
                            }
                            return {};
                        });

                        const tapGesture = Gesture.Tap()
                            .onEnd(() => {
                                runOnJS(handleCardTap)(index);
                            });

                        return (
                            <GestureDetector key={card.id} gesture={tapGesture}>
                                <Animated.View style={[styles.card, animatedStyle, cardStyle(index)]} >
                                    {/* <Text style={styles.content}>{card.content}</Text> */}
                                    {/* <View> */}
                                    {/* <Text style={styles.name}>{card.name}</Text>
                                        <Text style={styles.designation}>{card.designation}</Text> */}
                                    {/* </View> */}
                                    {card &&
                                        <View style={styles.card}>
                                            < card.template width={CARD_WIDTH} height={CARD_HEIGHT} style={{ pointerEvents: "none" }} />
                                        </View>}
                                </Animated.View>
                            </GestureDetector>
                        );
                    })}
                    {/* <BlurView
                        // style={styles.absolute}
                        blurType="dark"
                        blurAmount={10}
                    /> */}
                </View>
                {/* Large Container - Tappable */}
                <GestureDetector gesture={largeContainerTap}>
                    <Animated.View style={[styles.largeContainer, largeContainerStyle]}>
                        <ImageBackground
                            source={require("../../assets/purse_front.png")}
                            style={styles.backgroundImage}
                            resizeMode="stretch"
                        />
                    </Animated.View>

                </GestureDetector>



            </View>

            <TouchableOpacity
                onPress={() => console.log('Button pressed!')}
            >
                <Animated.View style={[styles.addButton, paymentsAnimatedStyle]}>
                    {/* <DiamondGradient> */}
                    <ButtonBackground width={75} height={75} />
                    {/* </DiamondGradient> */}
                </Animated.View>
            </TouchableOpacity>

            {/* </TouchableWithoutFeedback> */}
            <Animated.View style={[styles.paymentsContainer, paymentsAnimatedStyle]}>
                <StyledText variant="semi" style={styles.semiText}>
                    Your wallet includes
                </StyledText>
                <View style={[styles.paymentBadges]}>
                    <Visa width={50} height={50} />
                    <DinerClub width={50} height={50} />
                    <Amex width={50} height={50} />
                    <Mastercard width={50} height={50} />
                </View>
            </Animated.View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    totalAmountText: {
        fontWeight: 'bold',
        fontSize: 64
    },
    semiText: {
        fontWeight: '700'
    },
    titleContainer: {
        alignItems: 'center',
        top: 100
    },
    outerContainer: {
        alignItems: 'center',
    },
    paymentsContainer: {
        alignItems: 'center',
        gap: 10,
        flexDirection: 'column',
        fontWeight: '900',
        bottom: 50
    },
    paymentBadges: {
        // flex: 2,
        flexDirection: 'row',
        width: 'auto',
        gap: 20,
        alignContent: 'center',
        justifyContent: 'space-between'
    },
    smallContainer: {
        width: CARD_WIDTH + 15,
        height: CARD_HEIGHT,
        shadowOpacity: 1,
        borderRadius: 10,
        top: 210,
        overflow: "hidden",
    },
    largeContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT * 0.87,
        shadowOpacity: 1,
        borderRadius: 10,
        bottom: 100,
        // overflow: "hidden",
    },
    container: {
        position: "absolute",
        width: CARD_WIDTH,
        alignSelf: "center",
        justifyContent: "center",
        bottom: 125,
    },
    card: {
        position: "absolute",
        // width: "100%",
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        // backgroundColor: "#fff",
        // borderRadius: 20,
        // padding: 10,
        // shadowColor: "#000",
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 5,
        // justifyContent: "space-between",
    },
    content: {
        fontSize: 16,
        color: "#333",
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#444",
    },
    designation: {
        fontSize: 12,
        color: "#666",
    },
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    addButton: {
        position: 'absolute',
        bottom: 200,
        left: -35,
    },
});
