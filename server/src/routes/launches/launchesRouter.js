const express = require('express')
const {
	httpGetAllLaunches,
	httpAddLaunch,
	httpAbortLaunch,
} = require('./launchesController')

const launchesRouter = express.Router()

launchesRouter
	.get('/', httpGetAllLaunches)
	.post('/', httpAddLaunch)
	.delete('/:id', httpAbortLaunch)
module.exports = launchesRouter
