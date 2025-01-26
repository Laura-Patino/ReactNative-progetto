import { ActivityIndicator, Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import ViewModel from '../../viewmodel/ViewModel';

//ICONS
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const avatar = require('../../assets/images/userAvatarDefault.jpg');

export default function ProfileScreen({onChangeScreen, onUserUpdating}) {
    const viewModel = new ViewModel();
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const updateUserInfo = async () => {
      if (userDetails != null) {
        console.log('(Profile) Aggiornamento user:', userDetails);
        userDetails.cardNumber = userDetails.cardNumber.replace(/ /g, '');
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
      console.log("(Profile) utente registrato?", isRegistered);
      
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
              
              <Image source={avatar} style={[globalStyles.smallImage, {alignSelf: 'center'}]} />
              <View style={styles.datiUtente}>
                <Text style={globalStyles.textBigBold}>{userDetails.firstName} </Text>
                <Text style={globalStyles.textBigBold}>{userDetails.lastName}</Text>
              </View>
              <Pressable 
                style={styles.buttonPressable}
                onPress={() => updateUserInfo()} >
                <Text style={styles.textPressable}>aggiorna profilo</Text>
              </Pressable>
              <View style={globalStyles.spaceArea}></View>
              <View style={{flexDirection: 'row', alignItems: 'center'}} >
                <FontAwesome name="credit-card" size={20} color="black" />
                <Text style={globalStyles.textNormalBold}> Metodo di pagamento</Text>
              </View>
              <View style={globalStyles.underline}></View>
              <LinearGradient
                colors={['#FF5733', '#50C878', '#338DFF']} //['#FF5733', '#FFC133', '#33FF57']
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{borderRadius: 10, marginVertical: 5, padding: 25}}
              > 
                <View style={styles.rowElements}>
                  <Text style={globalStyles.textBigBold}>{userDetails.cardNumber.slice(-4).padStart(userDetails.cardNumber.length, '*')}</Text>
                  <FontAwesome name="cc-mastercard" size={30} color="black" />
                </View>
                <View style={globalStyles.spaceArea}></View>
                <View style={styles.rowElements}>
                <Text style={globalStyles.textNormalBold}>{userDetails.cardFullName}</Text>
                <Text style={globalStyles.textNormalBold}>{userDetails.cardExpireMonth.toString().padStart(2, '0')+ "/" + userDetails.cardExpireYear}</Text>
                </View>
                
              </LinearGradient>
              
              <View style={globalStyles.spaceArea}></View>
              <View style={{flexDirection: 'row', alignItems: 'center'}} >
                <MaterialCommunityIcons name="shopping-outline" size={22} color="black" />
                <Text style={globalStyles.textNormalBold}> Ultimo ordine</Text>
              </View>
              <View style={globalStyles.underline}></View>
              {userDetails.lastOid ? (
                <View >ultimo ordine ...</View>
              ) : (
                <Text style={globalStyles.textNormalRegular}>Ancora nessun ordine effettuato</Text>
              )}

              <View style={globalStyles.spaceArea}></View>
              
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
  datiUtente: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  rowElements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // marginHorizontal: 10,
    // marginVertical: 5,
  },
  buttonPressable: {
    alignItems: 'center',
    //alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20, 
    elevation: 2,
    margin: 2,
    //width: '100%',
  },
  textPressable: {
    ...globalStyles.textSmallBold,
    color: 'white',
    textTransform: 'uppercase',
    lineHeight: 19,
    textAlign: 'center',
  }
});