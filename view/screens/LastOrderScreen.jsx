import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';

//ICON 
import Mappa from '../components/Mappa';

export default function LastOrderScreen({onChangeScreen}) {

    const viewModel = new ViewModel();
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState(null);

    //se order non null -> visualizzo l'ordine, mostro la mappa specifica in caso di "in consegna" o "consegnato"
    //la pagina si deve aggiornare ogni 5 secondi per vedere lo stato dell'ordine

    const changeStatusOrder = (stato) => {
      setOrder({...order, orderStatus: stato});
    };

    const fetchLastOrder = async () => {
      console.log('------LastOrderScreen------');
      
      const userDetails = await viewModel.getUserDetails(); //utente ha un ordine?
      console.log('(LOS) From UserDetails.. Last order:', userDetails.lastOid, ' Status:', userDetails.orderStatus);
      
      if (userDetails && userDetails.lastOid && userDetails.orderStatus) { //se esiste un ordine lastOid e orderStatus non null
        setOrder(userDetails); 
      }
      //setIsLoading(false);
    };

    useEffect(() => {
        fetchLastOrder().then(() => setIsLoading(false));
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
          <View style={styles.bodyContent}>
            <Text style={styles.warningText}>Non hai ancora effettuato alcun ordine.</Text>
            <Text style={globalStyles.textNormalRegular}>Vedi i menu più vicini a te nella pagina principale.</Text> 
            <Text style={[globalStyles.textNormalRegular, {paddingHorizontal: 15}]}>Una volta selezionato il menu, potrai effettuare l'ordine e visualizzarlo in questa pagina.</Text>
            <View style={{marginTop: 20}}/>
            <Button title="Vedi i menu" color={'green'} onPress={() => onChangeScreen('Home')} />
          </View>
        </View>
      );
    } else {
      return ( 
        <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Ordine {order.orderStatus === 'COMPLETED' ? 'consegnato' : 'in arrivo'}</Text>
          </View>
          <Mappa orderId={order.lastOid} status={order.orderStatus} changeStatusOrder={changeStatusOrder}/>
          
        </View>
      );
    } 
}

const styles = StyleSheet.create({ 
  bodyContent: {
    flex:1, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center',
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
    //oppure ...StyleSheet.absoluteFillObject
  }
});