const moment = require("moment")
const bcrypt = require("bcrypt");
const models = require("../models/index")
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
    try {
        const { emailId, phoneNumber, firstName, lastName,password, addressLine1, addressLine2, city, pincode, type, profilePicture } = req.body
        const existingUser = await models.user.findOne({
            where: { emailId }
        })
        console.log(profilePicture)

        if (existingUser) {
            return res.status(409).send({ error: true, msg: "Email exists" })
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);
        console.log(hashPassword)
        const data = await models.user.create({ emailId, phoneNumber, firstName, lastName, password: hashPassword, profile_picture: profilePicture })
        const address = await models.Address.create({userId:data.id,addressLine1, addressLine2, city, pincode, type})
        
        res.status(201).send({ data })
    } catch (error) {
        res.status(500).send({ e: error.message })
    }
};

exports.getAllUsers = async (req, res) => {
    // const users = userDetails
    const data = await models.user.findAll({
        include: [{
            model: models.role
        }]
    })
    // res.send({data:users}) 
    res.status(200).send({ data })
};

exports.updateUser = async (req, res) => {
    const userId = req.headers['x-user-id']
    const { firstName, lastName, userRole } = req.body
    const data = await models.user.update({ firstName, lastName, user_role: userRole }, {
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
exports.sendOtp = async (req, res) => {
    try {
        const { emailId } = req.body;
        const existingUser = await models.user.findOne({
            where: { emailId }
        })

        if (!existingUser) {
            return res.status(409).send({ error: true, msg: "Id is not present" })
        }
        const userOtp = generateUserOtp();
        const expiry_time = moment().add(10, 'minutes');
        const userIdExist = await models.Otp.findOne({
            where: {
                userId: existingUser.id
            }
        }

        )
        if (userIdExist) {
            const data = await models.Otp.update({ otp: userOtp, expiry_time }, {
                where: {
                    userId: existingUser.id
                }
            })
            //send otp to email
            return res.status(200).send({ msg: "OTP sent successfully!" });
        }
        const data = await models.Otp.create({ userId: existingUser.id, otp: userOtp, expiry_time })


        //send otp to email
        res.status(200).send({ msg: "OTP sent successfully!" });
    } catch (error) {
        res.status(500).send({ error: true, msg: error.message });
    }
};

const generateUserOtp = () => {
    const a = Math.random()
    const otp = Math.floor(a * 10000)
    return otp
}

exports.verifyOtp = async (req, res) => {
    try {
        const { emailId, otp } = req.body
        const existingUser = await models.user.findOne({
            where: { emailId }
        })


        if (!existingUser) {
            return res.status(409).send({ error: true, msg: "Id is not present" })
        }
        const userOtp = await models.Otp.findOne({
            where: { userId: existingUser.id }
        })
        if (userOtp.otp == otp) {
            const requestedAt = moment(userOtp.expiry_time); // ISO string or Date object
            const now = moment();
            const active = "ACTIVE"
            console.log(now.isAfter(requestedAt, 'minutes'))
            if (!now.isAfter(requestedAt, 'minutes')) {
                await models.user.update({status:active}, {
                    where:{
                        id:userOtp.userId
                    }
                })

                return res.status(200).send({ error: false, msg: "Otp verified Succesfully!" })
            } else {
                return res.status(400).send({ error: true, msg: "Otp expired!" })
            }

        }
        return res.status(400).send({ error: true, msg: "Enter the Otp correctly!" })
    } catch (error) {
        res.status(500).send({ e: error.message })
    }
}
