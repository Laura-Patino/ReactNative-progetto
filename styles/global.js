import { StyleSheet } from "react-native";

export const fonts = {
    italic: 'RedHatDisplay-Italic',
    light: 'RedHatDisplay-Light',
    regular: 'RedHatDisplay-Regular',
    bold: 'RedHatDisplay-Bold',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    textNormalItalic: {
        fontFamily: fonts.italic,
        fontSize: 20,
    },
    textNormalLight: {
        fontFamily: fonts.light,
        fontSize: 20,
    },
    textNormalRegular: {
        fontFamily: fonts.regular,
        fontSize: 20,
    },
    textNormalBold: {
        fontFamily: fonts.bold,
        fontSize: 20,
    },
     
});