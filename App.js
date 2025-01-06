import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { globalStyles, fonts } from './styles/global';
import { useFonts } from 'expo-font';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import ViewModel from './viewmodel/ViewModel';
//SCREENS
import HomeScreen from './view/screens/HomeScreen';
import OrderScreen from './view/screens/LastOrderScreen';
import ProfileScreen from './view/screens/ProfileScreen';
import MenuDetailsScreen from './view/screens/MenuDetailsScreen';

//COMPONENTS
import TabNavigation from './view/components/TabNavigation';

//ICONS
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect, useState } from 'react';

export default function App() {
  
  const [fontsLoaded] = useFonts({
    [fonts.italic]: require('./assets/fonts/RedHatDisplay-Italic.ttf'),
    [fonts.regular]: require('./assets/fonts/RedHatDisplay-Regular.ttf'),
    [fonts.bold]: require('./assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const [currentScreen, setCurrentScreen] = useState('Home');
  const [sessionUser, setSessionUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const changeScreen = (screen) => {
    setCurrentScreen(screen);
    console.log('Screen changed to: ', screen);
  }

  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
  }

  init = async () => {
    try {
      const viewModel = new ViewModel();
      const sessione = await viewModel.initializeApp();
      setSessionUser(sessione);
      
    } catch (error) {
      console.error("Errore durante l'inizializzazione dell'App: ", error);
    }
  }

  useEffect(() => {
    console.log('----App useEffect----');
    const initializeApp = async () => {
      if (!sessionUser) {
        console.log('(1) SessionUser is null');
        await init();
      }
      if (sessionUser) {
        console.log('(2) SessionUser is not null:', sessionUser);
        //TODO: firstRun true -> posizione di default
        //    firstRun false -> chiedere permessi e recuperare posizione 
      }
    };

    initializeApp();
  }, []); //sessionUser

  if (!fontsLoaded || !sessionUser) {
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
        <HomeScreen user={sessionUser} onChangeScreen={changeScreen} onMenuSelection={handleMenuSelection}/>
      )}
      {
        currentScreen === "Dettagli" && (
          <MenuDetailsScreen user={sessionUser} menu={selectedMenu} onChangeScreen={changeScreen}/>
        )
      }
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
       
      <View style={styles.navStyle}>
        <TabNavigation onChangeScreen={changeScreen} currentScreen={currentScreen} name="Home">
          {currentScreen === 'Home' ? 
              <Ionicons name="home-sharp" size={24} color="white" /> : <Ionicons name="home-outline" size={25} color="white" />
          }
        </TabNavigation>
        <TabNavigation onChangeScreen={changeScreen} currentScreen={currentScreen} name="Ordine">
          {currentScreen === 'Ordine' ? 
            <MaterialCommunityIcons name="shopping" size={25} color="white" /> : <MaterialCommunityIcons name="shopping-outline" size={25} color="white" /> 
          }
        </TabNavigation>
        <TabNavigation onChangeScreen={changeScreen} currentScreen={currentScreen} name="Profilo">
          {currentScreen === 'Profilo' ? 
            <FontAwesome5 name="user-alt" size={24} color="white" /> : <FontAwesome5 name="user" size={24} color="white" /> 
          }   
        </TabNavigation>
      </View>
      <StatusBar style="auto" backgroundColor='#327432'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  navStyle: {
    position: 'relative', 
    bottom: 0, 
    backgroundColor: '#327432', 
    //borderTopColor: 'white',
    //borderTopWidth: 2,
    flexDirection: 'row', 
    justifyContent: 'space-around',
  },
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
