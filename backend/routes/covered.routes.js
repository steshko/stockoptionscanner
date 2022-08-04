const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.get('/in', auth, (req, res) => require('../controllers/data/covered.in')(req, res) )
router.get('/out', auth, (req, res) => require('../controllers/data/covered.out')(req, res) )

module.exports = router