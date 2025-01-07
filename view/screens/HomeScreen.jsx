import { ActivityIndicator, Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';
import ViewModelPosition from '../../viewmodel/viewModelPosition';

//COMPONENTS
import MenuItem from '../components/MenuItem';

export default function HomeScreen({user, onChangeScreen, onMenuSelection}) {
  
  const viewModel = new ViewModel();
  const [allMenus, setAllMenus] = useState(null);
  
  const [coordinates, setCoordinates] = useState(null); //TODO: DA RECUPERARE DALLA POSIZIONE

  useEffect(() => {
      console.log('----HomeScreen useEffect----');
      console.log('User:', user); 
      const fetchMenusAndImage = async () => {
        const menus = await viewModel.fetchAllMenus();
  
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
        
        // //TODO: DEVO PRIMA OTTENERE I PERMESSI PER LA POSIZIONE
        //const response = await ViewModelPosition.getAddressFromCoordinates(coordinates);
        //console.log('Address:', response);
      };
      fetchMenusAndImage();
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
              <Text style={[globalStyles.textBigBold, {color: 'white'}]}>Benvenuto{', ' + user?.uid + ', firstRun:' + user?.firstRun}</Text>
          </View>
          <View style={styles.bodyContent}>
            
            <Text style={[globalStyles.sottotitolo, {paddingBottom: 10}]}>Menu vicini a Milano</Text>

            {/* {<View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Image source={allMenus[0].image ? {uri: allMenus[0].image} : require('../../assets/images/ImageNotAvailable.jpg')} style={globalStyles.smallImage}/>
              <View style={{marginLeft: 10, flex: 2}}>
                <Text style={globalStyles.textNormalBold}>{allMenus[0].name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[globalStyles.textSmallRegular]}> € {allMenus[0].price} | </Text>
                  <Ionicons name="time-outline" size={15} color="black" /> 
                  <Text style={[globalStyles.textSmallRegular]}> {allMenus[0].deliveryTime} min</Text>
                </View>
                <Text style={globalStyles.textNormalRegular}>{allMenus[0].shortDescription}</Text>

              </View>
              <Pressable style={{position: 'absolute', bottom: 0, right:10}} onPress={() => console.log('pressed', allMenus[0].image)}>
                  <FontAwesome name="arrow-circle-right" size={40} color="brown" />
                </Pressable>
            </View>} */}

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