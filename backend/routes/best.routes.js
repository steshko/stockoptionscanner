const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.get('/covered', auth, (req, res) => require('../controllers/best/best.covered')(req, res) )
router.get('/spreadsput', auth, (req, res) => require('../controllers/best/best.spreads.put')(req, res) )

module.exports = router