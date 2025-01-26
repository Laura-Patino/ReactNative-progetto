import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useRef, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';
import MapView, { Marker, Polyline } from 'react-native-maps';

//ICON 
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const imageDrone = require('../../assets/images/drone_icon.png');
const imageMenu = require('../../assets/images/menu_icon.png');

export default function LastOrderScreen({onChangeScreen}) {

    const viewModel = new ViewModel();
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState(null);

    const mapRef = useRef(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [menuLocation, setMenuLocation] = useState(null);
    const [droneLocation, setDroneLocation] = useState(null);

    let interval;
    //se order non null -> visualizzo l'ordine, mostro la mappa specifica in caso di "in consegna" o "consegnato"
    //la pagina si deve aggiornare ogni 5 secondi per vedere lo stato dell'ordine

    const fetchDronePosition = async (lastOid) => {
      console.log("\tAggiornamento posizione drone...");
      try {
        const dronePosition = await viewModel.getOrderDetails(lastOid);
        console.log("\tDrone position:", dronePosition.currentPosition);
        setDroneLocation({
          latitude: dronePosition.currentPosition.lat,
          longitude: dronePosition.currentPosition.lng
        });
      } catch (error) {
        console.error('(LOS) Errore durante il recupero della posizione del drone:', error);
        
      }
      
    } 

    const onLoad = (lastOid) => {
      console.log("Componente montato...ripetizione ogni 5 secondi");
  
      interval = setInterval(() => {
        fetchDronePosition(lastOid);
      }, 5000);
    }

    const onUnload = () => {
      console.log("Componente smontato");
      clearInterval(interval);
    }

    const centerMap = () => {
      console.log('\tCentra mappa....', deliveryLocation, menuLocation);
      mapRef.current.fitToCoordinates(
          [deliveryLocation, menuLocation], //array delle coordinate
          {
            edgePadding: {top: 40, right: 30, bottom: 30, left: 30},
            animated: true, //anima la transizione
          }
        );
    };

    useEffect(() => {
        const fetchLastOrder = async () => {
          console.log('------LastOrderScreen------');
          
          const userDetails = await viewModel.getUserDetails();
          console.log('(LOS) From UserDetails.. Last order:', userDetails.lastOid, ' Status:', userDetails.orderStatus);
          
          if (userDetails && userDetails.lastOid && userDetails.orderStatus) { //se esiste un ordine 
            setOrder(userDetails); 

            //chiamare funzione per ottenere i dettagli dell'ordine
            const orderDetails = await viewModel.getOrderDetails(userDetails.lastOid);
            const menuDetails = await viewModel.fetchMenuDetails(orderDetails.mid);
            console.log('(LOS) Order details:', orderDetails);  
            setDeliveryLocation({
              latitude: orderDetails.deliveryLocation.lat,
              longitude: orderDetails.deliveryLocation.lng,
            });

            setMenuLocation({
                latitude: menuDetails.location.lat,
                longitude: menuDetails.location.lng
            })
            
            if (userDetails.orderStatus === 'ON_DELIVERY') {
              //se in consegna mostrare anche il drone
              const dronePosition = await viewModel.getOrderDetails(userDetails.lastOid);
              console.log('(LOS) Drone position:', dronePosition.currentPosition);
              setDroneLocation({
                latitude: dronePosition.currentPosition.lat,
                longitude: dronePosition.currentPosition.lng
              });
              onLoad(userDetails.lastOid);
            } 
              
            
          }

          setIsLoading(false);
        };

        fetchLastOrder();

        return onUnload;
    }, []);

    if (isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size='large' color='yellow'/>
        </View>
      );
    } else if (order == null && !isLoading) {
      return (
        <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}> Ultimo ordine</Text>
          </View>
          <View style={[styles.bodyContent, {justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={styles.warningText}>Non hai ancora effettuato alcun ordine.</Text>
            <Text style={globalStyles.textNormalRegular}>Vedi i menu più vicini a te nella pagina principale. {"\n"} 
              Una volta selezionato il menu, potrai effettuare l'ordine e visualizzarlo in questa pagina.
            </Text>
            <View style={{marginTop: 20}}/>
            <Button title="Vedi i menu" color={'green'} onPress={() => onChangeScreen('Home')} />
          </View>
        </View>
      );
    } else if (order && order.orderStatus === 'ON_DELIVERY' && deliveryLocation && menuLocation && droneLocation) {
      return ( 
        <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Ordine in consegna</Text>
          </View>
          <View style={styles.bodyContent}>
            <MapView style={styles.map}
              ref={mapRef}
              showsMyLocationButton={true}
              showsUserLocation={true}
              // loadingEnabled={true}
              initialRegion={{
                latitude: 45.464169,
                longitude: 9.189262,
                latitudeDelta: 0.006,
                longitudeDelta: 0.006,
              }}
              onMapReady={centerMap}
              zoomControlEnabled={true}>
              <Marker
                coordinate={deliveryLocation}
                title="La tua posizione"
                pinColor='red'
                description="Il tuo ordine è stato consegnato qui"
              >
              </Marker>
              <Marker
                coordinate={menuLocation}
                title="Posizione del menu"
                description="Il menu che hai ordinato si trovava qui">
                <Image source={imageMenu} resizeMode='contain' style={{width: 40, height: 40}}/>
              </Marker>
              <Marker
                coordinate={droneLocation}
                title='Drone'
                description='Il drone è in arrivo'>
                <Image source={imageDrone} resizeMode='contain' style={{width: 40, height: 40}}/>
              </Marker>
              <Polyline
                coordinates={[deliveryLocation, menuLocation, droneLocation] }
                strokeColor="red"
                strokeWidth={2}>
              </Polyline>
            </MapView>
          </View>
        </View>
      );
    } else if (order && order.orderStatus === 'COMPLETED' && deliveryLocation && menuLocation) {
      return (
          <View style={{flex: 1}}>
            <View style={{ marginBottom: 10, marginHorizontal:15}}>
                <Text style={globalStyles.headerTitle}>Ordine consegnato</Text>
            </View>
            <View style={styles.bodyContent}>
              {/* <Text style={globalStyles.textNormalBold}>Ordine {order.lastOid}</Text>  */}
              
                <MapView style={styles.map}
                  ref={mapRef}
                  showsMyLocationButton={true}
                  showsUserLocation={true}
                  // loadingEnabled={true}
                  initialRegion={{
                    latitude: 45.464169,
                    longitude: 9.189262,
                    latitudeDelta: 0.006,
                    longitudeDelta: 0.006,
                  }}
                  onMapReady={centerMap}
                  zoomControlEnabled={true}>
                  <Marker
                    coordinate={deliveryLocation}
                    title="La tua posizione"
                    pinColor='red'
                    description="Il tuo ordine è stato consegnato qui"
                  >
                  </Marker>
                  <Marker
                    coordinate={menuLocation}
                    title="Posizione del menu"
                    description="Il menu che hai ordinato si trovava qui">
                    <Image source={imageMenu} resizeMode='contain' style={{width: 40, height: 40}}/>
                  </Marker>
                  <Polyline
                    coordinates={[deliveryLocation, menuLocation]}
                    strokeColor="red"
                    strokeWidth={2}>
                  </Polyline>
                </MapView>
              
            </View>
          </View>
      );
    } else {
      <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Ordine non gestito</Text>
          </View>
          <View style={styles.bodyContent}>
            <Text style={globalStyles.textBigBold}>caso non gestito</Text>
          </View>
      </View>
    }
}

const styles = StyleSheet.create({ 
  bodyContent: {
    flex:1, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center',
    ///paddingTop: 10, 
    //paddingBottom: 5,
    //paddingHorizontal:15, 
    borderTopRightRadius: 15, 
    borderTopLeftRadius: 15,
  },
  warningText: {
    ...globalStyles.sottotitolo,
    color: 'brown',
  },
  mapContainer: { //useless? 
    width: '100%',
    height: 700,
  }, 
  map: {
    width: '100%', 
    height: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
});