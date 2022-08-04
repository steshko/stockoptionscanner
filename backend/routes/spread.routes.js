const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.get('/put', auth, (req, res) => require('../controllers/data/spread.put')(req, res) )
router.get('/call', auth, (req, res) => require('../controllers/data/spread.call')(req, res) )

module.exports = router