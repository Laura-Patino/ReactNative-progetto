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
        borderColor: '#cfccc4', 
        borderTopWidth: 2, 
        marginHorizontal: 0, 
        marginVertical: 10
    }, 
    maxDivider: {
        borderColor: '#cfccc4', 
        borderTopWidth: 3, 
        marginHorizontal: 5, 
        marginVertical: 20
    },
    smallImage: {
        width: 120, 
        height: 120, 
        //borderWidth:1, 
        //borderColor: 'green', 
        //alignSelf: 'center', 
        //flex: 1
    },
    textSmallRegular: {
        fontFamily: fonts.regular,
        fontSize: 15,
    },
    textSmallBold: {
        fontFamily: fonts.bold,
        fontSize: 15,
    },
    textNormalItalic: {
        fontFamily: fonts.italic,
        fontSize: 17,
        color: 'brown',
        textAlign: 'center',
        paddingBottom: 5
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
        fontSize: 19,
        letterSpacing: 0.3,
    },
    textBigBold: {
        fontFamily: fonts.bold,
        fontSize: 22,
        letterSpacing: 0.3,
    },
    sottotitolo: {
        fontFamily: fonts.bold,
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        paddingBottom: 5
    },
    logo: {
        fontFamily: fonts.bold,
        fontSize: 35,
        color: 'white',
    },
    headerTitle: {
        fontFamily: fonts.bold,
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    navigationText: {
        fontFamily: fonts.regular,
        fontSize: 16,
        lineHeight: 25,
        letterSpacing: 0.5,
        color: 'white',
    }
     
});