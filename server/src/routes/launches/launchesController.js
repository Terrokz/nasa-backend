const {
	getAllLaunches,
	scheduleLaunch,
	existsId,
	abortLaunchById,
} = require('../../models/launchesModel')

const { getPagination } = require('../../services/query')

async function httpGetAllLaunches(req, res) {
	const { skip, limit } = getPagination(req.query)
	const launches = await getAllLaunches(skip, limit)
	return res.status(200).json(launches)
}

async function httpAddLaunch(req, res) {
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
	try {
		await scheduleLaunch(launch)
		return res.status(201).json(launch)
	} catch (err) {
		return res.status(400).json({
			error: `Could not schedule a new launch(probably bad planet name)`,
		})
	}
}

async function httpAbortLaunch(req, res) {
	const id = +req.params.id
	const existsLaunch = await existsId(id)

	if (!existsLaunch) {
		return res.status(404).json({ error: 'Launch not found' })
	}

	const aborted = await abortLaunchById(id)
	if (!aborted) {
		return res.status(400).json({
			error: 'Launch not aborted',
		})
	}
	return res.status(200).json({ ok: true })
}

module.exports = {
	httpGetAllLaunches,
	httpAddLaunch,
	httpAbortLaunch,
}
