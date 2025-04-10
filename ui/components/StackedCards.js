import React, { useState } from "react";
import { Alert, Clipboard, Dimensions, Image, ImageBackground, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import ButtonBackground from "../../assets/background_button.svg";
import Amex from "../../assets/payment/Amex.svg";
import Chip from "../../assets/payment/chip.svg";
import DinerClub from "../../assets/payment/DinersClub.svg";
import Mastercard from "../../assets/payment/Mastercard.svg";
import Visa from "../../assets/payment/Visa.svg";
import StyledText from "../typography/StyledText";
import { numberSvgMap } from "../utils";
import { bankTypes, cardEnums } from "../utils/constants";
import ShimmeringText from "./ShimmeringText";



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
                // console.log("Resetting selected card");
                tapCardProgress.value = withTiming(0, { duration: 1200 }, () => {
                    runOnJS(setSelectedCard)(null);
                    runOnJS(setBlurIntensity)(0);
                    runOnJS(setCardsIsAnimating)(false)
                });
            } else {
                if (!cardsIsAnimating) {
                    // New card tapped - animate to flipped state
                    // console.log("Selecting card:", index);
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
                <View style={{
                    flexDirection: "row",
                    flexWrap: "norwrap",
                    gap: 12
                }}>
                    <StyledText variant="semi" style={{ ...styles.semiText, fontSize: 28 }}>
                        Welcome

                    </StyledText>
                    <ShimmeringText
                        text={`Sahil`}
                        style={styles.totalAmountText}
                        baseColor="#565656"
                        highlightColor="#ffffff"
                        duration={3000}
                    />
                </View>

                <StyledText variant="semi" style={{ ...styles.semiText }}>
                    Your banks include
                </StyledText>
                <View style={styles.bankBadges}>
                    {items.map((card, index) => {
                        const IdentifierComponent = bankTypes[card.type]?.filledIdentifier;

                        return IdentifierComponent ? (
                            <Image
                                key={index}
                                source={IdentifierComponent}
                                style={{ width: 100, height: 100 }}
                                resizeMode="contain"
                            />
                        ) : null;
                    })}
                </View>


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
                                {(() => {
                                    const isLongIcon = [cardEnums.HDFC, cardEnums.IDFC].includes(card.type);
                                    return <Animated.View style={[styles.card, animatedStyle, cardStyle(index)]} >
                                        {/* <Text style={styles.content}>{card.content}</Text> */}
                                        {/* <View> */}
                                        {/* <Text style={styles.name}>{card.name}</Text>
                                        <Text style={styles.designation}>{card.designation}</Text> */}
                                        {/* </View> */}
                                        {card && (
                                            <View style={styles.card}>
                                                {
                                                    (() => {
                                                        const CardComponent = bankTypes[card.type].card;
                                                        return [cardEnums.IDFC, cardEnums.ICICI].includes(card.type) ? <Image
                                                            source={CardComponent}
                                                            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                                                            resizeMode="contain"
                                                        /> : <CardComponent width={CARD_WIDTH} height={CARD_HEIGHT} style={{ pointerEvents: 'none' }} />;
                                                    })()
                                                }
                                            </View>
                                        )}

                                        {/* <Text style={styles.content}>{card.content}</Text> */}
                                        <View style={styles.numberContainer}>
                                            {card.content.split("").map((char, index) => {
                                                const SvgIcon = numberSvgMap[char];
                                                if (index > 0 && (index + 1) % 4 === 0) {
                                                    return (

                                                        <View key={index} style={{
                                                            flexDirection: "row",
                                                            flexWrap: "norwrap",
                                                        }}>
                                                            <SvgIcon key={index} width={13} height={13} color={card.colors[0]} />
                                                            <View key={`space-${index}`} style={{ width: 10 }} />
                                                        </View>
                                                    );
                                                }


                                                return SvgIcon ? <SvgIcon key={index} width={13} height={13} color={card.colors[0]} /> : null;
                                            })}
                                            {<TouchableOpacity
                                                style={{
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 4,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    borderRadius: 4,
                                                    marginTop: -5,
                                                    zIndex: 9999
                                                }}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    Clipboard.setString(card.content);
                                                    if (Platform.OS === 'android') {
                                                        ToastAndroid.show('Card number copied', ToastAndroid.SHORT);
                                                    } else {
                                                        Alert.alert('Copied', 'Card number copied to clipboard');
                                                    }
                                                }}
                                                onStartShouldSetResponder={() => true}
                                                onResponderTerminationRequest={() => false}
                                            >
                                                <Text style={{ color: card.colors[0], fontSize: 12 }}>Copy</Text>
                                            </TouchableOpacity>}
                                        </View>


                                        <StyledText style={{ ...styles.nameContainer, ...(card.colors.length > 0 && { color: card.colors[0] }), ...(isLongIcon && { top: 290 }) }}>{card.name}</StyledText>
                                        <StyledText style={{ ...styles.expiryContainer, ...(card.colors.length > 0 && { color: card.colors[0] }) }}>{card.exp_date}</StyledText>
                                        <StyledText style={{
                                            ...styles.cvvContainer,
                                            ...(card.cvv.length > 3 ? { top: 220, left: 200 } : { top: 225, left: 202 }),
                                            ...(card.colors.length > 0 && { color: card.colors[0] })
                                        }}>{card.cvv}</StyledText>
                                        <View style={styles.chipContainer}>
                                            <Chip width={35} height={50} color={card.colors[0]} />
                                        </View>


                                        <View style={{ ...styles.identifierContainer, ...(isLongIcon && { top: 40, left: -7 }) }}>
                                            {(() => {
                                                const IdentifierComponent = bankTypes[card.type]?.identifier;
                                                return IdentifierComponent ? (
                                                    <IdentifierComponent width={isLongIcon ? 90 : 35} height={50} />
                                                ) : null;
                                            })()}
                                        </View>



                                    </Animated.View>;
                                })()}

                            </GestureDetector>
                        );
                    })}

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
            {/* <Animated.View>
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={10}
                />
            </Animated.View> */}

            {
                items && items.length < 4 && <TouchableOpacity
                    onPress={() => console.log('Button pressed!')}
                >
                    <Animated.View style={[styles.addButton, paymentsAnimatedStyle]}>
                        {/* <DiamondGradient> */}
                        <ButtonBackground width={75} height={75} />
                        {/* </DiamondGradient> */}
                    </Animated.View>
                </TouchableOpacity>
            }


            {/* </TouchableWithoutFeedback> */}
            <Animated.View style={[styles.paymentsContainer, paymentsAnimatedStyle]}>
                <StyledText variant="semi" style={styles.semiText}>
                    Your wallet includes
                </StyledText>
                <View style={styles.paymentBadges}>
                    {items.some(card => card.gateway?.includes("visa")) && <Visa width={50} height={50} />}
                    {items.some(card => card.gateway?.includes("american_express")) && <Amex width={50} height={50} />}
                    {items.some(card => card.gateway?.includes("diners_club")) && <DinerClub width={50} height={50} />}
                    {items.some(card => card.gateway?.includes("mastercard")) && <Mastercard width={50} height={50} />}
                </View>
            </Animated.View>
        </GestureHandlerRootView >
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    absolute: {
        // position: "absolute",
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
        width,
        height
    },
    totalAmountText: {
        fontWeight: 'bold',
        fontSize: 28
    },
    semiText: {
        fontWeight: '700'
    },
    titleContainer: {
        alignItems: 'center',
        gap: 15,
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
    bankBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        padding: 0,
        margin: 0,
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
    numberContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
        color: "#333",
        position: 'absolute',
        top: 170,
        left: 0,
        transform: [{ rotate: '270deg' }],
    },
    nameContainer: {
        position: 'absolute',
        top: 280,
        left: 5,
        transform: [{ rotate: '270deg' }],
        fontWeight: 'semibold'
    },
    expiryContainer: {
        position: 'absolute',
        top: 296,
        left: 197,
        transform: [{ rotate: '270deg' }],
        fontWeight: 'bold'
    },
    cvvContainer: {
        position: 'absolute',
        transform: [{ rotate: '270deg' }],
        fontWeight: 'bold'
    },
    chipContainer: {
        position: 'absolute',
        top: 30,
        left: 70,
        fontWeight: 'bold',
        transform: [{ rotate: '270deg' }],
    },
    identifierContainer: {
        position: 'absolute',
        top: 30,
        left: 32,
        fontWeight: 'bold',
        transform: [{ rotate: '270deg' }],
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
