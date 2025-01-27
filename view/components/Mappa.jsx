import { use, useEffect, useRef, useState } from "react";
import ViewModel from "../../viewmodel/ViewModel";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import { globalStyles } from "../../styles/global";
import { ActivityIndicator, Image, Text, View } from "react-native";

//import images
const viewModel = new ViewModel();

export default function Mappa({orderId, status, changeStatusOrder}) { //da menu devo ottenere la posizione del ristorante
    const imageDrone = require('../../assets/images/droneIcon1.png');
    const imageMenu = require('../../assets/images/menuIcon.png');
    const imageUser = require('../../assets/images/userIcon.png');

    const [menu, setMenu] = useState(null);
    const [orderStatus, setOrderStatus] = useState(status);
    const [markers, setMarkers] = useState([]);

    const mapRef = useRef(null);
    let intervalId = null;
    let step = 0;

    const centerMap = () => {
        mapRef.current.fitToCoordinates(
            [{latitude: markers[0].latitude, longitude: markers[0].longitude}, {latitude: markers[1].latitude, longitude: markers[1].longitude}], //array delle coordinate
            {
              edgePadding: {top: 40, right: 30, bottom: 30, left: 30},
              animated: true, //anima la transizione
            }
        );
    };

    const getDateDeliveryFormatted = (isoString) => {
        const date = new Date(isoString);
        const giornoConsegna = date.toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return giornoConsegna;
    }

    const getTimeDeliveryFormatted = (isoString) => {  
        const date = new Date(isoString);
        const oraConsegna = date.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return oraConsegna;
    }

    const fetchAllPositions = async () => {
        try {
            step = step +1;
            const response = await viewModel.getOrderDetails(orderId); //da qui ottengo la posizione del drone, e la delivery location
            const menuResponse = await viewModel.fetchMenuDetails(response.mid);
            setMenu(menuResponse);

            if (response.status !== orderStatus){
                console.log(".....Stato ordine cambiato.....", orderStatus, " -> ", response.status);   
                setOrderStatus(response.status);
                changeStatusOrder(response.status);
            }

            if (orderStatus === "ON_DELIVERY") { //orderStatus-> response.status
                console.log("\tON_DELIVERY.....", step);   
                setMenu({
                    name: menuResponse.name,
                    expectedDeliveryTimestamp: response.expectedDeliveryTimestamp,
                })
                setMarkers([
                    {id: 1, latitude: response.deliveryLocation.lat, longitude: response.deliveryLocation.lng, title: "La tua posizione", image: imageUser},
                    {id: 2, latitude: menuResponse.location.lat, longitude: menuResponse.location.lng, title: menuResponse.name, image: imageMenu},
                    {id: 3, latitude: response.currentPosition.lat, longitude: response.currentPosition.lng, title: "Posizione drone", image: imageDrone},
                ]);
            } else if (orderStatus === "COMPLETED") {
                console.log("\tCOMPLETED.....", step);
                setMenu({
                    name: menuResponse.name,
                    deliveryTimestamp: response.deliveryTimestamp,
                })
                setMarkers([
                    {id: 1, latitude: response.deliveryLocation.lat, longitude: response.deliveryLocation.lng, title: "La tua posizione", image: imageUser},
                    {id: 2, latitude: menuResponse.location.lat, longitude: menuResponse.location.lng, title: menuResponse.name, image: imageMenu}
                ]);
            }
        } catch (error) {
            console.error("(Mappa) fetchAllPositions: ", error);   
        }
    }

    useEffect(() => {
        if (orderStatus === "ON_DELIVERY") {
            console.log("---------Mappa2---------");
            intervalId = setInterval(() => {
                console.log("_______Richiesta posizione drone______")
                fetchAllPositions();
            }, 5000);
        } else if (orderStatus === "COMPLETED") {
            console.log("---------Mappa1---------");
            fetchAllPositions();
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [orderStatus]);

    if (markers.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[globalStyles.textNormalBold, {color: 'white'}]}>Caricamento Mappa...</Text>
                <ActivityIndicator size='large' color='yellow'/>
            </View>
        );
    }

    return (
        <View style={{flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden'}}>
            {/* <Text style={globalStyles.textBigRegular}>Stato ordine: {orderStatus}</Text> */}
            <MapView 
            style={{flex: 1}} 
            ref={mapRef}
            onMapReady={centerMap}
            zoomControlEnabled={true}
            initialRegion={{latitude: 45.464664, longitude: 9.188540, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}> 
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                        title={marker.title}
                    >
                        <Image source={marker.image} resizeMode='center' style={{width: 35, height: 35}}/>
                    </Marker>
                ))}
                <Polyline
                    coordinates={markers.map((marker) => ({latitude: marker.latitude, longitude: marker.longitude}))}
                    strokeColor="red"
                    strokeWidth={2}
                ></Polyline>
            </MapView>
            <View style={{flex: 0.2, backgroundColor: 'white', paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center'}}>
                {orderStatus === 'ON_DELIVERY' ? 
                    (
                        <View>
                            <Text style={[globalStyles.textNormalItalic, {color: 'grey'}]}>Ordine #{orderId}</Text>
                            <Text style={globalStyles.textNormalRegular}>Il tuo ordine <Text style={globalStyles.textNormalBold}>{menu.name}</Text> è in arrivo</Text>
                            <Text style={globalStyles.textNormalRegular}>Consegna prevista: {getDateDeliveryFormatted(menu.expectedDeliveryTimestamp)} alle {getTimeDeliveryFormatted(menu.expectedDeliveryTimestamp)}</Text>
                            
                        </View>
                    ) : (
                        <View>
                            <Text style={[globalStyles.textNormalItalic, {color: 'grey'}]}>Ordine #{orderId}</Text>
                            <Text style={globalStyles.textNormalRegular}>Il tuo ordine <Text style={globalStyles.textNormalBold}>{menu.name}</Text> è stato consegnato alle {getTimeDeliveryFormatted(menu.deliveryTimestamp)} del {getDateDeliveryFormatted(menu.deliveryTimestamp)}</Text>
                        </View>
                    )
                }
            </View>
        </View>
    );
}