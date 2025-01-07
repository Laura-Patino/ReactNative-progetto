import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { globalStyles } from '../../styles/global';
import ViewModel from '../../viewmodel/ViewModel';

//ICONS
import FontAwesome from '@expo/vector-icons/FontAwesome';

const viewModel = new ViewModel();

export default function MenuDetailsScreen({selectedMenuMid, onChangeScreen}) {
    const [user, setUser] = useState(null);
    const [menuDetails, setMenuDetails] = useState(null);
    const [canDoOrder, setCanDoOrder] = useState(false); //TODO: DA MODIFICARE

    const getMenuDetails = async () => {
        try {
            const menuResponse = await viewModel.fetchMenuDetails(selectedMenuMid);
            setMenuDetails(menuResponse);
        } catch (error) {
            console.error('(MDS) Errore durante il recupero dei dettagli del menu:', error);
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
        const sessione = viewModel.getSessionUser();
        setUser(sessione);
        console.log('\tUser:', sessione.sid); 
        console.log('\tMenu:', selectedMenuMid);

        getMenuDetails();
    }, []);

    if (user == null || menuDetails == null) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="yellow" />
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={{ marginBottom: 10, marginHorizontal:15}}>
                    <Text style={[globalStyles.textBigBold, {color: 'white', textAlign: 'center'}]}>Dettagli menu</Text>
                    <Pressable style={{position: 'absolute', top: 0, left: 5}} onPress={() => onChangeScreen('Home')}>
                        <FontAwesome name="arrow-circle-left" size={40} color="white" />
                    </Pressable>
                </View>
                <View style={styles.bodyContent}>
                    <Text style={[globalStyles.textBigBold, {paddingBottom: 5, textAlign:'center'}]}>{menuDetails.name ? menuDetails.name : "Nessun menu selezionato"}</Text>
                    <View style={styles.imageContainer}>
                        <Image source={menuDetails?.image ? {uri: menuDetails.image} : require('../../assets/images/ImageNotAvailable.jpg')} style={styles.bigImage}/>
                    </View>

                    <Text style={globalStyles.textNormalItalic}> {menuDetails.shortDescription ? menuDetails.shortDescription : 'Breve descrizione'}</Text>
                    <Text style={globalStyles.textNormalRegular}>
                        <Text style={globalStyles.textNormalBold}>Descrizione: </Text>{menuDetails.longDescription ? menuDetails.longDescription : "Lunga descrizione"}</Text>

                    <View style={globalStyles.divider}/>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Text style={globalStyles.textBigRegular}>Prezzo: {menuDetails.price} €</Text>
                        <Text style={globalStyles.textBigRegular}>Pronto in: {formattedTime(menuDetails.deliveryTime)}</Text>
                    </View>
                    <Text style={globalStyles.textNormalRegular}>Benvenuto{', ' + user?.uid + ', firstRun:' + user?.firstRun}</Text>
                    <View style={globalStyles.divider}/>
                    <Button title="Ordina" color={'brown'} disabled={!canDoOrder} onPress={() => console.log('pressed')}/>
                    {!canDoOrder && <Text style={styles.warningText}>Non è ancora possibile ordinare un menu</Text>}
                    
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
        textAlign: 'center'
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
