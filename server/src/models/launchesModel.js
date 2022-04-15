const axios = require('axios')

const launchesDB = require('./launchesMongo')
const planets = require('./planetsMongo')

const DEFAULT_NUMBER = 100

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
	const response = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: 'rocket',
					select: {
						name: 1,
					},
				},
				{
					path: 'payloads',
					select: {
						customers: 1,
					},
				},
			],
		},
	})

	if (response.status !== 200) {
		console.log('Problem')
		throw new Error('cannot populate database')
	}

	const launchDocs = response.data.docs
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc['payloads']
		const customers = payloads.flatMap((payload) => {
			return payload['customers']
		})

		const launch = {
			flightNumber: launchDoc['flight_number'],
			mission: launchDoc['name'],
			rocket: launchDoc['rocket']['name'],
			launchDate: launchDoc['date_local'],
			upcoming: launchDoc['upcoming'],
			success: launchDoc['success'],
			customers,
		}
		console.log(launch.flightNumber)

		await saveLaunch(launch)
	}
}

async function loadLaunchesData() {
	const first = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat',
	})
	if (first) {
		console.log('Launch data already loaded')
	} else {
		await populateLaunches()
	}

	console.log(`done`)
}

async function findLaunch(filter) {
	return await launchesDB.findOne(filter)
}

async function existsId(id) {
	return await findLaunch({
		flightNumber: id,
	})
}

async function getLatestFlightNumber() {
	const latest = await launchesDB.findOne().sort('-flightNumber')

	if (!latest) {
		return DEFAULT_NUMBER
	}

	return latest.flightNumber
}

async function getAllLaunches(skip, limit) {
	return await launchesDB
		.find({}, { _id: 0, __v: 0 })
		.sort({ flightNumber: 1 })
		.skip(skip)
		.limit(limit)
}

async function saveLaunch(launch) {
	await launchesDB.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{
			upsert: true,
		}
	)
}

async function scheduleLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	})

	if (!planet) {
		throw new Error('No matching planet found')
	}

	const newFlightNumber = (await getLatestFlightNumber()) + 1

	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ['ZTM', 'NASA'],
		flightNumber: newFlightNumber,
	})

	await saveLaunch(newLaunch)
}

async function abortLaunchById(id) {
	const aborted = await launchesDB.updateOne(
		{ flightNumber: id },
		{
			upcoming: false,
			success: false,
		}
	)

	return aborted.modifiedCount === 1
}

module.exports = {
	loadLaunchesData,
	getAllLaunches,
	scheduleLaunch,
	existsId,
	abortLaunchById,
}
