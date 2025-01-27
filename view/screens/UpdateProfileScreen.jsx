import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Button, ActivityIndicator, StyleSheet, ScrollView, TextInput, Modal, Image } from 'react-native';
import { globalStyles } from '../../styles/global';
import ViewModel from '../../viewmodel/ViewModel';
import ViewModelFormAccount from '../../viewmodel/ViewModelFormAccount';

//ICONS
import FontAwesome from '@expo/vector-icons/FontAwesome';

const viewModel = new ViewModel();
const imageDone = require('../../assets/images/Done.png');

export default function UpdateProfileScreen({onChangeScreen, userData}) {
    const [showModal, setShowModal] = useState(false);
    const [userFields, setUserFields] = useState(userData);
    const [errors, setErrors] = useState({
        firstName: null,
        lastName: null,
        cardFullName: null,
        cardNumber: null,
        cardExpireMonth: null,
        cardExpireYear: null,
        cardCVV: null,
    });

    const handleSubmitForm = async () => {
        console.log('(UP) Dati aggiornati:', userFields);
        //Sono stati aggiornati tutti i dati? (tranne lastOid e orderStatus) se si posso inviare i dati
        //altrimenti mostro un testo per informare quali campi non vanno bene
        let newErrors = {};

        try {
            if (!(ViewModelFormAccount.validateFirstName(userFields.firstName)) ) newErrors.firstName = "Nome obbligatorio";
            if (!(ViewModelFormAccount.validateLastName(userFields.lastName))) newErrors.lastName = "Cognome obbligatorio";
            if (!(ViewModelFormAccount.validateCardFullName(userFields.cardFullName))) newErrors.cardFullName = "Nome sulla carta non valido";
            if (!(ViewModelFormAccount.validateCardNumber(userFields.cardNumber))) newErrors.cardNumber = "Il numero della carta deve essere da 16 numeri";
            if (!(ViewModelFormAccount.validateCardExpireMonth(userFields.cardExpireMonth))) newErrors.cardExpireMonth = "Mese di scadenza non valido";
            if (!(ViewModelFormAccount.validateCardExpireYear(userFields.cardExpireYear))) newErrors.cardExpireYear = "Anno di scadenza non valido";
            if (!(ViewModelFormAccount.validateCardCVV(userFields.cardCVV))) newErrors.cardCVV = "CVV non valido";
            setErrors(newErrors);
        } catch (error) {
            console.error("Errore durante la validazione dei dati:", error);
        }

        if (Object.keys(newErrors).length == 0) {
            console.log("\tDati validi, invio al server....");
            setShowModal(true);
            try {
                await viewModel.updateUserDetails(userFields);
                
                console.log("\tDati salvati con successo!");
                onChangeScreen('Profilo');
            } catch (error) {
                console.error("Errore durante l'aggiornamento dei dati verso il server:", error);
            }
        } else {
            console.log("\tDati non validi, impossibile inviare al server");
        }
    }
    
    useEffect(() => {
        console.log('----UpdateProfileScreen useEffect----');
        console.log('(UP) Dati iniziali:', userData);
        
    }, []);

    return (
        <View style={{flex: 1}}>
            <Modal animationType='fade' transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
                <View style={styles.centerdView}>
                    <View style={styles.modalView}>
                        <Text style={globalStyles.textNormalBold}>Dati Modificati Correttamente</Text>
                        <Image source={imageDone} style={{width: 100, height: 100}}></Image>
                    </View>
                </View>
            </Modal>
            <View style={{ marginBottom: 10, marginHorizontal:15}}>
                    <Text style={globalStyles.headerTitle}>Aggiornamento profilo</Text>
                    <Pressable style={{position: 'absolute', top: 0, left: 5}} onPress={() => onChangeScreen('Profilo')}>
                        <FontAwesome name="arrow-circle-left" size={40} color="white" />
                    </Pressable>
            </View>
            
            <ScrollView contentContainerStyle={{flexGrow: 1}}>            
                <View style={styles.bodyContent}>
                    <Text style={[globalStyles.textBigBold]}>Informazioni personali</Text>
                    <View style={globalStyles.underline}></View>
                    
                    <Text style={styles.inputLabel}>Nome</Text>
                    {errors.firstName && <Text style={styles.warningText}>{errors.firstName}</Text>}
                    <TextInput 
                        onChangeText={(input) => setUserFields({...userFields, firstName: input.trim()})}
                        maxLength={15} 
                        defaultValue={userData.firstName}
                        style={[styles.input, errors.firstName && styles.inputErrorColor]}
                    ></TextInput>
                    <Text style={styles.inputLabel}>Cognome</Text>
                    {errors.lastName && <Text style={styles.warningText}>{errors.lastName}</Text>}
                    <TextInput 
                        onChangeText={(input) => setUserFields({...userFields, lastName: input.trim()})}
                        maxLength={15} 
                        defaultValue={userData.lastName}
                        style={[styles.input, errors.lastName && styles.inputErrorColor]}
                    ></TextInput>

                    <View style={globalStyles.spaceArea}></View>
                    <Text style={globalStyles.textBigBold}>Dati carta di credito</Text>
                    <View style={globalStyles.underline}></View> 
                
                    <Text style={styles.inputLabel}>Nome completo sulla carta</Text>
                    {errors.cardFullName && <Text style={styles.warningText}>{errors.cardFullName}</Text>}
                    <TextInput 
                        onChangeText={(input) => setUserFields({...userFields, cardFullName: input})}
                        maxLength={31} 
                        defaultValue={userData.cardFullName}
                        style={[styles.input, errors.cardFullName && styles.inputErrorColor]}
                    ></TextInput>
                    <Text style={styles.inputLabel}>Numero carta</Text>
                    {errors.cardNumber && <Text style={styles.warningText}>{errors.cardNumber}</Text>}
                    <TextInput 
                        onChangeText={(input) => setUserFields({...userFields, cardNumber: input})}
                        maxLength={16} 
                        inputMode='decimal'
                        keyboardType='decimal-pad'
                        defaultValue={userData.cardNumber}
                        style={[styles.input, errors.cardNumber && styles.inputErrorColor]}
                    ></TextInput>
                    <Text style={styles.inputLabel}>Scadenza carta</Text>
                    {errors.cardExpireMonth && <Text style={styles.warningText}>{errors.cardExpireMonth}</Text>}
                    {errors.cardExpireYear && <Text style={styles.warningText}>{errors.cardExpireYear}</Text>}
                    <View flexDirection='row' >
                        <View flexDirection="row" style={{borderWidth:1, borderColor: '#ccc', width: 120, justifyContent:'center', borderRadius: 4}}>
                            <TextInput 
                                onChangeText={ (input) => setUserFields({...userFields, cardExpireMonth: parseInt(input)}) }  
                                returnKeyType='next'
                                maxLength={2} 
                                inputMode='numeric'
                                keyboardType='numeric-pad'
                                placeholder={"MM"}
                                style={[globalStyles.textBigRegular, errors.cardExpireMonth && styles.inputErrorColor]}
                            >{userData.cardExpireMonth?.toString().padStart(2, '0')}</TextInput>
                            <Text style={{textAlignVertical: 'center'}}>/</Text>
                            <TextInput 
                                onChangeText={(input) => setUserFields({...userFields, cardExpireYear: parseInt(input)})}  
                                maxLength={4} 
                                inputMode='numeric'
                                keyboardType='numeric-pad'
                                placeholder={"AAAA"}
                                style={[globalStyles.textBigRegular, errors.cardExpireYear && styles.inputErrorColor]}
                            >{userData.cardExpireYear}</TextInput>
                        </View>
                    </View>
                    <Text style={styles.inputLabel}>CVV</Text>
                    {errors.cardCVV && <Text style={styles.warningText}>{errors.cardCVV}</Text>}
                    <TextInput 
                        onChangeText={(input) => setUserFields({...userFields, cardCVV: input.trim()})}
                        maxLength={3} 
                        inputMode='numeric'
                        keyboardType='numeric-pad'
                        defaultValue={userData.cardCVV}
                        style={[styles.input, errors.cardCVV && styles.inputErrorColor]}
                    ></TextInput>
                    
                    <View style={globalStyles.spaceArea}></View>
                    <Button title={'Conferma modifiche'} color={'green'} onPress={() => handleSubmitForm()} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    bodyContent: {
        flex:1, 
        backgroundColor: 'white', 
        paddingTop: 15, 
        paddingBottom: 10,
        paddingHorizontal:20, 
        borderTopRightRadius: 15, 
        borderTopLeftRadius: 15
    },
    warningText: {
        ...globalStyles.textSmallRegular,
        color: 'brown',
        //textAlign: 'center'
    },
    inputLabel: {
        ...globalStyles.textBigRegular,
        marginTop: 10,
    },
    input: {
        ...globalStyles.textBigRegular,
        borderWidth: 1,
        //borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4, 
        padding: 8,
    },
    inputRow: {
        ...globalStyles.textBigRegular,
        borderTopWidth: 1,
        borderBottomWidth:1,
        borderColor: '#ccc',
        borderRadius: 4, 
        padding: 8,
    },
    inputErrorColor: {
        borderColor: 'red',
    },
    centerdView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: 'green',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
});
