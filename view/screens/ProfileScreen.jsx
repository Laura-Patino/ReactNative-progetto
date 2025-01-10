import { Button, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import ViewModel from '../../viewmodel/ViewModel';

export default function ProfileScreen({onChangeScreen}) {
    const viewModel = new ViewModel();
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserDetails = async () => {
      const isRegistered = await viewModel.userIsRegistered();
      if (isRegistered) {
        const user = await viewModel.getUserDetails();
        setUserDetails(user);
      }
    }

    useEffect(() => {
        console.log('----Profile useEffect----');
    }, []);

    return (
        <View style={{flex: 1}}>
          <View style={{ marginBottom: 10, marginHorizontal:15}}>
              <Text style={globalStyles.headerTitle}>Profilo</Text>
          </View>
          {userDetails == null ? (
            <View style={[styles.bodyContent, {justifyContent: 'center', alignItems: 'center'}]}>
              
              <Text style={globalStyles.textNormalRegular}>Completa il profilo per ordinare il tuo menu preferito!</Text>

              <View style={{marginTop: 20}}/>
              <Button title="Registrazione" color={'green'} onPress={() => onChangeScreen('UpdateProfilo') } />
            </View>
            
          ) : (
            <View style={styles.bodyContent}>
              <Text>Open up App.js to start working on your app!</Text>
              <Text style={globalStyles.textNormalBold}>Profilo</Text>
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