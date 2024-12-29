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
        backgroundColor: 'grey',
        //alignItems: 'center',
        //justifyContent: 'flex-end',
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
        fontSize: 16,
    },
    textNormalBold: {
        fontFamily: fonts.bold,
        fontSize: 20,
    },
    logo: {
        fontFamily: fonts.bold,
        fontSize: 40,
        color: 'white',
    },
    navigationText: {
        fontFamily: fonts.regular,
        fontSize: 16,
        lineHeight: 25,
        letterSpacing: 0.5,
        color: 'white',
    }
     
});