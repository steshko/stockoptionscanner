const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.get('/symbol', auth, (req, res) => require('../controllers/data/chain.symbol')(req, res) )

module.exports = router