import { StyleSheet, Text, View } from 'react-native';
import { globalStyles, fonts } from '../../styles/global';
import { useEffect } from 'react';

export default function ProfileScreen() {
    useEffect(() => {
        console.log('----ProfileScreen useEffect----');
    }, [])

    return (
        <View style={{flex: 1, paddingHorizontal:10}}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text style={styles.bold}>Profilo</Text>
        </View>
    )
}

const styles = StyleSheet.create({ 
  regular: {
    ...globalStyles.textNormalRegular,
    color: 'red',
  },
  italic: {
    ...globalStyles.textNormalItalic,
    color: 'blue',
  },
  bold: {
    ...globalStyles.textNormalBold,
    color: 'purple',
  },
});