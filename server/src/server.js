const http = require('http')
require('dotenv').config()

const app = require('./app')
const { mongoConnect } = require('./services/mongo')
const { loadPlanets } = require('./models/planetsModel')
const { loadLaunchesData } = require('./models/launchesModel')

const port = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
	await mongoConnect()
	await loadPlanets()
	await loadLaunchesData()

	server.listen(port, () => {
		console.log(`Listening on port ${port}`)
	})
}

startServer()
