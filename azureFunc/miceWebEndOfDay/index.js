const fetch = require("node-fetch")

module.exports = async function (context) {
    try {
        // await fetch('https://mice-web.azurewebsites.net/api/tasks/end')
        await fetch('https://mice-acc.azurewebsites.net/api/tasks/end')
    } catch(e) {
        // var timeStamp = new Date().toISOString();
        // context.log('error:' + e.message, timeStamp);   
    }
}