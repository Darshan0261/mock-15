const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/User.model');
const { SALTROUNDS, JWTKEY } = require('../configs/config')

const router = express.Router();

router.get('/', async (req, res) => {
    const user = await UserModel.find();
    res.send(user)
})

router.get('/:id', async (req, res) => {
    const id = req.params['id'];
    try {
        const user = await UserModel.findOne({ _id: id });
        if (!user) {
            return res.status(404).send({ message: 'User Not Found' });
        }
        res.send({
            name: user.name, _id: user.id, email: user.email, profile_pic: user.profile_pic
        });
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

router.post('/register', async (req, res) => {
    const { name, email, password, profile_pic } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ message: 'Name, Email and Password Required' });
    }
    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(409).send({ message: 'Email Already Registerd' });
        }
        bcrypt.hash(password, SALTROUNDS, async (err, hashedPass) => {
            if (err) {
                return res.status(501).send({ message: err.message });
            }
            try {
                const user = new UserModel({
                    name, email,
                    password: hashedPass,
                    profile_pic: profile_pic || ''
                });
                await user.save();
                return res.status(201).send({ message: 'User Registerd Sucessfully' });
            } catch (error) {
                res.status(501).send({ message: error.message })
            }
        })
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not registered' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(501).send({ message: err.message });
            }
            if (!result) {
                return res.status(401).send({ message: 'Wrong Credentials' });
            }
            const token = jwt.sign({ id: user._id }, JWTKEY);
            res.cookie('token', token);
            res.status(202).send({ message: 'User Login Sucessfull', token });
        })
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

module.exports = router;