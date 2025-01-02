import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { globalStyles, fonts } from './styles/global';
import { useFonts } from 'expo-font';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
//SCREENS
import HomeScreen from './view/screens/HomeScreen';
import OrderScreen from './view/screens/LastOrderScreen';
import ProfileScreen from './view/screens/ProfileScreen';

//ICONS
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect, useState } from 'react';

export default function App() {
  const [fontsLoaded] = useFonts({
    [fonts.italic]: require('./assets/fonts/RedHatDisplay-Italic.ttf'),
    [fonts.regular]: require('./assets/fonts/RedHatDisplay-Regular.ttf'),
    [fonts.bold]: require('./assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const [currentScreen, setCurrentScreen] = useState('Home');

  const changeScreen = (screen) => {
    setCurrentScreen(screen);
    console.log('Screen changed to: ', screen);
  }

  useEffect(() => {
    console.log('----App useEffect----');
  }, []);

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
      { currentScreen === "Home" && (
        <HomeScreen />
      )}
      {
        currentScreen === "Ordine" && (
          <OrderScreen />
        )
      }
      {
        currentScreen === "Profilo" && (
          <ProfileScreen />
        )
      }
       
      <View style={{position: 'relative', bottom: 0, backgroundColor: '#327432', flexDirection: 'row', justifyContent: 'space-around'}}>
        <Pressable onPress={() => changeScreen('Home')} style={{flex:1, alignItems: 'center', paddingVertical: 15}}>
          <Feather name="home" size={25} color="white" />
          <Text style={globalStyles.navigationText}>Menu</Text>
        </Pressable>
        <Pressable onPress={() => changeScreen('Ordine')} style={{flex:1, alignItems: 'center',  paddingVertical: 15}}>
          
          <Feather name="shopping-bag" size={24} color="white" />
          <Text style={globalStyles.navigationText}>Ordine</Text>
        </Pressable>
        <Pressable onPress={() => changeScreen('Profilo')} style={{flex:1, alignItems: 'center', paddingVertical: 15}}>
          <FontAwesome5 name="user" size={24} color="white" />
          <Text style={globalStyles.navigationText}>Profilo</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
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
  bold: {
    ...globalStyles.textNormalBold,
    color: 'purple',
  },
});
