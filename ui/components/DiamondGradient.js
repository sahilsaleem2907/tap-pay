import LinearGradient from "react-native-linear-gradient";

export const DiamondGradient = ({ children }) => (
    <LinearGradient
        colors={['#020202', '#646464', '#FFFFFF']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0.1, 0.9]}
        style={{ borderRadius: 25 }}
    >
        {children}
    </LinearGradient>
);