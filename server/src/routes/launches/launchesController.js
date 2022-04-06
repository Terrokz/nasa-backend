const {
	getAllLaunches,
	addLaunch,
	existsId,
	abortLaunchById,
} = require('../../models/launchesModel')

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches())
}

function httpAddLaunch(req, res) {
	const launch = req.body

	if (
		!launch.mission ||
		!launch.rocket ||
		!launch.launchDate ||
		!launch.target
	) {
		return res.status(400).json({
			error: 'Missing required launch property',
		})
	}

	launch.launchDate = new Date(launch.launchDate)
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: 'Invalid launch date',
		})
	}

	addLaunch(launch)
	return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
	const id = +req.params.id

	if (!existsId(id)) {
		return res.status(404).json({ error: 'Launch not found' })
	}

	const aborted = abortLaunchById(id)
	return res.status(200).json(aborted)
}

module.exports = {
	httpGetAllLaunches,
	httpAddLaunch,
	httpAbortLaunch,
}
