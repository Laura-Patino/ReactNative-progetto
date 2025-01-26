import { Button, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useRef, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';

export default function LastOrderScreen({onChangeScreen}) {

    const viewModel = new ViewModel();
    const [order, setOrder] = useState(null);

    let interval;
    //se order non null -> visualizzo l'ordine, mostro la mappa specifica in caso di "in consegna" o "consegnato"
    //la pagina si deve aggiornare ogni 5 secondi per vedere lo stato dell'ordine

    const onLoad = () => {
      console.log("Componente montato");
      interval = setInterval(() => {
        console.log("\tAggiornamento stato ordine... TODO: da implementare");
      }, 5000);
    }

    const onUnload = () => {
      console.log("Componente smontato");
      clearInterval(interval);
    }

    useEffect(() => {
        const fetchLastOrder = async () => {
          console.log('----LastOrderScreen----');
          
          const userDetails = await viewModel.getUserDetails();
          console.log('(LOS) User last order:', userDetails);

          if (userDetails && userDetails.lastOid && userDetails.orderStatus) { //se esiste un ordine 
            console.log('(LOS) Last order:', userDetails.lastOid, ' Status:', userDetails.orderStatus);
            if (userDetails.orderStatus === 'ON_DELIVERY') 
              onLoad();
            setOrder(userDetails.lastOid); //TODO: da modificare
          }
        };

        fetchLastOrder();

        return onUnload;
    }, []);

    if (order == null) {
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
    }

    return (
        <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Ordine</Text>
          </View>
          <View style={styles.bodyContent}>
            <Text style={globalStyles.textNormalBold}>Ordine {order}</Text>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({ 
  bodyContent: {
    flex:1, 
    backgroundColor: 'white', 
    paddingTop: 10, 
    paddingBottom: 5,
    paddingHorizontal:15, 
    borderTopRightRadius: 15, 
    borderTopLeftRadius: 15,
  },
  warningText: {
    ...globalStyles.sottotitolo,
    color: 'brown',
    //textAlign: 'center'
  },
});