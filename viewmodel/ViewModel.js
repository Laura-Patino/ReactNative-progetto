import StorageManager from "../model/StorageManager";
import DBController from "../model/DBController";
import CommunicationController from "../model/CommunicationController";

export default class ViewModel {
    static instance = null;

    constructor() {
        if (ViewModel.instance) {
            return ViewModel.instance;
        }
        ViewModel.instance = this;

        this.db = new DBController();
        this.sid = null,
        this.uid = null,
        this.firstRun = null
    }

    async saveLastScreenOnAsyncStorage(screen, value) {
        try {
            await StorageManager.setItemByKey('lastScreen', screen);

            if (screen === 'UpdateProfilo') {
                await StorageManager.setItemByKey('userData', value);
            } else if (screen === 'Dettagli') {
                await StorageManager.setItemByKey('selectedMenu', value);
            }
        } catch (error) {
            console.error("(VM) Errore salvataggio dell'ultimo screen:", error);
        }
    }

    async getLastScreenFromAsyncStorage() {
        try {
            return await StorageManager.getItemByKey('lastScreen');
        } catch (error) {
            console.error("(VM) Errore recupero dell'ultimo screen:", error);
        }
    }

    // async saveUserDataOnAsyncStorage(userData) {
    //     try {
    //         await StorageManager.setItemByKey('userData', userData);
    //     } catch (error) {
    //         console.error("(VM) Errore salvataggio dati utente in AsyncStorage:", error);  
    //     }
    // }

    async getUserDataFromAsyncStorage() {
        try {
            return await StorageManager.getItemByKey('userData');
        } catch (error) {
            console.error("(VM) Errore recupero dati utente da AsyncStorage:", error);
        }
    }

    // async saveSelectedMenuOnAsyncStorage(selectedMenu) {
    //     try {
    //         await StorageManager.setItemByKey('selectedMenu', selectedMenu);
    //     } catch (error) {
    //         console.error("(VM) Errore salvataggio menu selezionato in AsyncStorage:", error);
    //     }
    // }

    async getSelectedMenuFromAsyncStorage() {
        try {
            return await StorageManager.getItemByKey('selectedMenu');
        } catch (error) {
            console.error("(VM) Errore recupero menu selezionato da AsyncStorage:", error);
        }
    }

    getSessionUser() {
        return {
            sid: this.sid,
            uid: this.uid,
            firstRun: this.firstRun,
        }
    }

    async initializeApp() {
        const isFirstRun = await StorageManager.isFirstRun(); 
        
        if (isFirstRun) { 
            console.log("(VM) primo avvio");
            this.firstRun = true;
            await this.firstLaunch(); 
        } else {
            console.log("(VM) secondo avvio");
            this.firstRun = false;
            await this.otherLaunch();
        }
        return {
            sid: this.sid,
            uid: this.uid,
            firstRun: this.firstRun,
        }
   }

    async firstLaunch() {
        console.log("Registrazione...");
        try {
            const sessionKeys = await CommunicationController.registerUser();
            await StorageManager.saveSessionKeysInLocalStorage(sessionKeys.sid, sessionKeys.uid);
            
            this.sid = sessionKeys.sid;
            this.uid = sessionKeys.uid;
            console.log("Utente registrato correttamente. SID:", this.sid, "e UID:", this.uid);
        } catch (err) {
            console.log("Errore durante la registrazione!", err);
        }
    }

    async otherLaunch() {
        console.log("Recupero dati utente dal DB...");

        this.sid =  await StorageManager.getSID();
        this.uid = await StorageManager.getUID();
        console.log("Dati utente SID:", this.sid, "UID:", this.uid);
    }

    async fetchAllMenus(latitude, longitude) {
        console.log("(VM) Richiesta di tutti i menu...");
        try {
            const allmenus = await CommunicationController.getMenus(this.sid, latitude, longitude);
            //console.log("\t...Ricevuti", allmenus.length); 
            return allmenus;
        } catch (error) {
            console.error("Errore nel recupero di tutti i menu:", error);
        }
    }

    async fetchMenuImage(mid, imageVersion) {
        try {
            const menuImageFromDB = await this.db.getImageMenu(mid, imageVersion); //menu in DB e versione immagine corrispondono

            if (menuImageFromDB) {
                console.log("(VM)...Menu", mid ,"trovato nel db, versione immagine corrispondenti");
                return menuImageFromDB.image;
            }

            const menuInfoFromDB = await this.db.getMenuByMid(mid); //menu in DB ma versione immagine diversa
            const newImageFromServer = await CommunicationController.getMenuImage(mid, this.sid);

            let imageWithPrefix = newImageFromServer.base64;
            if (!imageWithPrefix.startsWith("data:image/png;base64,")) 
                imageWithPrefix = "data:image/png;base64," + newImageFromServer.base64;

            if (menuInfoFromDB && menuInfoFromDB.imageVersion !== imageVersion) {
                console.log("(VM)...Menu", mid ," trovato nel db, ma immagini diverse [", menuInfoFromDB.imageVersion, imageVersion, "]");
                await this.db.updateMenuImage(mid, imageVersion, imageWithPrefix);
                return imageWithPrefix;
            } else {
                //console.log("(VM)...Menu ", mid, "nuovo, non trovato nel db");
                await this.db.insertMenuImage(mid, imageVersion, imageWithPrefix);
                return imageWithPrefix;
                
            }
        } catch (error) {
            console.error("Errore recupero solo immagine menu: ", error);
            
        }
        
    }

    async fetchMenuDetails(mid, latitude, longitude) { //49 
        try {
            //Richiesta MenuDetails: mid, name, price, location, imageVersion, shortDescription, deliveryTime, longDescription
            const menuFromServer = await CommunicationController.getMenuDetails(mid, this.sid, latitude, longitude);
            const menuFromDB = await this.db.getMenuByMid(menuFromServer.mid); 
            // se non esite nel db -> return null, altrimenti menuFromDB = { mid, imageVersion e image }

            if (menuFromDB) {  
                //se esiste il menu nel db

                if (menuFromDB.imageVersion === menuFromServer.imageVersion) {
                    //se le versioni sono uguali, restituisco il menu dal db
                    //console.log("\t...Menu presente nel db. Versioni immagini uguali")
                    return {
                        ...menuFromServer,
                        image: menuFromDB.image,
                    }
                } else {
                    //se le versioni sono diverse, aggiorno l'immagine nel db
                    //console.log("\t...Menu presente nel db. Versioni immagini diverse")
                    //scarico dal server l'immagine aggiornata
                    const imageFromServer = await CommunicationController.getMenuImage(menuFromServer.mid, this.sid); 
                    //aggiorno l'immagine e la versione nel db
                    let imageWithPrefix = imageFromServer.base64;
                    if (!imageWithPrefix.startsWith("data:image/png;base64,")) 
                        imageWithPrefix = "data:image/png;base64," + imageFromServer.base64;

                    await this.db.updateMenuImage(mid, menuFromServer.imageVersion, imageWithPrefix);

                    return {
                        ...menuFromServer,
                        image: imageWithPrefix,
                    }
                } 
            } else {
                //se il menu non è presente nel db, lo aggiungo
                console.log("Inserimento menu nel db...")
                const imageFromServer = await CommunicationController.getMenuImage(menuFromServer.mid, this.sid); //ottengo l'immagine del menu
                //console.log("\tImmagineFromServer", imageFromServer); //base64: '/9j/...'

                let imageWithPrefix = imageFromServer.base64;
                if (!imageWithPrefix.startsWith("data:image/png;base64,")) 
                    imageWithPrefix = "data:image/png;base64," + imageFromServer.base64;

                await this.db.insertMenuImage(menuFromServer.mid, menuFromServer.imageVersion, imageWithPrefix); //salvo nel db

                return {
                    ...menuFromServer,
                    image: imageWithPrefix,
                }
            }

        } catch (err) {
            console.error("Errore nel recupero dei dati del menu", err);
        }
    }
      
    async getUserDetails() {
        try {
            const fieldsUser = await CommunicationController.getUserInfo(this.uid, this.sid);
            return fieldsUser;
            
        } catch (error) {
            console.error("Errore nel recupero delle informazioni dell'utente:", error);
        }
    }

    async updateUserDetails(userData) {
        try {
            await CommunicationController.updateUserInfo(this.uid, this.sid, userData);
            if (await StorageManager.getItemByKey("isRegister") === null) {
                await StorageManager.setItemByKey("isRegister", true);
            }
            return "Dati utente aggiornati con successo!";
        } catch (error) {
            console.error("Errore durante l'aggiornamento dei dati dell'utente:", error);
            return "Errori nei dati inseriti. Controlla i campi e riprova.";
        }
    }

    async userIsRegistered() {
        try {
            return await StorageManager.getItemByKey("isRegister");

        //     const fieldsUser = await this.getUserDetails();
        //     //return null se uno dei campi è null
        //     return (fieldsUser && fieldsUser.firstName && fieldsUser.lastName && fieldsUser.cardFullname && fieldsUser.cardNumber && fieldsUser.cardCVV && fieldsUser.cardExpireMonth && fieldsUser.cardExpireYear);
        } catch (error) {
            console.error("(userIsRegistered) Errore controllo dati utente:", error);
        }
        
    }

    async buyMenu(mid, latitude, longitude) {
        const bodyParams = {
            sid: this.sid,
            deliveryLocation: {
                lat: latitude,
                lng: longitude,
            }
        }

        try {
            const order = await CommunicationController.createOrder(mid, bodyParams);
            return order;
        } catch (error) {
            console.log("Errore durante l'acquisto del menu:", error); //error removed
        }
    }

    async hasOrderInProgress() {
        try {
            const order = await this.getUserDetails();
            console.log("(hasOrderInProgress) Order: oid=", order.lastOid, " status=", order.orderStatus);
            if (order.lastOid && order.orderStatus == "ON_DELIVERY") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("(hasOrderInProgress) Errore:", error);
        }
    }

    async getOrderDetails(oid) {
        // ottengo oid, mid, uid, creationTimeStamp, status, deliveryLocation, deliveryTimestamp, expectedDeliveryTimestamp, currentPosition
        try {
            const order = await CommunicationController.getOrderInfo(oid, this.sid);
            return order;
        } catch (error) {
            console.error("Errore durante il recupero dei dettagli dell'ordine:", error);
        }
    }
}