require('dotenv').config()

const routes = require('./backend/routes/routes')

const PORT = process.env.PORT || 8080

routes.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
