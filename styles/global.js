import { StyleSheet } from "react-native";

export const fonts = {
    italic: 'RedHatDisplay-Italic',
    regular: 'RedHatDisplay-Regular',
    bold: 'RedHatDisplay-Bold',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#327432', //'#859F3D', //F6FCDF

        //alignItems: 'center',
        //justifyContent: 'flex-end',
    }, 
    divider: {
        borderTopColor: 'grey', 
        borderWidth:1, 
        marginHorizontal:5, 
        marginVertical:15
    }, 
    smallImage: {
        width: 110, 
        height: 110, 
        borderWidth:1, 
        borderColor: 'green', 
        alignSelf: 'center', 
        flex: 1
    },
    textSmallRegular: {
        fontFamily: fonts.regular,
        fontSize: 15,
    },
    textNormalItalic: {
        fontFamily: fonts.italic,
        fontSize: 16,
    },
    textNormalRegular: {
        fontFamily: fonts.regular,
        fontSize: 16,
    },
    textNormalBold: {
        fontFamily: fonts.bold,
        fontSize: 16,
        letterSpacing: 0.2
    },
    textBigRegular: {
        fontFamily: fonts.regular,
        fontSize: 23,
    },
    textBigBold: {
        fontFamily: fonts.bold,
        fontSize: 23,
        letterSpacing: 0.3,
    },
    sottotitolo: {
        fontFamily: fonts.bold,
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
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