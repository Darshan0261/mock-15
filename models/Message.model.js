const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender_email: String,
    recipent_email: String,
    message: String,
    time: Date
})

const MessageModel = mongoose.model('message', MessageSchema);

module.exports = {
    MessageModel
}