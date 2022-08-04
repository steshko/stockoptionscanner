const Earning = require('../../database/models/Earning')

module.exports = async function earning(req, res)  {
    try{

        const result = await Earning.find({})

        return res.json(result)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
