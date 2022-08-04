const fetch = require("node-fetch")
module.exports = async function (context) {
try {
    // await fetch('http://stock-master.azurewebsites.net/mining/beforeclose')
    // await fetch('http://stockoptionscanner.azurewebsites.net/mining/beforeclose')
    await fetch('http://stock-option-scanner.azurewebsites.net/mining/beforeclose')
} catch(e) {
    var timeStamp = new Date().toISOString();
    context.log('error:' + e.message, timeStamp);   
}
}