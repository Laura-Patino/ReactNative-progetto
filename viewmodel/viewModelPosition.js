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

    static checkOnlyPermission = async () => { //AGGIUNTO: verifico solo se ho già i permessi per DettagliMenu
      let canUseLocation = false;
      const grantedPermission = await Location.getForegroundPermissionsAsync();
      if (grantedPermission.status === 'granted') { 
        canUseLocation = true;
      }
      return canUseLocation;
    }

    static getCurrentLocation = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        return location;
      } catch (error) {
        console.error('(3.1) Error getting current location:', error);
        throw error;
      }
        
    }

    static async getAddressFromCoordinates(coordinates) {
      //restituisce un array di dimensione 1 con l'indirizzo
      console.log("Conversione coordinate in indirizzo:")
      try {
        const address = await Location.reverseGeocodeAsync(coordinates);
        console.warn("(VMP) Indirizzo obj:", address[0]);
        return address[0].street; //formattedAddress / street a volte risulta null (es. Piazza Frattini) 
      } catch (error) {
        console.error("Errore nella conversione delle coordinate in indirizzo:", error);
      }
    }
}