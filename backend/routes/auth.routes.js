const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

router.post('/login', (req, res) => require('../controllers/auth/auth.login')(req, res) )
router.post('/token', auth, (req, res) =>  require('../controllers/auth/auth.token')(req, res) )
router.post('/register', (req, res) => require('../controllers/auth/auth.register')(req, res) )
router.post('/forgot', (req, res) => require('../controllers/auth/auth.forgot')(req, res))
router.post('/confirm', (req, res) => require('../controllers/auth/auth.confirm')(req, res))
router.post('/change', auth, (req, res) => require('../controllers/auth/auth.change')(req, res) )
router.post('/reset', auth, (req, res) => require('../controllers/auth/auth.reset')(req, res) )
router.post('/changeemail', auth, (req, res) => require('../controllers/auth/auth.change.email')(req, res) )
router.post('/sendconfirm', auth, (req, res) => require('../controllers/auth/auth.send.confirm')(req, res) )
router.get('/userExists', (req, res) => require('../controllers/auth/auth.exists')(req, res) )
router.post('/industrycolor', auth, (req, res) => require('../controllers/auth/auth.industrycolor')(req, res) )

module.exports = router