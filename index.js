const axios = require('axios').default;
const FormData = require('form-data');
const fs = require('fs');
const sha1 = require('sha1');
const decryption = require('./decryption')

const TOKEN = "9ba107eb471e7c59b7d3b246514f3c40404b6e88"
const CODENATION_DATA_GENERATION_ENDPOINT = `https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${TOKEN}`
const CODENATION_SUBMIT_SOLUTION_ENDPOINT = `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${TOKEN}`
const OUTPUT_FILE_NAME = "answer.json"

let receivedDataFromCodeNation
let sha1DecryptedPhrase
let decryptedPhrase
let outputToFile

execute()

async function execute(){
    try{
        console.log(`Mission begin`)
        await getDataFromCodeNation()
        await decryptData()
        await encryptPhrase()
        await saveOnFile()
        await sendAnswerFileToCodeNation()
        console.log(`Mission completed`)
    }catch(err){
        console.error(`Mission failed because: ${err}`)
    }
    
}

async function getDataFromCodeNation(){
    const response = await axios.get(CODENATION_DATA_GENERATION_ENDPOINT);
    console.log(`Response from CodeNation: ${JSON.stringify(response.data, null, 1)}`)
    if(!response || !response.data){
        throw Error(`Something was wrong on getting data from CodeNation`)
    }
    receivedDataFromCodeNation = response.data
}


async function decryptData(){
    if(!receivedDataFromCodeNation)
        throw Error(`Can't decrypt without data from CodeNation`)

    decryptedPhrase = decryption.decrypt({
        secretDecryptionNumber: receivedDataFromCodeNation.numero_casas,
        encryptedPhrase: receivedDataFromCodeNation.cifrado
    })

    if(!decryptedPhrase)
        throw Error(`Was not possible decrypt the phrase`)
}

async function encryptPhrase(){
    if(!decryptedPhrase)
        throw Error(`Can't encrypt a empty decrypted phrase`)
    sha1DecryptedPhrase = sha1(decryptedPhrase)
    receivedDataFromCodeNation.decifrado = decryptedPhrase
    receivedDataFromCodeNation.resumo_criptografico = sha1DecryptedPhrase
}

async function saveOnFile(){
    outputToFile = JSON.stringify(receivedDataFromCodeNation, null, 1)
    fs.writeFile(`./${OUTPUT_FILE_NAME}`, outputToFile, () => {})
}

async function sendAnswerFileToCodeNation(){

    console.log(`Sending answer file to CodeNation...`)
    const formData = new FormData();
    const submitionFile = fs.createReadStream(`./${OUTPUT_FILE_NAME}`)
    formData.append('answer', submitionFile);
    axios.post(CODENATION_SUBMIT_SOLUTION_ENDPOINT, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      }).then((response) => {
        console.log(response.data)
    }).catch(err => console.log(err))
}




