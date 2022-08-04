const fetch = require("node-fetch")
module.exports = async function (context) {
try {
    // await fetch('http://stock-master.azurewebsites.net/mining/afterclose')
    // await fetch('http://stockoptionscanner.azurewebsites.net/mining/afterclose')
    await fetch('http://stock-option-scanner.azurewebsites.net/mining/afterclose')
} catch(e) {
    var timeStamp = new Date().toISOString();
    context.log('error:' + e.message, timeStamp);   
}
}