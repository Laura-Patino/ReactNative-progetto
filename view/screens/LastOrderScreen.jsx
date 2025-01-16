import { Button, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';

export default function LastOrderScreen({onChangeScreen}) {

    const viewModel = new ViewModel();
    const [order, setOrder] = useState(null);
    //se order non null -> visualizzo l'ordine, mostro la mappa specifica in caso di "in consegna" o "consegnato"
    //la pagina si deve agigornare ogni 5 secondi per vedere lo stato dell'ordine

    useEffect(() => {
        const fetchLastOrder = async () => {
          console.log('----LastOrderScreen----');

          const lastOrder = await viewModel.getUserDetails();
          console.log('(LOS) Last order:', lastOrder);

          if (lastOrder && lastOrder.lastOid && lastOrder.orderStatus) { //se esiste un ordine 
            setOrder(lastOrder.lastOid); //TODO: da modificare
          }
        };

        fetchLastOrder();
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
            <Text>Open up App.js to start working on your app!</Text>
            <Text style={globalStyles.textNormalBold}>Ordine</Text>
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