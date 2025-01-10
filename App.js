import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { globalStyles, fonts } from './styles/global';
import { useFonts } from 'expo-font';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import ViewModel from './viewmodel/ViewModel';
import ViewModelPosition from './viewmodel/viewModelPosition';

//SCREENS
import HomeScreen from './view/screens/HomeScreen';
import OrderScreen from './view/screens/LastOrderScreen';
import ProfileScreen from './view/screens/ProfileScreen';
import MenuDetailsScreen from './view/screens/MenuDetailsScreen';
import UpdateProfileScreen from './view/screens/UpdateProfileScreen';

//COMPONENTS
import TabNavigation from './view/components/TabNavigation';

//ICONS
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect, useState } from 'react';

// aggiornare npm etc: npm install expo@~52.0.7 oppure npm install react-native@0.76.2 -> npx expo install

export default function App() {
  
  const [fontsLoaded] = useFonts({
    [fonts.italic]: require('./assets/fonts/RedHatDisplay-Italic.ttf'),
    [fonts.regular]: require('./assets/fonts/RedHatDisplay-Regular.ttf'),
    [fonts.bold]: require('./assets/fonts/RedHatDisplay-Bold.ttf'),
  });

  const [currentScreen, setCurrentScreen] = useState('Home');
  const [sessionUser, setSessionUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [coordinates, setCoordinates] = useState(null);
  const [permissionPosition, setPermissionPosition] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const changeScreen = (screen) => {
    setCurrentScreen(screen);
    console.log('Screen changed to: ', screen);
    
  }

  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
  }

  const getCoordinates = async () => {
    try {
      const canUseLocation = await ViewModelPosition.askPermission();
      setPermissionPosition(canUseLocation);

      if (canUseLocation) {
        
        console.log('(3.1) Can use location');
        
        const location = await ViewModelPosition.getCurrentLocation();
        console.log('\t...(3.1.1) Coordinates: lat=', location.coords.latitude, "lon=", location.coords.longitude);

        setCoordinates({
          latitude: location.coords.latitude, 
          longitude: location.coords.longitude
        });
      } else {
        console.log('(3.1) Cannot use location');
        
        Alert.alert(
          'Lettura posizione non autorizzata', 
          'Per il momento verrano visualizzati i ristoranti vicini a Milano', [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed')
          }
        ]);
      }
    } catch (error) {
      console.error('(A) Error getting location permission:', error);
    }
  }

  init = async () => {
    try {
      const viewModel = new ViewModel();
      const sessione = await viewModel.initializeApp();
      setSessionUser(sessione);

      if (sessione && !sessione.firstRun) {
        console.log('Not first run....');
        await getCoordinates();
      } 
    } catch (error) {
      console.error("Errore durante l'inizializzazione dell'App: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log('----App useEffect----');
    const initializeApp = async () => {
      if (!sessionUser) {
        console.log('(1) SessionUser is null');
        await init();
      }
      
    };

    initializeApp();
  }, []); //sessionUser

  if (isLoading || !fontsLoaded) { //|| !sessionUser || permissionPosition === null) {
    return (
      <SafeAreaView style={{flex:1,justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
        <View>
          <Text style={globalStyles.logo}>Mangia e Basta </Text>
          <ActivityIndicator size='large' color='yellow'/>
        </View>
      </SafeAreaView> 
    );
  } 

  if (permissionPosition && !coordinates && sessionUser && !sessionUser.firstRun) {
    return (
      <SafeAreaView style={{flex:1,justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
        <View>
          <Text style={globalStyles.logo}>Mangia e Basta</Text>
          <Text style={[globalStyles.textBigRegular, {color: 'white', textAlign: 'center'}]}>Ottenimento posizione...</Text>
    
          <ActivityIndicator size='large' color='yellow'/>
        </View>
      </SafeAreaView> 
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      { currentScreen === "Home" && (
        <HomeScreen onChangeScreen={changeScreen} onMenuSelection={handleMenuSelection} coords={coordinates}/>
      )}
      {
        currentScreen === "Dettagli" && (
          <MenuDetailsScreen selectedMenuMid={selectedMenu} onChangeScreen={changeScreen} coords={coordinates}/>
        )
      }
      {
        currentScreen === "Ordine" && (
          <OrderScreen onChangeScreen={changeScreen}/>
        )
      }
      {
        currentScreen === "Profilo" && (
          <ProfileScreen onChangeScreen={changeScreen} />
        )
      }
      { 
        currentScreen === "UpdateProfilo" && (
          <UpdateProfileScreen onChangeScreen={changeScreen} />
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
