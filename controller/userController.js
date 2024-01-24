const bcrypt = require('bcrypt')
const { generateToken } = require('../middleware/jwtMiddleware')
const User = require('../model/User')

exports.create = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Email and password are required"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username: email, password: hashedPassword
        })
        const userResponse = user.toJSON();
        delete userResponse.password;
        const token = generateToken(userResponse);
        res.status(201).json({ user: userResponse, token })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: true,
                message: 'Email já utilizado.',
            });
        }
        next(err);
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

exports.findById = async (req, res, next) => {
    try {
        const { params: { id } } = req
        const user = await User.findOne({
            where: {
                uuid: id
            }
        })
        if (!user) {
            res.status(404).json({
                error: true,
                message: "User not found"
            })
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
}

exports.UpdateById = async (req, res, next) => {
    try {
        const { params: { id } } = req
        const { email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.update({ password: hashedPassword }, {
            where: {
                uuid: id,
                username: email
            }
        })
        res.json({ msg: "User updated" })
    } catch (error) {
        next(error)
    }
}

exports.deleteById = async (req, res, next) => {
    try {
        const { params: { id } } = req
        await User.destroy({
            where: {
                uuid: id
            }
        })
        res.json({ msg: "User deleted" })
    } catch (error) {
        next(error)
    }
}