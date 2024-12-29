import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { globalStyles, fonts } from './styles/global';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    [fonts.italic]: require('./assets/fonts/RedHatDisplay-Italic.ttf'),
    [fonts.light]: require('./assets/fonts/RedHatDisplay-Light.ttf'),
    [fonts.regular]: require('./assets/fonts/RedHatDisplay-Regular.ttf'),
    [fonts.bold]: require('./assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Caricamento...</Text>
        <ActivityIndicator size='large' color='#61dafb'/>
      </View>
    );
  } 

  return (
    <View style={globalStyles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text style={styles.light}>Testo di esempio</Text>
      <Text style={styles.regular}>Testo di esempio</Text>
      <Text style={styles.italic}>Testo di esempio</Text>
      <Text style={styles.bold}>Testo di esempio</Text>

      <StatusBar 
        animated={true}
        backgroundColor="#61dafb"
        barStyle='default'
        hidden={false}/>
    </View>
  );
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
  light: {
    ...globalStyles.textNormalLight,
    color: 'green',
  },
  bold: {
    ...globalStyles.textNormalBold,
    color: 'purple',
  },
});
