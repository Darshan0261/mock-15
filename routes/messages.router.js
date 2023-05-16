const router = require('express').Router();
const { authentication } = require('../middlewares/authentication');
const { MessageModel } = require('../models/Message.model');
const { UserModel } = require('../models/User.model');

router.post('/', authentication, async (req, res) => {
    const { recipent_email, userInfo } = req.body;
    const userId = userInfo.id;
    if (!recipent_email) {
        return res.status(400).send({ message: 'Recipent Email Required' });
    }
    try {
        const user = await UserModel.findOne({ _id: userId });
        const messages = await MessageModel.find({ sender_email: user.email, recipent_email });
        res.send(messages)
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

module.exports = router;