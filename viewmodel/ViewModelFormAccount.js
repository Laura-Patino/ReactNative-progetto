export default class ViewModelFormAccount {

    static validateFirstName(firstName) {
        return firstName && firstName.length > 0 && firstName.length <= 15;
    }

    static validateLastName(lastName) {
        return lastName && lastName.length > 0 && lastName.length <= 15;
    }

    static validateCardFullName(cardFullName) {
        return cardFullName && cardFullName.length > 0 && cardFullName.length <= 30;
    }

    static validateCardNumber(cardNumber) {
        //console.log("(VMFA) Card number:", cardNumber, "res:", !isNaN(Number(cardNumber)));
        return cardNumber && cardNumber.length === 16 && !isNaN(Number(cardNumber));
    }

    static validateCardExpireMonth(cardExpireMonth) {
        //console.log("(VMFA) Mese:", cardExpireMonth," tipo:", typeof(cardExpireMonth)); //cardExpireMonth.toString().length === 2 //problema con 01, 02, ecc.
        return cardExpireMonth && cardExpireMonth >= 1 && cardExpireMonth <= 12;
    }

    static validateCardExpireYear(cardExpireYear) {
        //console.log("(VMFA) Anno:", cardExpireYear, "tipo:", typeof(cardExpireYear));
        return cardExpireYear && cardExpireYear.toString().length === 4 && cardExpireYear >= 2025;
    }

    static validateCardCVV(cardCVV) {
        return cardCVV && cardCVV.length === 3;
    }
}