const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.get('/last', auth, (req, res) => require('../controllers/top/top.last')(req, res) )

module.exports = router