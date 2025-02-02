import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Button, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import { globalStyles } from '../../styles/global';
import ViewModel from '../../viewmodel/ViewModel';
import ViewModelPosition from '../../viewmodel/viewModelPosition';

//ICONS
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const viewModel = new ViewModel();

export default function MenuDetailsScreen({selectedMenuMid, onChangeScreen, coords}) {
    const [menuDetails, setMenuDetails] = useState(null);
    
    const [canDoOrder, setCanDoOrder] = useState(false);
    const [missingAllowances, setMissingAllowances] = useState(null);

    const getMenuDetails = async (latitude, longitude) => {
        try {
            const menuResponse = await viewModel.fetchMenuDetails(selectedMenuMid, latitude, longitude);
            setMenuDetails(menuResponse);
        } catch (error) {
            console.error('(MDS) Errore durante il recupero dei dettagli del menu:', error);
        }
    };

    const buyMenu = async () => {
        //try {
            const orderResponse = await viewModel.buyMenu(selectedMenuMid, coords.latitude, coords.longitude);
            console.log('(MDS) Order response:', orderResponse);
            if (orderResponse)
                onChangeScreen('Ordine');
            else 
                Alert.alert('Carta di credito non valida', 'La carta di credito inserita non è valida. Inserirne una valida sul profilo.');
        // } catch (error) {
        //     console.error("(MDS) Errore durante l\'acquisto del menu:", error);
        // }
    }

    const orderAllowed = async () => {
        console.log('Check if order is allowed...');
        
        const permissionGranted = await ViewModelPosition.checkOnlyPermission();
        const profileCompleted = await viewModel.userIsRegistered();
        const hasOrderInProgress = await viewModel.hasOrderInProgress();
        console.log('(MDS) Permission position:', permissionGranted, ' Profile:', profileCompleted, ' OrderInProgress:', hasOrderInProgress);

        if (permissionGranted && profileCompleted && !hasOrderInProgress) {
            setCanDoOrder(true);
        } else {
            setCanDoOrder(false);
            let missing = [];
            if (!permissionGranted) missing.push('Hai negato l\'accesso alla tua posizione');
            if (!profileCompleted) missing.push('Non hai ancora completato il profilo');
            if (hasOrderInProgress) missing.push('Hai ancora un ordine in corso, attendi la consegna');
            setMissingAllowances(missing);
        }
    };

    const formattedTime = (minutes) => {
        if (minutes < 60) return `${minutes} min`;

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 1) return `${hours} ore e ${mins} min`;
        if (mins === 0) return `${hours} ora`;

        return `${hours} ora e ${mins} min`;
    }

    useEffect(() => {
        console.log('----MenuDetailsScreen useEffect----');

        if (coords == null) { //da eliminare coords === null 
            console.log('(MDS) No coordinates');
            getMenuDetails();
        } else {
            console.log('(MDS) Coordinates:', coords.latitude, coords.longitude);
            getMenuDetails(coords.latitude, coords.longitude);
        } 
        orderAllowed();
    }, []);

    if (menuDetails == null) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="yellow" />
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            
                <View style={{ marginBottom: 10, marginHorizontal:15}}>
                    <Text style={globalStyles.headerTitle}>Dettagli menu</Text>
                    <Pressable style={{position: 'absolute', top: 0, left: 5}} onPress={() => onChangeScreen('Home')}>
                        <FontAwesome name="arrow-circle-left" size={40} color="white" />
                    </Pressable>
                </View>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.bodyContent}>
                    <Text style={[globalStyles.textBigBold, {paddingBottom: 5, textAlign:'center'}]}>{menuDetails.name ? menuDetails.name : "Nessun menu selezionato"}</Text>
                    <View style={styles.imageContainer}>
                        <Image source={menuDetails?.image ? {uri: menuDetails.image} : require('../../assets/images/ImageNotAvailable.jpg')} style={styles.bigImage}/>
                    </View>

                    <Text style={globalStyles.textNormalItalic}> {menuDetails.shortDescription ? menuDetails.shortDescription : 'Breve descrizione'}</Text>
                    <Text style={globalStyles.textNormalRegular}>
                        <Text style={globalStyles.textNormalBold}>Descrizione: </Text>{menuDetails.longDescription ? menuDetails.longDescription : "Lunga descrizione"}</Text>

                    {/* {<View style={globalStyles.divider}/>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <FontAwesome5 name="map-marker-alt" size={26} color="#327432"/>
                        <Text style={globalStyles.textNormalBold}> Milano, Italia</Text>
                    </View>} */}
                    <View style={globalStyles.divider}/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                        <Text style={globalStyles.textBigRegular}>Prezzo: {menuDetails.price} €</Text>
                        <Text style={globalStyles.textBigRegular}>Pronto in: {formattedTime(menuDetails.deliveryTime)}</Text>
                    </View>
                    
                    <View style={globalStyles.divider}/>
                    <Button title="Ordina" color={'brown'} disabled={!canDoOrder} onPress={() => buyMenu()}/>
                    <View style={{alignItems: 'center'}}>
                        {!canDoOrder && <Text style={styles.warningText}>Non è ancora possibile ordinare un menu:</Text>}
                        {missingAllowances && missingAllowances.map((item, index) => (
                            <Text key={index} style={styles.warningText}>{(index+1)}. {item}</Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    bodyContent: {
        flex:1, 
        backgroundColor: 'white', 
        paddingTop: 10, 
        paddingBottom: 10,
        paddingHorizontal:15, 
        borderTopRightRadius: 15, 
        borderTopLeftRadius: 15
    },
    warningText: {
        ...globalStyles.textSmallBold,
        color: 'brown',
        //textAlign: 'center'
    },
    bigImage: {
        width: '100%', 
        height: 250, 
        alignSelf: 'center', 
        marginBottom: 10
    },
    imageContainer: {
        alignItems: 'center',
    },
});
