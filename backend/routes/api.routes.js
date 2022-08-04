const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.get('/datesexp', (req, res) => require('../controllers/api/api.datesExp')(req, res) )
router.get('/earnings', (req, res) => require('../controllers/api/api.earnings')(req, res) )
router.get('/dividends', (req, res) => require('../controllers/api/api.dividends')(req, res) )
router.get('/serverlog', (req, res) => require('../controllers/api/api.serverlog')(req, res) )
router.get('/symbollog', (req, res) => require('../controllers/api/api.symbollog')(req, res) )

module.exports = router