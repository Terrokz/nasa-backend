const http = require('http')
const app = require('./app')

const { loadPlanets } = require('./models/planetsModel')

const port = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
	await loadPlanets()

	server.listen(port, () => {
		console.log(`Listening on port ${port}`)
	})
}

startServer()

