const {getAllPlanets} = require("../../models/planetsModel")

async function httpGetAllPlanets(req,res) {
   res.status(200).json(await getAllPlanets())
}

module.exports = {
   httpGetAllPlanets
}