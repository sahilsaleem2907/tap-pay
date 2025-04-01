const allFonts = {
    CUSTOM_LTR_FONT_REGULAR: "SFPRODISPLAYREGULAR",
    CUSTOM_LTR_FONT_MEDIUM: "SFPRODISPLAYMEDIUM",
    CUSTOM_LTR_FONT_BOLD: "SFPRODISPLAYBOLD",
    CUSTOM_LTR_FONT_SEMI: 'SFPRODISPLAYSEMIBOLDITALIC',
    CUSTOM_RTL_FONT_REGULAR: "SFPRODISPLAYLIGHTITALIC",
};

const fontMap = {
    ltr: {
        regular: allFonts.CUSTOM_LTR_FONT_REGULAR,
        semi: allFonts.CUSTOM_LTR_FONT_SEMI,
        medium: allFonts.CUSTOM_LTR_FONT_MEDIUM,
        bold: allFonts.CUSTOM_LTR_FONT_BOLD,
    },
    rtl: {
        regular: allFonts.CUSTOM_RTL_FONT_REGULAR,
        semi: allFonts.CUSTOM_RTL_FONT_REGULAR,
        medium: allFonts.CUSTOM_RTL_FONT_REGULAR,
        bold: allFonts.CUSTOM_RTL_FONT_REGULAR,
    },
};

export default fontMap;
