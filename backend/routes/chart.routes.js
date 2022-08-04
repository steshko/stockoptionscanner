const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.get('/movers', auth, (req, res) => require('../controllers/chart/movers')(req, res) )

module.exports = router