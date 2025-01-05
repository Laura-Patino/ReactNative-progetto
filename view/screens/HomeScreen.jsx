import { ActivityIndicator, Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';
import ViewModelPosition from '../../viewmodel/viewModelPosition';

//COMPONENTS
import MenuItem from '../components/MenuItem';
import MenuList from '../components/MenuList';

//ICONS
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen({user, onchangeScreen}) {
  
  const viewModel = new ViewModel();
  const [allMenus, setAllMenus] = useState();
  const [all, setAll] = useState(null);
  const [coordinates, setCoordinates] = useState(null); //TODO: DA RECUPERARE DALLA POSIZIONE

  useEffect(() => {
      console.log('----HomeScreen useEffect----');
      console.log('User:', user); 
      const example = async () => {
        await viewModel.fetchMenuDetails(47).then((result) => {
          setAllMenus(result);
        })

        await viewModel.fetchAllMenus().then((result) => {
          setAll(result);
          console.log('AllMenus:', result[0]);
        });
        // //TODO: DEVO PRIMA OTTENERE I PERMESSI PER LA POSIZIONE
        //const response = await ViewModelPosition.getAddressFromCoordinates(coordinates);
        //console.log('Address:', response);
      };
     example();
  }, []);

  if (allMenus == null || all == null) {
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

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Image source={allMenus.image ? {uri: allMenus.image} : require('../../assets/images/ImageNotAvailable.jpg')} style={globalStyles.smallImage}/>
              <View style={{marginLeft: 10, flex: 2}}>
                <Text style={globalStyles.textNormalBold}>{allMenus.name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[globalStyles.textSmallRegular]}> € {allMenus.price} | </Text>
                  <Ionicons name="time-outline" size={15} color="black" /> 
                  <Text style={[globalStyles.textSmallRegular]}> {allMenus.deliveryTime} min</Text>
                </View>
                <Text style={globalStyles.textNormalRegular}>{allMenus.shortDescription}</Text>

              </View>
              <Pressable style={{position: 'absolute', bottom: 0, right:15}} onPress={() => console.log('pressed')}>
                  <FontAwesome name="arrow-circle-right" size={40} color="brown" />
                </Pressable>
            </View>

            <FlatList 
              data={all} 
              keyExtractor={(item) => item.mid} 
              ItemSeparatorComponent={() => <View style={globalStyles.divider}/>} 
              renderItem={({item}) => (
                <MenuItem item={item} />
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