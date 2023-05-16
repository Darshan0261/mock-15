const router = require('express').Router();

const { authentication } = require('../middlewares/authentication');
const { UserModel } = require('../models/User.model');

router.get('/', authentication, async (req, res) => {
    const { userInfo } = req.body;
    try {
        const user = await UserModel.findOne({ _id: userInfo.id });
        if (!user) {
            return res.status(404).send({ message: 'User Not Found' });
        }
        const contacts = user.contacts;
        res.send(contacts);
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

router.post('/', authentication, async (req, res) => {
    const { email, name, userInfo } = req.body;
    if (!email || !name) {
        return res.status(400).send({ message: 'Email and Name is Required' });
    }
    try {
        const user = await UserModel.findOne({ _id: userInfo.id });
        if (user.contacts.some(ele => {
            return ele.email === email;
        })) {
            return res.status(409).send({ message: 'Email Already In Contacts' })
        }
        const contact = await UserModel.findOne({ email });
        if (!contact) {
            return res.status(404).send({ message: `User with ${email} is not Registered` });
        }
        user.contacts.push({ email, name });
        await user.save();
        res.send({ message: 'Contact Added' });
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

router.delete('/', authentication, async (req, res) => {
    const { email, userInfo } = req.body;
    if (!email) {
        return res.status(400).send({ message: 'Email is Required' })
    }
    try {
        const user = await UserModel.findOne({ _id: userInfo.id });
        if (!user.contacts.some(ele => {
            return ele.email === email;
        })) {
            return res.status(409).send({ message: 'Email Not In Contacts' })
        }
        const contacts = user.contacts.filter(ele => {
            return ele.email !== email;
        })
        user.contacts = contacts;
        await user.save();
        res.send({ message: 'Contact Removed Sucessfully' });
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

module.exports = router;