const fetch = require("node-fetch")
module.exports = async function (context) {
    try {
        // await fetch('http://stock-master.azurewebsites.net/mining/beforeopen')
        // await fetch('http://stockoptionscanner.azurewebsites.net/mining/beforeopen')
        await fetch('http://stock-option-scanner.azurewebsites.net/mining/beforeopen')
        //comments
    } catch(e) {
        var timeStamp = new Date().toISOString();
        context.log('error:' + e.message, timeStamp);   
    }
}