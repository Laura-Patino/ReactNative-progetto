import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { globalStyles } from '../../styles/global';
import ViewModel from '../../viewmodel/ViewModel';

//ICONS
import FontAwesome from '@expo/vector-icons/FontAwesome';

const viewModel = new ViewModel();

export default function UpdateProfileScreen({onChangeScreen}) {
    
    useEffect(() => {
        console.log('----UpdateProfileScreen useEffect----');
        
    }, []);

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={{ marginBottom: 10, marginHorizontal:15}}>
                    <Text style={globalStyles.headerTitle}>Registrazione</Text>
                    <Pressable style={{position: 'absolute', top: 0, left: 5}} onPress={() => onChangeScreen('Profilo')}>
                        <FontAwesome name="arrow-circle-left" size={40} color="white" />
                    </Pressable>
                </View>
            
                <View style={styles.bodyContent}>
                    <View style={styles.imageContainer}>
                        <Image source={ require('../../assets/images/ImageNotAvailable.jpg')} style={styles.bigImage}/>
                    </View>

                    <View style={globalStyles.divider}/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                        <Text style={globalStyles.textBigRegular}>Nome</Text>
                        <Text style={globalStyles.textBigRegular}>Cognome</Text>
                    </View>
                    
                    <Button title={'Conferma dati'} color={'brown'} onPress={() => console.log('ok dati....')} />
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
