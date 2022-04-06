const launches = new Map()

let latestFlightNumber = 100

const launch = {
	flightNumber: 100,
	mission: 'Mission name 1',
	rocket: 'Explorer IS1',
	launchDate: new Date('December 27, 2030'),
	target: 'Kepler-442 b',
	customer: ['ZTM', 'NASA'],
	upcoming: true,
	success: true,
}

launches.set(launch.flightNumber, launch)

function existsId(id) {
	return launches.has(id)
}

function getAllLaunches() {
	return Array.from(launches.values())
}

function addLaunch(launch) {
	latestFlightNumber++
	launches.set(
		latestFlightNumber,
		Object.assign(launch, {
			customer: ['ZTM', 'NASA'],
			upcoming: true,
			success: true,
			flightNumber: latestFlightNumber,
		})
	)
}

function abortLaunchById(id) {
	const aborted = launches.get(id)
	aborted.upcoming = false
	aborted.success = false
	return aborted
}

module.exports = {
	getAllLaunches,
	addLaunch,
	existsId,
	abortLaunchById,
}
