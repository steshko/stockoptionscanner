const Dividend = require('../../database/models/Dividend')

module.exports = async function dividend(req, res)  {
    try{

        const result = await Dividend.find({})

        return res.json(result)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
