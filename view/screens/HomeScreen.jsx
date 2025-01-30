import { ActivityIndicator, Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';
import ViewModelPosition from '../../viewmodel/viewModelPosition';

//COMPONENTS
import MenuItem from '../components/MenuItem';

export default function HomeScreen({onChangeScreen, onMenuSelection, coords}) {
  
  const viewModel = new ViewModel();
  const [allMenus, setAllMenus] = useState(null);
  const [address, setAddress] = useState(null);

  const convertCoordinatesToAddress = async (coords) => {
    const res =  await ViewModelPosition.getAddressFromCoordinates(coords);
    //console.warn('(HS) Address:', res);
    setAddress(res);
  }

  useEffect(() => {
      console.log('----HomeScreen useEffect----');

      const fetchMenusAndImage = async (latitude, longitude) => {
        const menus = await viewModel.fetchAllMenus(latitude, longitude);
        
        //Recupero immagini per ogni menu
        const updatedMenus = await Promise.all(
          menus.map(async (menu) => {
            try {
              const image = await viewModel.fetchMenuImage(menu.mid, menu.imageVersion);
              return {...menu, image};
            } catch (error) {
              console.error('(HS) Errore caricamento immagine:', error);
              return {...menu, image: null};
            }
          })
        )

        setAllMenus(updatedMenus);
      };

      if (coords == null) {
        console.log('\t(HS)Coordinates are null');
        setAddress("Milano");
        fetchMenusAndImage();
      } else {
        console.log('\t(HS) Coordinates are not null:', coords.latitude, coords.longitude);
        // chiamo funzione per convertire le coordinate in indirizzo
        convertCoordinatesToAddress(coords);
        fetchMenusAndImage(coords.latitude, coords.longitude);
      }

      //fetchUserDetails();
      
  }, []);

  if (allMenus == null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="yellow" />
      </View>
    );
  }
  return (
      <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Mangia e Basta</Text>
          </View>
          <View style={styles.bodyContent}>
            
            <Text style={[globalStyles.sottotitolo, {paddingBottom: 10}]}>Menu vicini a {address}</Text>

            <FlatList 
              data={allMenus} 
              keyExtractor={(item) => item.mid.toString()} 
              ItemSeparatorComponent={() => <View style={globalStyles.divider}/>} 
              renderItem={({item}) => (
                <MenuItem item={item} onChangeScreen={onChangeScreen} onMenuSelection={onMenuSelection}/>
              )}
              style={{height: "100%"}}
            />
            
          </View>
          
      </View>
  );
}


const styles = StyleSheet.create({ 
  bodyContent: {
    flex:1, 
    backgroundColor: 'white', 
    paddingTop: 10, 
    paddingBottom: 5,
    paddingHorizontal:15, 
    borderTopRightRadius: 15, 
    borderTopLeftRadius: 15
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