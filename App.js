import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { globalStyles, fonts } from './styles/global';
import { useFonts } from 'expo-font';

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

//ICONS
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function App() {
  const [fontsLoaded] = useFonts({
    [fonts.italic]: require('./assets/fonts/RedHatDisplay-Italic.ttf'),
    [fonts.light]: require('./assets/fonts/RedHatDisplay-Light.ttf'),
    [fonts.regular]: require('./assets/fonts/RedHatDisplay-Regular.ttf'),
    [fonts.bold]: require('./assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{flex:1,justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
        <View>
          <Text style={globalStyles.logo}>Mangia e Basta</Text>
          <ActivityIndicator size='large' color='yellow'/>
        </View>
      </SafeAreaView> 
    );
  } 

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{flex: 1, paddingHorizontal:10, backgroundColor: 'white'}}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text style={styles.regular}>Testo di esempio</Text>
        <Text style={styles.light}>Testo di esempio</Text>
        <Text style={styles.italic}>Testo di esempio</Text>
        <Text style={styles.bold}>Testo di esempio</Text>
      </View>
      
      <View style={{position: 'relative', bottom: 0, backgroundColor: '#327432', flexDirection: 'row', justifyContent: 'space-around'}}>
        <Pressable onPress={() => console.log('Home')} style={{flex:1, alignItems: 'center', paddingVertical: 15}}>
          <Feather name="home" size={25} color="white" />
          <Text style={globalStyles.navigationText}>Menu</Text>
        </Pressable>
        <Pressable onPress={() => console.log('Ordine')} style={{flex:1, alignItems: 'center',  paddingVertical: 15}}>
          
          <Feather name="shopping-bag" size={24} color="white" />
          <Text style={globalStyles.navigationText}>Ordine</Text>
        </Pressable>
        <Pressable onPress={() => console.log('Profilo')} style={{flex:1, alignItems: 'center', paddingVertical: 15}}>
          <FontAwesome5 name="user" size={24} color="white" />
          <Text style={globalStyles.navigationText}>Profilo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
