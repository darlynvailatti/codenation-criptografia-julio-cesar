exports.decrypt = function(decryptPayload){
    const decryptionBaseExpression = "abcdefghijklmnopqrstuvwxyz"
    let decryptedPhrase = ""

    const secretDecryptionNumber = decryptPayload.secretDecryptionNumber
    const encryptedPhrase = decryptPayload.encryptedPhrase
    
    console.log(`Secret decryption number: ${secretDecryptionNumber}`)
    console.log(`Phrase to decrypt: ${encryptedPhrase}`)

    const sizeOfPhrase = encryptedPhrase.length
    for(let i = 0; i < sizeOfPhrase; i++){
        let letter = encryptedPhrase[i]
        if(!letter) {
            continue;
        }
            
        let isValidLetterToDecrypt = decryptionBaseExpression.includes(letter)
        if(!isValidLetterToDecrypt){
            decryptedPhrase = decryptedPhrase.concat(letter)
        }else{
            let decryptedLetter = ""
            let indexOfDecryptionLetterInBaseExpression = decryptionBaseExpression.indexOf(letter)
            let decryptedIndex = (indexOfDecryptionLetterInBaseExpression - secretDecryptionNumber)

            if(decryptedIndex < 0){
                decryptedIndex =  decryptionBaseExpression.length + decryptedIndex;
            }
            
            decryptedLetter = decryptionBaseExpression[decryptedIndex]
            decryptedPhrase = decryptedPhrase.concat(decryptedLetter)     
        } 
    }

    console.log(`Decrypted phrase: ${decryptedPhrase}`)
    return decryptedPhrase
}