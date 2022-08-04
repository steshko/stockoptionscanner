const sg = require('@sendgrid/mail')
const config = require('../config')()

module.exports = async function sendEmail(recipient, templateId, variables)  {
    try{

        const msg = {
            to: recipient,
            from: config.emailFrom,
            templateId: templateId,
            dynamicTemplateData: variables,
        }
        sg.setApiKey(config.sendGridApiKey)

        return await sg.send(msg);

    } catch( error ) {
        console.error('Error sending SendGrid email.');
        console.error(error.response.body);
    }
}


