const DEFAULT_LIMIT = 0
const DEFAULT_PAGE = 1

function getPagination(query) {
	const limit = Math.abs(query.limit) || DEFAULT_LIMIT
	const page = Math.abs(query.page) || DEFAULT_PAGE
	const skip = limit * (page - 1)

	return {
		skip,
		limit,
	}
}

module.exports =  {
   getPagination
}
