const models = require("../models/index")

exports.createRole = async(req, res) => {
    try{
    const { roleName, status, description} = req.body
    const data = await models.role.create({ role_name:roleName, status, description})
    res.status(201).send({ data })
    }catch(error){
        res.status(500).send({ e: error.message })
    }
}