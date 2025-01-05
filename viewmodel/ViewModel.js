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
            console.log("\tRegistrato! sid:", this.sid, "\n\t\t\tuid:", this.uid, " firstRun:", this.firstRun);
        } catch (err) {
            console.log("Errore durante la registrazione!", err);
        }
    }

    async otherLaunch() {
        console.log("Recupero dati utente dal DB...");

        this.sid =  await StorageManager.getSID();
        this.uid = await StorageManager.getUID();
        console.log("\tLogin! sid:", this.sid, "\n\t\t\tuid:", this.uid, " firstRun:", this.firstRun);
    }

    async fetchAllMenus(latitude, longitude) {
        console.log("(VM) Richiesta di tutti i menu...");
        const allmenus = await CommunicationController.getMenus(this.sid, latitude, longitude);
        console.log("\t...Ricevuti. Dati del primo menu:", allmenus[0]);

        allmenus.forEach( async (menu, index) => {
            const details = await this.fetchMenuDetails(menu.mid, latitude, longitude);
            allmenus[index].image = details.image;
            
            console.log("\t...Dettagli del menu scaricati: [", index ,"]", details.mid, '-', details.name);
            
        });
        return allmenus;

    }

    async fetchMenuDetails(mid, latitude, longitude) { //49 
        try {
            //Richiesta di DETAILS di un menu: mid, name, price, location, imageVersion, shortDescription, deliveryTime, longDescription
            const menuFromServer = await CommunicationController.getMenuDetails(mid, this.sid, latitude, longitude);
            const menuFromDB = await this.db.getMenuByMid(menuFromServer.mid); 
            // se non esite nel db -> return null, altrimenti menuFromDB = { mid, imageVersion e image }

            if (menuFromDB) {  
                //se esiste il menu nel db
                console.log("Menu esiste nel db...");//, menuFromDB);

                if (menuFromDB.imageVersion === menuFromServer.imageVersion) {
                    //se le versioni sono uguali, restituisco il menu dal db
                    console.log("\t...Versioni immagini uguali")
                    return {
                        ...menuFromServer,
                        image: menuFromDB.image,
                    }
                } else {
                    //se le versioni sono diverse, aggiorno l'immagine nel db
                    console.log("\t...Versioni immagini diverse")
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
      
}