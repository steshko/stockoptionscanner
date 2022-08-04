module.exports = function get() {

    const mongoUri = process.env.mongoUri
    const MODE = process.env.MODE
    const JWT = process.env.JWT
    return {
        mode: MODE,
        emailFrom: 'steshko@proximatics.ru',
        emailTemplateRegister: 'd-ce4eb853371c4e5c8c45190684a543e4',
        emailTemplateReset: 'd-3000fee7c7f84d59ab2374d47e9a8c05',
        emailTemplateChangeEmail: 'd-a0bfae74c31b44619f992864273b1472',

        sendGridApiKey:'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',
        database: {
            connection: mongoUri,
            transactions: false
        },
        authJwtSecret: JWT,
        clientUrl: 'https://stockoptionscanner.azurewebsites.net',
        
        // bestMaxDaysToExp: 10,
        best: {
            maxDaysToExp: 5,
            covered: {
                minInterest: 70,
                minDiscount: 15,
            },
            spreads: {
                minAmount: 0.05,
                minInterest: 100,
                minDiscount: 15,
            }
        },
        spread: {
            putInterest: 80,
            putDiscount: 15,
            putAmountMin: 0.05, //для разницы между страйками <= 1
            putAmountMax: 0.20,  //для разницы страйками  > 1

            callInterest: 80,
            callDiscount: 15,
            callAmountMin: 0.05, //для разницы между страйками <= 1
            callAmountMax: 0.20  //для разницы страйками  > 1
        },
        covered: {
            // # Для сохранения covered call в базу 
            // #Что применять ITM_DEEP_INTEREST или ITM_INTEREST, 
            // #например 0.9 - 10% и больше дисконт по страйку применяет ITM_DEEP_INTEREST
            itmDeepStrikeRate: 0.9,
            // # ITM Сохранение первого страйка
            itmInterest: 60,
            // # ITM Сохранение второго и более страйка
            itmDeepInterest: 40,
            // # OTM Сохранение второго и более страйка
            otmInterest: 100,
        }        
    }
}
  