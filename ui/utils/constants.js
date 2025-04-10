import SBI from "../../assets/cards/vertical/sbi.svg";
// import IDFC from "../../assets/cards/vertical/idfc.svg";
// import IDFC from "../../assets/cards/vertical/idfc.png";
// import ICICI from "../../assets/cards/vertical/icici.svg";
import HDFC from "../../assets/cards/vertical/hdfc.svg";
import AMEXPLAT from "../../assets/cards/vertical/amex-plat.svg";
import AMEXGOLD from "../../assets/cards/vertical/amex-gold.svg";
import AmexPlatIdentifier from "../../assets/logos/amex-plat.svg"
import AmexGoldIdentifier from "../../assets/logos/amex-gold.svg"
import hdfcIdentifier from "../../assets/logos/hdfc.svg"
import iciciIdentifier from "../../assets/logos/icici.svg"
import idfcIdentifier from "../../assets/logos/idfc.svg"
import sbiIdentifier from "../../assets/logos/sbi.svg"


export const cardEnums = {
    AMEX_PLATINUM: 'american_express_platinum',
    AMEX_GOLD: 'american_express_gold',
    HDFC: 'hdfc',
    ICICI: 'icici',
    IDFC: 'idfc',
    SBI: 'sbi'
}

export const bankTypes = {
    'american_express_platinum': {
        card: AMEXPLAT,
        identifier: AmexPlatIdentifier,
        filledIdentifier: require("../../assets/logos/filled/amex.png")
    },
    'american_express_gold': {
        card: AMEXGOLD,
        identifier: AmexGoldIdentifier,
        filledIdentifier: require("../../assets/logos/filled/amex.png")
    },
    'hdfc': {
        card: HDFC,
        identifier: hdfcIdentifier,
        filledIdentifier: require("../../assets/logos/filled/hdfc.png")
    },
    'icici': {
        card: require("../../assets/cards/vertical/icici.png"),
        identifier: iciciIdentifier,
        filledIdentifier: require("../../assets/logos/filled/icici.png")
    },
    'idfc': {
        card: require("../../assets/cards/vertical/idfc.png"),
        identifier: idfcIdentifier,
        filledIdentifier: require("../../assets/logos/filled/idfc.png")
    },
    'sbi': {
        card: SBI,
        identifier: sbiIdentifier,
        filledIdentifier: require("../../assets/logos/filled/sbi.png")
    }
}