import { Button, StyleSheet, Text, View } from 'react-native';
import { globalStyles, fonts } from '../../styles/global';
import { useEffect } from 'react';

export default function HomeScreen({user}) {
    useEffect(() => {
        console.log('----HomeScreen useEffect----');
    }, []);

    return (
        <View style={{flex: 1, paddingHorizontal:10}}>
            <View style={{borderBottomWidth: 2, borderBottomColor: 'black'}}>
                <Text style={styles.bold}>Benvenuto{', ' + user.uid}</Text>
            </View>
            <Text>Open up App.js to start working on your app!</Text>
            <Text style={styles.regular}>Testo di esempio</Text>
            <Text style={styles.light}>Testo di esempio</Text>
            <Text style={styles.italic}>Testo di esempio</Text>
            <Text style={styles.bold}>Testo di esempio</Text>
            <Button title='Dettagli' onPress={() => console.log('pressed')}></Button>
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