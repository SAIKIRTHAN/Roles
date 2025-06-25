const bcrypt = require("bcrypt");
const models = require("../models/index")
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
    try {
        const { emailId, phoneNumber, firstName, lastName, products, password } = req.body
        const existingUser = await models.user.findOne({
            where: { emailId }
        })

        if (existingUser) {
            return res.status(409).send({ error: true, msg: "Email exists" })
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);
        console.log(hashPassword)
        const data = await models.user.create({ emailId, phoneNumber, firstName, lastName, products, password: hashPassword })
        res.status(201).send({ data })
    } catch (error) {
        res.status(500).send({ e: error.message })
    }
};

exports.getAllUsers = async (req, res) => {
    // const users = userDetails
    const data = await models.user.findAll({
    include:[{
        model:models.role
    }]    
})
    // res.send({data:users}) 
    res.status(200).send({ data })
};

exports.updateUser = async (req, res) => {
    const userId = req.headers['x-user-id']
    const {firstName, lastName, userRole} = req.body
    const data = await models.user.update({firstName, lastName, user_role:userRole}, {
        where: {
            id: userId
        }
    })
    res.status(200).send({ data })
    // res.send({data:users})
};

exports.getUserById = async (req, res) => {
    const userId = req.headers['x-user-id']
    const data = await models.user.findOne({
        where: {
            id: userId
        }
    })
    res.status(200).send({ data })
};

exports.deleteUserById = async (req, res) => {
    const userId = req.headers['x-user-id']
    const data = await models.user.destroy({
        where: {
            id: userId
        }
    })
    res.status(200).send({ data })
    // res.send({data:users})
};

exports.login = async (req, res) => {
    try {
        const { emailId, password } = req.body
        const existingUser = await models.user.findOne({
            where: { emailId }
        })

        if (!existingUser) {
            return res.status(409).send({ error: true, msg: "Id is not present" })
        }

        const isCorrect = bcrypt.compareSync(password, existingUser.password);

        if (!isCorrect) {
            return res.status(409).send({ error: true, msg: "Enter correct password" })
        }

        // Sample payload
        const payload = {
            userId: existingUser.id,
            email: existingUser.emailId,
        };

        // Secret key (store this securely in .env)
        const secretKey = 'your_secret_key_here';

        // Token expiry (optional)
        const options = {
            expiresIn: '60m', // or '7d', '15m', etc.
        };

        // Create token
        const token = jwt.sign(payload, secretKey, options);

        res.status(200).send({ error: false, data: { userId: existingUser.id, userName: existingUser.firstName, token } })

    } catch (error) {
        res.status(500).send({ e: error.message })
    }
}

exports.getUsersByNameSearch = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await models.user.findAll({
            where: {
                firstName: {
                    [Op.iLike]: `%${search}%`
                }
            }
        });

        res.status(200).send({ data });
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message });
    }
};