import * as Location from 'expo-location';

export default class ViewModelPosition {

    static askPermission = async () => {
        let canUseLocation = false;
        //CHECK SE HO GIÀ I PERMESSI 
        const grantedPermission = await Location.getForegroundPermissionsAsync();
        if (grantedPermission.status === 'granted') { 
          canUseLocation = true;
        } else {
          //CHIEDO I PERMESSI
          const permissionResponse = await Location.requestForegroundPermissionsAsync();
          if (permissionResponse.granted) {
            canUseLocation = true;
          }
        }
    
        return canUseLocation;
    }

    static getCurrentLocation = async () => {
        const location = await Location.getCurrentPositionAsync();
        console.log('(3.1)', location);
        return location;
    }

    static async getAddressFromCoordinates(coordinates) {
      //restituisce un array di dimensione 1 con l'indirizzo
      console.log("----Conversione coordinate in indirizzo----")
      try {
        const address = await Location.reverseGeocodeAsync(coordinates);
        console.log("Indirizzo obj:", address[0].formattedAddress);
        return address[0].formattedAddress;
      } catch (error) {
        console.error("Errore nella conversione delle coordinate in indirizzo:", error);
      }
    }
}