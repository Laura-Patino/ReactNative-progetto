import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';

export default function ProfileScreen({onChangeScreen, onUserUpdating}) {
    const viewModel = new ViewModel();
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateUserInfo = async () => {
      if (userDetails != null) {
        console.log('(Profile) Aggiornamento user:', userDetails);
        onUserUpdating(userDetails);
        onChangeScreen('UpdateProfilo');
      } else {
        const user = await viewModel.getUserDetails();
        console.log('(Profile) Registrazione user:', user);
        onUserUpdating(user);
        onChangeScreen('UpdateProfilo');
      }
    }

    const fetchUserDetails = async () => {
      const isRegistered = await viewModel.userIsRegistered();
      console.log("(Profile)", isRegistered)
      
      if (isRegistered) {
        const user = await viewModel.getUserDetails();
        setUserDetails(user);
      }
    }

    useEffect(() => {
        console.log('----Profile useEffect----');
        try {
          fetchUserDetails(); 
        } catch (error) {
          console.error('(Profile) Errore durante fetch dei dettagli utente:', error);
        } finally {
          setIsLoading(false);
        }
    }, []);

    if (isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size='large' color='yellow'/>
        </View>
      )
    }

    return (
        <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Profilo</Text>
          </View>
          {userDetails == null ? (
            <View style={[styles.bodyContent, {justifyContent: 'center', alignItems: 'center'}]}>
              
              <Text style={globalStyles.textNormalRegular}>Completa il profilo per ordinare il tuo menu preferito!</Text>

              <View style={{marginTop: 20}}/>
              <Button title="Registrazione" color={'green'} onPress={() => updateUserInfo()} />
            </View>
            
          ) : (
            <View style={styles.bodyContent}>
              <Text style={globalStyles.textNormalBold}>Dati Profilo: {userDetails.firstName}</Text>
              <Button title="Aggiorna" color={'green'} onPress={() => onChangeScreen('UpdateProfilo') } />

            </View>
          )}
          
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
    borderTopLeftRadius: 15
  },
});