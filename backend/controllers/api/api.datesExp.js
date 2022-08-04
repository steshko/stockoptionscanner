const Covered = require('../../database/models/Covered')

module.exports = async function coveredIn(req, res)  {
    try{

        const dates = await Covered.distinct('expDate').sort().exec()

        return res.json(dates)

    } catch( error ) {
        if ([400, 401, 403, 404].includes(error.code)) {
            return res.status(error.code).send(error.message);
        }
      
        console.error(error);
        return res.status(500).send(error.message);
    }
}
